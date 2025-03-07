import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Hacer la solicitud POST a la API de login
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        // Si el login es exitoso, redirigir al usuario
        // Aquí podrías guardar el token en AsyncStorage si lo deseas
        router.push('/tabs/index');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
    color: 'white',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});

export default LoginScreen;