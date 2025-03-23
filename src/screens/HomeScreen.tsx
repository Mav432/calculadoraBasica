// src/screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, useWindowDimensions } from 'react-native';
import { Text, Card, Button, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function HomeScreen(): JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width > 768;

  const getCardWidth = () => {
    if (width > 1024) return '30%';
    if (width > 768) return '45%';
    return '100%';
  };

  const getCategoryWidth = () => {
    if (width > 1024) return '16%';
    if (width > 768) return '30%';
    if (width > 480) return '30%';
    return '45%';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: theme.colors.primary,
    },
    welcomeTitle: {
      fontSize: isTablet ? 36 : 28,
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: isTablet ? 18 : 16,
      color: theme.colors.onPrimary,
      marginBottom: 16,
    },
    cardsContainer: {
      padding: 16,
      flexDirection: isTablet ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      width: isTablet ? getCardWidth() : '100%',
      borderRadius: 12,
    },
    cardCover: {
      height: 180,
      backgroundColor: theme.colors.primaryContainer,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    categorySection: {
      marginTop: 8,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: isTablet ? 24 : 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme.colors.onSurface,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: getCategoryWidth(),
      padding: 12,
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      elevation: 1,
      marginBottom: 12,
    },
    categoryIcon: {
      fontSize: 24,
      color: theme.colors.primary,
    },
    categoryName: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.colors.onSurface,
    },
    promotionBanner: {
      marginHorizontal: 16,
      marginVertical: 16,
      borderRadius: 8,
      overflow: 'hidden',
      height: isTablet ? 120 : 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.secondaryContainer,
    },
    promotionText: {
      color: theme.colors.onSecondaryContainer,
      fontSize: isTablet ? 22 : 18,
      fontWeight: 'bold',
    },
  });

  const featuredCategories = [
    { id: '1', name: 'Semillas', icon: '🌱' },
    { id: '2', name: 'Herramientas', icon: '🔧' },
    { id: '3', name: 'Fertilizantes', icon: '🧪' },
    { id: '4', name: 'IoT', icon: '📱' },
    { id: '5', name: 'Maquinaria', icon: '🚜' },
    { id: '6', name: 'Riego', icon: '💧' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Bienvenido a AgroTech</Text>
          <Text style={styles.subtitle}>Tu tienda especializada en agricultura</Text>
        </View>

        <Surface style={styles.promotionBanner}>
          <Text style={styles.promotionText}>20% DESCUENTO EN FERTILIZANTES</Text>
        </Surface>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Explora por categoría</Text>
          <View style={styles.categoriesContainer}>
            {featuredCategories.map((category) => (
              <Surface
                key={category.id}
                style={styles.categoryCard}
                onTouchEnd={() => router.push(`/category/${category.id}`)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </Surface>
            ))}
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { width: '100%' }]}>Productos destacados</Text>

          <Card style={styles.card} onPress={() => router.push('/products')}>
            <Card.Cover
              source={{ uri: 'https://picsum.photos/700' }}
              style={styles.cardCover}
            />
            <Card.Content style={{ paddingVertical: 12 }}>
              <Text style={styles.cardTitle}>Sistemas IoT para Cultivos</Text>
              <Text>Monitorea y controla tus cultivos con la última tecnología</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined">Ver más</Button>
              <Button mode="contained">Comprar</Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card} onPress={() => router.push('/products')}>
            <Card.Cover
              source={{ uri: 'https://picsum.photos/701' }}
              style={styles.cardCover}
            />
            <Card.Content style={{ paddingVertical: 12 }}>
              <Text style={styles.cardTitle}>Nuevos fertilizantes orgánicos</Text>
              <Text>Mejora el rendimiento de tus cultivos de forma sostenible</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined">Ver más</Button>
              <Button mode="contained">Comprar</Button>
            </Card.Actions>
          </Card>

          {isTablet && (
            <Card style={styles.card} onPress={() => router.push('/products')}>
              <Card.Cover
                source={{ uri: 'https://picsum.photos/702' }}
                style={styles.cardCover}
              />
              <Card.Content style={{ paddingVertical: 12 }}>
                <Text style={styles.cardTitle}>Herramientas Premium</Text>
                <Text>Equípate con lo mejor para tu trabajo diario</Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="outlined">Ver más</Button>
                <Button mode="contained">Comprar</Button>
              </Card.Actions>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}