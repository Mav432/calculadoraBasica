// app/(tabs)/account/(auth)/register.tsx
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { registerUser } from '../../../../src/services/auth';
import { useToast } from '../../../../src/hooks/useToast';
import { StatusBar } from 'expo-status-bar';
// Añadir esta importación al inicio del archivo
import Toast from 'react-native-toast-message';

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

// Componente para mostrar los requisitos de la contraseña
const PasswordRequirements = ({ password }: { password: string }) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  return (
    <Surface style={styles.passwordRequirements}>
      <Text style={styles.requirementsTitle}>Requisitos de contraseña:</Text>
      <Text style={{ ...styles.requirement, color: hasMinLength ? agriColors.primary : agriColors.error }}>
        {hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
      </Text>
      <Text style={{ ...styles.requirement, color: hasUppercase ? agriColors.primary : agriColors.error }}>
        {hasUppercase ? '✓' : '○'} Al menos una letra mayúscula
      </Text>
      <Text style={{ ...styles.requirement, color: hasLowercase ? agriColors.primary : agriColors.error }}>
        {hasLowercase ? '✓' : '○'} Al menos una letra minúscula
      </Text>
      <Text style={{ ...styles.requirement, color: hasSpecialChar ? agriColors.primary : agriColors.error }}>
        {hasSpecialChar ? '✓' : '○'} Al menos un carácter especial (@$!%*?&#)
      </Text>
      <Text style={{ ...styles.requirement, color: hasNumber ? agriColors.primary : agriColors.error }}>
        {hasNumber ? '✓' : '○'} Al menos un número
      </Text>
    </Surface>
  );
};

export default function RegisterScreen(): JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    email: '',
    password: '',
    realName: '',
    lastName: '',
    phoneNumber: '',
    secretWord: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    realName: '',
    lastName: '',
    phoneNumber: '',
    secretWord: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Manejar cambio en cualquier campo
  const handleChange = (name: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validar en tiempo real
    const result = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: result ? '' : `El campo ${name} no es válido`,
    }));
  };

  // Función simplificada de validación
  const validateField = (name: keyof typeof form, value: string): boolean => {
    if (!value) return false;

    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return (
          value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[@$!%*?&#]/.test(value)
        );
      case 'realName':
      case 'lastName':
        return value.length >= 2;
      case 'phoneNumber':
        return /^\d{10}$/.test(value);
      case 'secretWord':
        return value.length >= 4;
      default:
        return true;
    }
  };

  const handleRegister = async () => {
    // Validar todo el formulario
    let hasErrors = false;
    const newErrors = { ...errors };

    (Object.keys(form) as Array<keyof typeof form>).forEach((field) => {
      if (!validateField(field, form[field])) {
        newErrors[field] = `El campo ${field} es obligatorio`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      // Notificación de proceso iniciado
      toast.info('Procesando', 'Enviando información de registro...');

      console.log('Intentando registrar usuario con datos:', {
        email: form.email,
        // Ocultamos datos sensibles
        password: '********',
        realName: form.realName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        secretWord: '********'
      });

      // Agregamos un control para mostrar los mensajes de Toast en el cliente
      const toastFunctions = {
        success: (title: string, message?: string) => {
          console.log(`SUCCESS TOAST: ${title} - ${message}`);
          setTimeout(() => toast.success(title, message), 100);
        },
        error: (title: string, message?: string) => {
          console.log(`ERROR TOAST: ${title} - ${message}`);
          setTimeout(() => toast.error(title, message), 100);
        },
        info: (title: string, message?: string) => {
          console.log(`INFO TOAST: ${title} - ${message}`);
          setTimeout(() => toast.info(title, message), 100);
        },
        warning: (title: string, message?: string) => {
          console.log(`WARNING TOAST: ${title} - ${message}`);
          setTimeout(() => toast.warning(title, message), 100);
        }
      };

      // Llamada al servicio con las funciones Toast mejoradas
      const result = await registerUser(form, toastFunctions);

      // Manejo específico de la respuesta para asegurar que se muestre una alerta
      if (result) {
        console.log('Respuesta de registro recibida:', result);

        // Mostrar mensaje de éxito explícitamente en caso de que no se haya mostrado
        if (result.success) {
          // Verificamos si el mensaje incluye verificación de correo
          if (result.message?.includes('verifica tu correo')) {
            toastFunctions.success(
              'Registro iniciado',
              'Verifica tu correo electrónico para completar el registro'
            );

            setTimeout(() => {
              // Redirigir a la pantalla de verificación pasando el email
              const encodedEmail = encodeURIComponent(form.email);
              router.replace(`${ROUTES.VERIFY_CODE}?email=${encodedEmail}`);
              // router.replace(ROUTES.VERIFY_CODE);
            }, 1500);
          } else {
            // Registro exitoso sin verificación
            toastFunctions.success(
              'Registro exitoso',
              result.message || '¡Tu cuenta ha sido creada correctamente!'
            );

            setTimeout(() => {
              router.replace(ROUTES.LOGIN);
            }, 1500);
          }
        } else {
          // Si hay respuesta pero no indica éxito, mostrar advertencia
          toastFunctions.warning(
            'Atención',
            result.message || 'El registro requiere pasos adicionales'
          );
        }
      }
    } catch (error: any) {
      console.error('Error en registro:', error);

      // Manejo directo del error en el componente para garantizar que se muestre
      let errorMessage = "No se pudo completar el registro";

      if (error.message) {
        errorMessage = error.message;
      }

      // Mostrar error explícitamente
      toast.error('Error de registro', errorMessage);

      // Comprobación adicional para errores específicos
      if (errorMessage.includes("correo") || errorMessage.includes("email")) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes("contraseña") || errorMessage.includes("password")) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const showPasswordRequirements = form.password.length > 0;

  // Función para alternar la visibilidad de la contraseña
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
          <Text style={styles.title}>Crear una cuenta</Text>
          <Text style={styles.subtitle}>Forma parte de la comunidad agrícola</Text>

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
            {!!errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
                  icon={passwordVisible ? 'eye-off' : 'eye'}
                  color={agriColors.primary}
                  onPress={togglePasswordVisibility}
                />
              }
            />
            {!!errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            {showPasswordRequirements ? <PasswordRequirements password={form.password} /> : null}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Nombre"
              value={form.realName}
              onChangeText={(text) => handleChange('realName', text)}
              style={styles.input}
              error={!!errors.realName}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="account" color={agriColors.primary} />}
            />
            {!!errors.realName ? <Text style={styles.errorText}>{errors.realName}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Apellido"
              value={form.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              style={styles.input}
              error={!!errors.lastName}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="account" color={agriColors.primary} />}
            />
            {!!errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Teléfono"
              value={form.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              style={styles.input}
              keyboardType="phone-pad"
              error={!!errors.phoneNumber}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="phone" color={agriColors.primary} />}
            />
            {!!errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Palabra secreta"
              value={form.secretWord}
              onChangeText={(text) => handleChange('secretWord', text)}
              style={styles.input}
              error={!!errors.secretWord}
              disabled={loading}
              mode="outlined"
              outlineColor={agriColors.placeholder}
              activeOutlineColor={agriColors.primary}
              left={<TextInput.Icon icon="key" color={agriColors.primary} />}
            />
            {!!errors.secretWord ? <Text style={styles.errorText}>{errors.secretWord}</Text> : null}
            {!errors.secretWord && form.secretWord ? (
              <Text style={styles.helperText}>
                Esta palabra se usará para recuperar tu cuenta si olvidas tu contraseña
              </Text>
            ) : null}
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            buttonColor={agriColors.primary}
            textColor="#FFFFFF"
          >
            Crear cuenta
          </Button>

          <Button
            mode="text"
            onPress={() => router.replace(ROUTES.LOGIN)}
            disabled={loading}
            style={styles.secondaryButton}
            textColor={agriColors.secondary}
          >
            ¿Ya tienes una cuenta? Inicia sesión
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
  passwordRequirements: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 0,
    backgroundColor: agriColors.lightBackground,
    borderLeftWidth: 2,
    borderLeftColor: agriColors.secondary,
  },
  requirementsTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
    color: agriColors.text,
  },
  requirement: {
    fontSize: 12,
    lineHeight: 20,
  },
  errorText: {
    color: agriColors.error,
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  helperText: {
    fontSize: 12,
    color: agriColors.primary,
    marginLeft: 4,
    marginTop: 4,
  },
  primaryButton: {
    marginTop: 16,
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