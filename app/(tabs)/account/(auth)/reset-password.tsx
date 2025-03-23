import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '../../../../src/services/auth';
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

export default function ResetPasswordScreen(): JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState<string>((params.email as string) || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Actualizar email desde params
  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
      console.log("Email from params:", params.email);
    }
  }, [params.email]);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!email || !code || !newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos');
      toast.error('Campos incompletos', 'Por favor completa todos los campos');
      return;
    }

    if (!validatePassword()) {
      toast.error('Error de validación', error);
      return;
    }

    setError('');
    setLoading(true);

    try {
      toast.forceShow({
        type: 'info',
        text1: 'Procesando',
        text2: 'Actualizando tu contraseña...'
      });

      const result = await resetPassword({
        // email,
        token: code,
        newPassword
      }, {
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
          text1: '¡Contraseña actualizada!',
          text2: 'Tu contraseña ha sido restablecida correctamente'
        });

        // Redirigir a la pantalla de login
        setTimeout(() => {
          router.replace(ROUTES.LOGIN);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('expiró') || error.message.includes('expired')) {
          setError('El código ha expirado. Solicita uno nuevo.');
        } else if (error.message.includes('incorrecto') || error.message.includes('incorrect')) {
          setError('Código incorrecto. Por favor, verifica e intenta nuevamente.');
        } else {
          setError(error.message || 'Error al restablecer la contraseña');
        }
      } else {
        setError('Error al restablecer la contraseña. Inténtalo de nuevo más tarde.');
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
        <Text style={styles.title}>Restablecer contraseña</Text>

        <Text style={styles.subtitle}>
          Ingresa el código enviado a tu correo electrónico y establece una nueva contraseña.
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

          <TextInput
            label="Código de verificación"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            disabled={loading}
            mode="outlined"
            keyboardType="default"
            autoCapitalize="none"
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="key" color={agriColors.primary} />}
          />

          <TextInput
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            disabled={loading}
            mode="outlined"
            secureTextEntry={!passwordVisible}
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="lock" color={agriColors.primary} />}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                color={agriColors.primary}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          <TextInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            disabled={loading}
            mode="outlined"
            secureTextEntry={!confirmPasswordVisible}
            outlineColor={agriColors.placeholder}
            activeOutlineColor={agriColors.primary}
            left={<TextInput.Icon icon="lock-check" color={agriColors.primary} />}
            right={
              <TextInput.Icon
                icon={confirmPasswordVisible ? "eye-off" : "eye"}
                color={agriColors.primary}
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              />
            }
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading || !email || !code || !newPassword || !confirmPassword}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor={agriColors.primary}
          textColor="#FFFFFF"
        >
          Restablecer contraseña
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