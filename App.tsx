import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Calculadora1 from './src/screens/Calculadora1';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import CalculadoraPropinas from './src/screens/CaluladoraPropinas';
import Weather from './src/screens/Weather';

const App = () => {
  return (
    <View style={styles.container}>
      <Header 
        Titulo='Climas'
        nombre='Maverick'
        imagen={require('./assets/images/img-profile.jpg')}
        color='#4B0082' // Cambia a un color más moderno
      />

      <View style={styles.content}>
        <Weather/>
      </View>
      
      <Footer 
        Grupo='"A"'
        Fecha='Febrero 2025'
        color='#4B0082'
      />
      <Toast />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
