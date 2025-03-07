import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

const API_URL = 'https://fakestoreapi.com/users'; // Reemplaza con la URL real de tu API

const Index = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleLogin = async () => {
    if (nombre.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }

      const users = await response.json();
      const userFound = users.find(user => user.username === nombre && user.password === password);

      if (userFound) {
        Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
        setAuthSuccess(true);
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#bbb"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
        </TouchableOpacity>

        {authSuccess && (
          <Link href={'./(tabs)/'} style={styles.link}>
            Continuar a la aplicación
          </Link>
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#16213e',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E94560',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#0f3460',
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#E94560',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#4CAF50',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});