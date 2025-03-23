// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, HelperText } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loginUser } from '../../../../src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../../../../src/hooks/useToast';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';

import { getProfile } from '../../../../src/services/auth';
import { useAuth } from '../../../../src/contexts/AuthContext';

// rutas
import { ROUTES } from '../../../../src/constants/routes';

// Colores personalizados para tema de agricultura
const agriColors = {
  primary: '#2E7D32', // Verde oscuro
  secondary: '#81C784', // Verde claro
  background: '#F5F9F5', // Fondo ligeramente verde
  surface: '#FFFFFF',
  accent: '#33691E', // Verde intenso para acentos
  text: '#1B5E20', // Verde oscuro para texto
  placeholder: '#AED581', // Verde claro para placeholder
  lightBackground: '#E8F5E9', // Fondo verde muy claro para secciones
  error: '#B71C1C', // Color de error
};

export default function LoginScreen(): JSX.Element {
  const { login } = useAuth();

  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams();
  const verified = params.verified === 'true';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // En login.tsx y register.tsx
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Verificar que el token es válido
          const userData = await getProfile();
          if (userData) {
            // Si hay un usuario autenticado, redirigir a home
            router.replace(ROUTES.ACCOUNT);
          }
        }
      } catch (error) {
        console.log('No hay sesión activa o token inválido');
      }
    };

    checkAuth();

  }, []);

  // Mostrar mensaje cuando la cuenta fue verificada
  useEffect(() => {
    if (verified) {
      toast.success('¡Cuenta verificada!', 'Ya puedes iniciar sesión con tu email y contraseña');
    }
  }, [verified]);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));

    // Limpiar errores cuando se modifica un campo
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!form.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      toast.error('Formulario incompleto', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      toast.info('Procesando', 'Iniciando sesión...');

      const data = await loginUser(form, {
        success: toast.success,
        error: toast.error,
        info: toast.info,
        warning: toast.warning,
      });

      // IMPORTANTE: Usar el método login del contexto en lugar de solo AsyncStorage
      await login(data.token, data);

      toast.success('¡Bienvenido!', `Hola ${data.realName || 'de nuevo'}`);

      console.log('🚀 Navegación a Home después de login');
      // La redirección puede ser inmediata
      router.replace(ROUTES.ACCOUNT);

    } catch (error: any) {
      console.error('Error en login:', error);

      // Si el error contiene información específica sobre campos
      if (error.message?.toLowerCase().includes('contraseña')) {
        setErrors(prev => ({ ...prev, password: 'Contraseña incorrecta' }));
      }

      if (error.message?.toLowerCase().includes('usuario') ||
        error.message?.toLowerCase().includes('correo') ||
        error.message?.toLowerCase().includes('no encontrado')) {
        setErrors(prev => ({ ...prev, email: 'Usuario no encontrado' }));
      }

    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.formCard}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo a AgroConnect</Text>

          <View style={styles.formGroup}>
            <TextInput
              label="Correo electrónico"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="email" color={agriColors.primary} />}
            />
            {!!errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Contraseña"
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
              style={styles.input}
              secureTextEntry={!passwordVisible}
              error={!!errors.password}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="lock" color={agriColors.primary} />}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  color={agriColors.primary}
                  onPress={togglePasswordVisibility}
                />
              }
            />
            {!!errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <Button
            mode="text"
            onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
            disabled={loading}
            style={styles.forgotPasswordButton}
            textColor={agriColors.secondary}
          >
            ¿Olvidaste tu contraseña?
          </Button>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            buttonColor={agriColors.primary}
            labelStyle={styles.buttonLabel}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="text"
            onPress={() => router.push(ROUTES.REGISTER)}
            disabled={loading}
            style={styles.secondaryButton}
            textColor={agriColors.primary}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: agriColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: agriColors.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.25,
    color: agriColors.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: agriColors.text,
    opacity: 0.7,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
    marginVertical: 4,
    height: 56,
  },
  errorText: {
    color: agriColors.error,
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginRight: 4,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 4,
    backgroundColor: agriColors.primary, // Asegura que el color esté explícito
    paddingHorizontal: 16,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'none', // Evita que React Native Paper transforme el texto
  },
});