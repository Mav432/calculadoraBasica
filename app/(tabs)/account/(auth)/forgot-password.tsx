import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../../../../src/services/auth';
import { useToast } from '../../../../src/hooks/useToast';
import { StatusBar } from 'expo-status-bar';

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

export default function ForgotPasswordScreen(): JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      toast.error('Email requerido', 'Por favor ingresa tu correo electrónico');
      return;
    }

    // Validación simple de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      toast.error('Email inválido', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setError('');
    setLoading(true);

    try {
      toast.forceShow({
        type: 'info',
        text1: 'Enviando solicitud',
        text2: 'Procesando tu solicitud de recuperación de contraseña...'
      });

      const result = await forgotPassword(email, {
        success: (title, message) => {
          console.log(`Success toast: ${title} - ${message}`);
          toast.forceShow({
            type: 'success',
            text1: title,
            text2: message
          });
        },
        error: (title, message) => {
          console.log(`Error toast: ${title} - ${message}`);
          toast.forceShow({
            type: 'error',
            text1: title,
            text2: message
          });
          setError(message || title);
        },
        info: (title, message) => {
          console.log(`Info toast: ${title} - ${message}`);
          toast.forceShow({
            type: 'info',
            text1: title,
            text2: message
          });
        }
      });

      if (result?.success) {
        toast.forceShow({
          type: 'success',
          text1: 'Código enviado',
          text2: 'Hemos enviado un código de recuperación a tu correo electrónico'
        });

        // Redirigir a la pantalla de reseteo de contraseña
        setTimeout(() => {
          router.push({
            pathname: ROUTES.RESET_PASSWORD,
            params: { email }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      
      if (error instanceof Error) {
        setError(error.message || 'Error al procesar tu solicitud');
      } else {
        setError('Error al procesar tu solicitud. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <Surface style={styles.formCard}>
        <Text style={styles.title}>Recuperar contraseña</Text>

        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un código de verificación 
          para restablecer tu contraseña.
        </Text>

        <View style={styles.formGroup}>
          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            disabled={loading}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="email" color={agriColors.primary} />}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        <Button
          mode="contained"
          onPress={handleRequestReset}
          loading={loading}
          disabled={loading || !email}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor={agriColors.primary}
          textColor="#FFFFFF"
        >
          Enviar código
        </Button>

        <Button
          mode="text"
          onPress={() => router.replace(ROUTES.LOGIN)}
          disabled={loading}
          style={styles.secondaryButton}
          textColor={agriColors.primary}
        >
          Volver al inicio de sesión
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: agriColors.background,
  },
  formCard: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: agriColors.secondary,
    justifyContent: 'center',
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
    lineHeight: 22,
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
  primaryButton: {
    marginTop: 8,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 4,
    height: 48,
  },
});