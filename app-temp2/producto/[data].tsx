import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const DetalleProducto = () => {
  const { producto } = useLocalSearchParams();
  const productoJson = JSON.parse(producto || '{}'); // Manejo de posibles valores nulos



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{productoJson.title}</Text>

      <Image source={{ uri: productoJson.image }} style={styles.imagen} />

      <Text style={styles.precio}>Precio: ${productoJson.price?.toFixed(2)}</Text>
      
      <Text style={styles.categoria}>Categoría: {productoJson.category}</Text>
      
      <Text style={styles.descripcion}>{productoJson.description}</Text>
      
      <Text style={styles.rating}>
        Valoración: {productoJson.rating?.rate} ({productoJson.rating?.count} reseñas)
      </Text>
    </ScrollView>
  );
};

export default DetalleProducto;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  imagen: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  precio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
    marginTop: 10,
  },
});