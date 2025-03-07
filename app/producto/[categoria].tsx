import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const CategoryScreen = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { categoria } = useLocalSearchParams(); // Obtiene la categoría desde la URL

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${categoria}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByCategory();
  }, [categoria]);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.productText}>{item.title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  productText: {
    color: 'white',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
  },
});

export default CategoryScreen;