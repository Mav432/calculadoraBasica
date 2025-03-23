import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispositivos } from '../../../src/contexts/DispositivoContext';
import DeviceCard from '../../../src/components/DeviceCard';
import { StatusBar } from 'expo-status-bar';

export default function IoTScreen() {
  const { dispositivos, loading, error, getDispositivos, deleteDispositivo } = useDispositivos();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    loadDispositivos();
  }, []);

  const loadDispositivos = async () => {
    setRefreshing(true);
    await getDispositivos();
    setRefreshing(false);
  };

  const handleDevicePress = (id: string) => {
    router.push(`/iot/${id}`);
  };

  const handleAddDevice = () => {
    router.push('/iot/new');
  };
  
  const handleDeleteDevice = (id: string) => {
    Alert.alert(
      'Eliminar dispositivo',
      '¿Estás seguro de que deseas eliminar este dispositivo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            await deleteDispositivo(id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mis Dispositivos IoT</Text>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={loadDispositivos}>
            Intentar de nuevo
          </Button>
        </View>
      ) : (
        <FlatList
          data={dispositivos}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPress={handleDevicePress}
              onDelete={handleDeleteDevice}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={loadDispositivos}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes dispositivos registrados</Text>
              <Button 
                mode="contained" 
                onPress={handleAddDevice}
                style={styles.emptyButton}
              >
                Registrar nuevo dispositivo
              </Button>
            </View>
          }
        />
      )}
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={handleAddDevice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});