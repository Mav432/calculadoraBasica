// src/components/ProductItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { Product } from '../screens/ProductsScreen';
import { Feather } from '@expo/vector-icons';

interface ProductItemProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductItem({ 
  product, 
  onViewDetails, 
  onAddToCart 
}: ProductItemProps): JSX.Element {
  const theme = useTheme();
  
  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: product.images && product.images.length > 0 
          ? product.images[0] 
          : 'https://via.placeholder.com/150' 
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Card.Content style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>
        
        <View style={styles.badges}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              Stock: {product.stock}
            </Text>
          </View>
          {product.rating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ★ {product.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <Button 
          mode="text" 
          onPress={() => onViewDetails && onViewDetails(product)}
          style={styles.detailsButton}
          labelStyle={styles.detailsButtonText}
        >
          Ver detalles
        </Button>
        <Button 
          mode="contained" 
          onPress={() => onAddToCart && onAddToCart(product)}
          style={styles.cartButton}
          icon={({ size, color }) => (
            <Feather name="shopping-cart" size={size} color={color} />
          )}
        >
          Comprar
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#263238',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#4CAF50',
  },
  description: {
    fontSize: 13,
    color: '#455A64',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stockBadge: {
    backgroundColor: '#E8F5E9', // Verde muy claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  stockText: {
    color: '#2E7D32', // Verde oscuro
    fontSize: 12,
    fontWeight: '500',
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1', // Amarillo muy claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#FFA000', // Ámbar
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailsButton: {
    marginRight: 8,
  },
  detailsButtonText: {
    color: '#455A64',
  },
  cartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
});