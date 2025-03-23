import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Appbar, useTheme, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispositivoAsignacion } from '../../../src/hooks/useDispositivoAsignacion';
import { StatusBar } from 'expo-status-bar';

export default function NewDeviceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { asignarDispositivo, loading, error } = useDispositivoAsignacion();
  
  const [formData, setFormData] = useState({
    macAddress: '',
    name: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    macAddress: '',
    name: '',
  });

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      macAddress: '',
      name: '',
    };

    // Validar MAC Address
    if (!formData.macAddress.trim()) {
      errors.macAddress = 'La dirección MAC es requerida';
      isValid = false;
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.macAddress)) {
      errors.macAddress = 'Formato de MAC Address inválido';
      isValid = false;
    }

    // Validar Nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await asignarDispositivo(formData);
      router.back(); // Volver a la lista después de añadir
    } catch (err) {
      // Error handling is managed by the hook
      console.error('Error al asignar dispositivo:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Nuevo Dispositivo" />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Ingresa los datos del dispositivo:</Text>
        
        <TextInput
          label="Dirección MAC"
          value={formData.macAddress}
          onChangeText={(text) => setFormData({ ...formData, macAddress: text })}
          style={styles.input}
          mode="outlined"
          error={!!formErrors.macAddress}
          disabled={loading}
          placeholder="AA:BB:CC:DD:EE:FF"
        />
        {formErrors.macAddress ? (
          <HelperText type="error" visible={!!formErrors.macAddress}>
            {formErrors.macAddress}
          </HelperText>
        ) : (
          <HelperText type="info" visible={true}>
            Formato: AA:BB:CC:DD:EE:FF
          </HelperText>
        )}
        
        <TextInput
          label="Nombre del dispositivo"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={styles.input}
          mode="outlined"
          error={!!formErrors.name}
          disabled={loading}
        />
        {formErrors.name && (
          <HelperText type="error" visible={!!formErrors.name}>
            {formErrors.name}
          </HelperText>
        )}
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Registrar Dispositivo
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
  errorText: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});