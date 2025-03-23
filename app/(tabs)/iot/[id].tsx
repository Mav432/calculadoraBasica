// c:\Users\hpx36\Documents\my_projects\proyect\AgriMovil\app\(tabs)\iot\[id].tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, useTheme, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispositivos } from '../../../src/contexts/DispositivoContext';
import { useMqtt } from '../../../src/hooks/useMqtt';
import DeviceControl from '../../../src/components/DeviceControl';
import { StatusBar } from 'expo-status-bar';

export default function DispositivoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { getDispositivo } = useDispositivos();
  const [dispositivo, setDispositivo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el dispositivo al iniciar
  useEffect(() => {
    loadDispositivo();
  }, [id]);

  const loadDispositivo = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) {
        setError('ID de dispositivo no válido');
        return;
      }
      
      const data = await getDispositivo(id.toString());
      if (data) {
        setDispositivo(data);
      } else {
        setError('No se pudo cargar el dispositivo');
      }
    } catch (err) {
      console.error('Error al cargar el dispositivo:', err);
      setError('Error al cargar el dispositivo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDispositivo();
  };

  // Hook MQTT para comunicación con el dispositivo
  const { datos, conectado, enviarComando, recargarDatos } = useMqtt(dispositivo?.macAddress || '');

  // Función para manejar comandos desde la UI
  const handleControlCommand = async (comando: any): Promise<void> => {
    try {
      await enviarComando(comando);
    } catch (error) {
      console.error('Error al enviar comando:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !dispositivo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Dispositivo no encontrado'}</Text>
        <Button mode="contained" onPress={handleBack}>
          Volver a Dispositivos
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={dispositivo.name} />
        <Appbar.Action icon="refresh" onPress={recargarDatos} />
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.deviceName}>{dispositivo.name}</Text>
            <Text style={styles.macAddress}>MAC: {dispositivo.macAddress}</Text>
            {dispositivo.createdAt && (
              <Text style={styles.createdAt}>
                Registrado: {new Date(dispositivo.createdAt).toLocaleDateString()}
              </Text>
            )}
            
            <View style={styles.connectionStatus}>
              <View 
                style={[
                  styles.connectionIndicator, 
                  { backgroundColor: conectado ? 'green' : 'red' }
                ]} 
              />
              <Text style={styles.connectionText}>
                {conectado ? 'Dispositivo conectado' : 'Dispositivo desconectado'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <DeviceControl
          datos={{
            ...datos,
            ventanaAbierta: datos.ventanaAbierta ?? false,
            ventiladorActivo: datos.ventiladorActivo ?? false,
            ventiladorVelocidad: datos.ventiladorVelocidad ?? 0,
            riegoActivo: datos.riegoActivo ?? false,
          }}
          conectado={conectado}
          mqttConectado={conectado} // Usamos el mismo estado para simplificar
          onControlCommand={handleControlCommand}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  infoCard: {
    margin: 16,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  macAddress: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 12,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
  },
});