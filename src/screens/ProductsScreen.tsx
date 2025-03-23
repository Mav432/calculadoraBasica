import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { ActivityIndicator, Text, useTheme, Snackbar, Searchbar, Chip, Divider } from 'react-native-paper';
import ProductItem from '../components/ProductItem';
import { fetchProducts } from '../services/products';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Colores personalizados para tema de agricultura
const agriColors = {
  primary: '#2E7D32', // Verde oscuro
  secondary: '#81C784', // Verde claro
  background: '#F5F9F5', // Fondo ligeramente verde
  surface: '#FFFFFF',
  accent: '#33691E', // Verde intenso para acentos
  text: '#1B5E20', // Verde oscuro para texto
  placeholder: '#AED581', // Verde claro para placeholder
};

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  user: string;
  category: {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  marca: {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  rating: number;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export default function ProductsScreen(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const theme = useTheme();
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;

  const filters = ['Todos', 'Semillas', 'Herramientas', 'IoT', 'Fertilizantes'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  useEffect(() => {
    filterProducts(searchQuery, activeFilter);
  }, [searchQuery, activeFilter, products]);

  const filterProducts = (query: string, filter: string) => {
    let results = [...products];

    if (query) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filter !== 'Todos') {
      results = results.filter(product =>
        product.category.name === filter
      );
    }

    setFilteredProducts(results);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (product: Product) => {
    setSnackbarMessage(`${product.name} añadido al carrito`);
    setSnackbarVisible(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: agriColors.background,
    },
    contentContainer: {
      padding: windowWidth > 600 ? 24 : 16,
    },
    headerContainer: {
      marginBottom: 16,
    },
    title: {
      fontSize: windowWidth > 600 ? 32 : 24,
      fontWeight: 'bold',
      color: agriColors.text,
      marginBottom: 16,
      fontFamily: 'System',
      letterSpacing: 0.5,
    },
    searchbar: {
      marginBottom: 16,
      backgroundColor: agriColors.surface,
      elevation: 2,
      borderRadius: 8,
      borderColor: agriColors.secondary,
      borderWidth: 1,
    },
    filtersContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    filterChip: {
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: agriColors.surface,
      borderColor: agriColors.primary,
      borderWidth: 1,
    },
    selectedFilterChip: {
      backgroundColor: agriColors.secondary,
    },
    chipText: {
      color: agriColors.text,
    },
    selectedChipText: {
      color: agriColors.surface,
    },
    divider: {
      marginBottom: 16,
      backgroundColor: agriColors.secondary,
      height: 1.5,
    },
    list: {
      paddingHorizontal: windowWidth > 600 ? 24 : 16,
      paddingBottom: 24,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: agriColors.background,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: agriColors.background,
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: agriColors.text,
      textAlign: 'center',
      fontFamily: 'System',
    },
    snackbar: {
      backgroundColor: agriColors.surface,
      borderLeftColor: agriColors.primary,
      borderLeftWidth: 4,
    },
    snackbarText: {
      color: agriColors.text,
    },
    actionButton: {
      color: agriColors.primary,
      fontWeight: 'bold',
    }
  });

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={agriColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          {/* <Text style={styles.title}>Productos Agrícolas</Text> */}
          <Searchbar
            placeholder="Buscar productos"
            onChangeText={query => setSearchQuery(query)}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={agriColors.primary}
            placeholderTextColor={agriColors.placeholder}
            inputStyle={{ color: agriColors.text }}
          />
          <View style={styles.filtersContainer}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                selected={activeFilter === filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.selectedFilterChip
                ]}
                selectedColor={agriColors.primary}
                showSelectedOverlay
                textStyle={activeFilter === filter ? { color: agriColors.surface } : { color: agriColors.text }}
              >
                {filter}
              </Chip>
            ))}
          </View>
        </View>
        <Divider style={styles.divider} />
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron productos que coincidan con tu búsqueda</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[agriColors.primary]}
            />
          }
          numColumns={windowWidth > 900 ? 3 : windowWidth > 600 ? 2 : 1}
          columnWrapperStyle={windowWidth > 600 ? { justifyContent: 'space-between' } : undefined}
        />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Ver carrito',
          onPress: () => {
            router.push('/cart');
          },
          labelStyle: styles.actionButton
        }}
        style={styles.snackbar}
        theme={{ colors: { accent: agriColors.primary } }}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}