// app/(tabs)/account/index.tsx
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../src/contexts/AuthContext';
import ProfileScreen from '../../../src/screens/ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Rutas
import { ROUTES } from '../../../src/constants/routes';

// Colores personalizados para tema de agricultura
const agriColors = {
  primary: '#2E7D32', // Verde oscuro
  secondary: '#81C784', // Verde claro
  background: '#F5F9F5', // Fondo ligeramente verde
  surface: '#FFFFFF',
  accent: '#33691E', // Verde intenso para acentos
  text: '#1B5E20', // Verde oscuro para texto
};

export default function AccountScreen(): JSX.Element {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  // Usar useRef en lugar de useState para evitar re-renderizados
  const lastRefreshTimeRef = React.useRef(0);

  useFocusEffect(
    useCallback(() => {
      console.log('🔍 Pestaña Account recibió foco');

      const now = Date.now();
      const FOCUS_REFRESH_COOLDOWN = 1000; // 1 segundo mínimo entre solicitudes

      if (now - lastRefreshTimeRef.current < FOCUS_REFRESH_COOLDOWN) {
        console.log('🛑 Refresh ignorado (demasiado pronto)');
        return;
      }

      lastRefreshTimeRef.current = now;
      console.log('🔄 Solicitando refresh de usuario');

      // Solo llamar a refreshUser si existe
      if (typeof refreshUser === 'function') {
        refreshUser();
      }
    }, []) // Sin dependencias para evitar problemas
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={agriColors.primary} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.authContainer}>
          <Text style={styles.welcomeMessage}>Bienvenido a tu tienda agrícola</Text>
          <Text style={styles.message}>Inicia sesión para ver tu perfil y gestionar tus pedidos</Text>
          <Button 
            mode="contained" 
            onPress={() => router.push(ROUTES.LOGIN)}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
            buttonColor={agriColors.primary}
          >
            Iniciar Sesión
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => router.push(ROUTES.REGISTER)}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}
            textColor={agriColors.primary}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Si el usuario está autenticado, mostrar el ProfileScreen
  return <ProfileScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: agriColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: agriColors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: agriColors.text,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: agriColors.background,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: agriColors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    color: agriColors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
  },
  registerButton: {
    width: '100%',
    borderColor: agriColors.primary,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});