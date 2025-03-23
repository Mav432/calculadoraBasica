import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyEmailCode, resendVerificationCode } from '../../../../src/services/auth';
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

export default function VerifyCodeScreen(): JSX.Element {

  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState<string>((params.email as string) || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const [codeInputFocused, setCodeInputFocused] = useState(false);

  // Asegúrate de que useEffect se ejecute cuando params.email cambie:
  useEffect(() => {
    // Si hay un email en los parámetros, actualízalo en el estado
    if (params.email) {
      setEmail(params.email as string);
      console.log("Email from params:", params.email);
    }
  }, [params.email]);

  // Agrega un console.log para depurar
  useEffect(() => {
    console.log("Current email state:", email);
  }, [email]);

  useEffect(() => {
    // Cuenta regresiva para permitir reenvío
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerifyCode = async () => {
    if (!code) {
      setError('Por favor ingresa el código de verificación');
      toast.error('Código requerido', 'Por favor ingresa el código de verificación');
      return;
    }

    if (!email) {
      setError('El correo electrónico es requerido');
      toast.error('Email requerido', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Usar forceShow para garantizar que se muestre la notificación
      toast.forceShow({
        type: 'info',
        text1: 'Verificando',
        text2: 'Comprobando código de verificación...'
      });

      const result = await verifyEmailCode({ email, code }, {
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

      // Si la verificación fue exitosa
      if (result?.success) {
        toast.forceShow({
          type: 'success',
          text1: '¡Cuenta verificada!',
          text2: 'Tu registro ha sido completado con éxito'
        });

        setTimeout(() => {
          router.replace(ROUTES.LOGIN_VERIFIED);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al verificar código:', error);

      // Manejar errores conocidos
      if (error instanceof Error) {
        if (error.message.includes('expiró') || error.message.includes('expired')) {
          setError('El código ha expirado. Solicita uno nuevo.');
        } else if (error.message.includes('incorrecto') || error.message.includes('incorrect')) {
          setError('Código incorrecto. Por favor, verifica e intenta nuevamente.');
        } else if (error.message.includes('sesión') || error.message.includes('session')) {
          setError('La sesión ha expirado. Por favor, inicia el registro nuevamente.');
        } else {
          setError(error.message || 'Error al verificar el código');
        }
      } else {
        setError('Error al verificar el código. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email requerido', 'No se puede reenviar el código sin un email');
      return;
    }

    setResendLoading(true);

    try {
      await resendVerificationCode(email, {
        success: toast.success,
        error: toast.error,
        info: toast.info
      });

      setTimeLeft(60); // Bloquear reenvío por 60 segundos
    } catch (error) {
      console.error('Error al reenviar código:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <Surface style={styles.formCard}>
        <Text style={styles.title}>Verificar cuenta</Text>

        <Text style={styles.subtitle}>
          Hemos enviado un código de verificación a tu correo electrónico.
          Por favor, ingresa el código para verificar tu cuenta.
        </Text>

        <View style={styles.formGroup}>
          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            disabled={loading || resendLoading}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="email" color={agriColors.primary} />}
          />

          <TextInput
            label="Código de verificación"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            disabled={loading || resendLoading}
            mode="outlined"
            keyboardType="default"
            autoCapitalize="none"
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="key" color={agriColors.primary} />}
            onFocus={() => setCodeInputFocused(true)}
            onBlur={() => setCodeInputFocused(false)}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        <Button
          mode="contained"
          onPress={handleVerifyCode}
          loading={loading}
          disabled={loading || resendLoading || !code || !email}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor={agriColors.primary}
          textColor="#FFFFFF"
        >
          Verificar cuenta
        </Button>

        <Button
          mode="text"
          onPress={handleResendCode}
          loading={resendLoading}
          disabled={loading || resendLoading || timeLeft > 0 || !email}
          style={styles.secondaryButton}
          textColor={agriColors.primary}
        >
          {timeLeft > 0
            ? `Reenviar código (${timeLeft}s)`
            : 'Reenviar código'}
        </Button>

        <Button
          mode="text"
          onPress={() => router.replace(ROUTES.LOGIN)}
          disabled={loading || resendLoading}
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