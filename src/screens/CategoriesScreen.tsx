import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, useTheme, Searchbar, Surface, Button } from 'react-native-paper';
import { fetchCategories } from '../services/categories';
import CategoryItem from '../components/CategoryItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesScreen(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    fetchCategories()
      .then((data: Category[]) => {
        setCategories(data);
        setFilteredCategories(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error al obtener categorías:', error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 16,
    },
    searchbar: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      borderRadius: 8,
    },
    list: {
      paddingBottom: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 16,
    },
    featuredSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '500',
      marginBottom: 12,
      color: theme.colors.onSurface,
    },
    featuredContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    featuredCategory: {
      width: '48%',
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.colors.primaryContainer,
    },
    featuredImage: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featuredName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
    }
  });

  const featuredCategories = [
    { id: '1', name: 'IoT' },
    { id: '2', name: 'Fertilizantes' },
    { id: '3', name: 'Semillas' },
    { id: '4', name: 'Herramientas' }
  ];

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Categorías</Text>
          <Searchbar
            placeholder="Buscar categorías"
            onChangeText={query => setSearchQuery(query)}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={theme.colors.primary}
          />
        </View>
      </View>

      {!searchQuery && (
        <View style={[styles.contentContainer, styles.featuredSection]}>
          <Text style={styles.sectionTitle}>Categorías destacadas</Text>
          <View style={styles.featuredContainer}>
            {featuredCategories.map(category => (
              <Surface key={category.id} style={styles.featuredCategory}>
                <View style={styles.featuredImage}>
                  <Text style={styles.featuredName}>{category.name}</Text>
                </View>
              </Surface>
            ))}
          </View>
        </View>
      )}

      {filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay categorías disponibles que coincidan con tu búsqueda</Text>
          <Button mode="contained" onPress={loadCategories}>
            Reintentar
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <CategoryItem category={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}