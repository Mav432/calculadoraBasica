import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../services/auth';

// Definir el tipo para el contexto
type AuthContextType = {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string, userData?: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Mover lastRefreshTime dentro del componente y usar useRef para evitar re-renderizados
    const lastRefreshTimeRef = useRef(0);

    // Comprobar si hay un usuario al montar el componente
    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');

                if (token) {
                    try {
                        const userData = await getProfile();
                        setUser(userData);
                    } catch (error) {
                        console.error('Error obteniendo perfil:', error);
                        // Si hay error, eliminar el token para evitar ciclos de error
                        await AsyncStorage.removeItem('token');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    // Función para iniciar sesión
    const login = async (token: string, userData?: any) => {
        setLoading(true);
        try {
            await AsyncStorage.setItem('token', token);

            if (userData) {
                setUser(userData);
            } else {
                // Si no se proporciona userData, obtenerlo del API
                try {
                    const profileData = await getProfile();
                    setUser(profileData);
                } catch (error) {
                    console.error('Error obteniendo perfil después de login:', error);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        setLoading(true);
        try {
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para refrescar los datos del usuario
    const refreshUser = async () => {
        const now = Date.now();
        const REFRESH_COOLDOWN = 2000; // 2 segundos mínimo entre cada refresh

        // Si pasó poco tiempo desde el último refresh, ignorar
        if (now - lastRefreshTimeRef.current < REFRESH_COOLDOWN) {
            console.log('🔄 Refresh ignorado (demasiado pronto)');
            return;
        }

        lastRefreshTimeRef.current = now;
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            console.log('🔄 Ejecutando refreshUser real');
            const userData = await getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Error refrescando usuario:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};