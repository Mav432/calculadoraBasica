import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const IndexScreen = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/producto/${item.id}`} style={styles.productItem}>
            <Text style={styles.productText}>{item.title}</Text>
          </Link>
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
  productItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
  },
  productText: {
    color: 'white',
  },
});

export default IndexScreen;
