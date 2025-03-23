// c:\Users\hpx36\Documents\my_projects\proyect\AgriMovil\src\hooks\useMqtt.ts
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Interfaces para datos de sensores que coincidan con tu estructura esperada
interface SensorData {
  temperatura?: number;
  humedad?: number;
  humedadSuelo?: number;
  luz?: number;
  ventanaAbierta: boolean;
  ventiladorActivo: boolean;
  ventiladorVelocidad: number;
  riegoActivo: boolean;
}

export function useMqtt(macAddress: string) {
  // Estado inicial con valores por defecto para evitar undefined
  const [datos, setDatos] = useState<SensorData>({
    temperatura: undefined,
    humedad: undefined,
    humedadSuelo: undefined,
    luz: undefined,
    ventanaAbierta: false,
    ventiladorActivo: false,
    ventiladorVelocidad: 0,
    riegoActivo: false
  });
  
  const [conectado, setConectado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const macAddressRef = useRef(macAddress);
  
  useEffect(() => {
    macAddressRef.current = macAddress;
  }, [macAddress]);
  
  // Función para obtener datos de los sensores
  const fetchSensorData = async () => {
    // Si no hay dirección MAC, no hacer nada
    if (!macAddressRef.current) {
      setLoading(false);
      return;
    }
    
    // Cancelar solicitud anterior si existe
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    
    try {
      // Realizar petición al backend
      const response = await api.get(`/mqtt/sensor-data/${macAddressRef.current}`, {
        signal: controllerRef.current.signal
      });
      
      const payload = response.data;
      
      // Parsear datos asegurando los tipos correctos
      setDatos({
        temperatura: payload.temperatura !== undefined ? Number(payload.temperatura) : undefined,
        humedad: payload.humedad !== undefined ? Number(payload.humedad) : undefined,
        humedadSuelo: payload.humedadSuelo !== undefined ? Number(payload.humedadSuelo) : undefined,
        luz: payload.luz !== undefined ? Number(payload.luz) : undefined,
        // Los booleanos deben tener valores por defecto para cumplir con la interfaz
        ventanaAbierta: payload.ventanaAbierta === true || payload.ventanaAbierta === "true",
        ventiladorActivo: payload.ventiladorActivo === true || payload.ventiladorActivo === "true",
        ventiladorVelocidad: payload.ventiladorVelocidad !== undefined ? Number(payload.ventiladorVelocidad) : 0,
        riegoActivo: payload.riegoActivo === true || payload.riegoActivo === "true"
      });
      
      // Actualizar estado de conexión y registro de tiempo
      setConectado(true);
      setLastFetch(new Date());
      
      // Guardar estado en BD si la API lo soporta
      try {
        await api.post('/estado-dispositivo', {
          macAddress: macAddressRef.current,
          ...payload
        });
      } catch (err) {
        console.log("Guardado de estado no disponible o falló", err);
      }
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignorar errores por cancelación
        return;
      }
      console.error("Error al obtener datos del sensor:", error);
      setConectado(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Configurar polling al montar el componente
  useEffect(() => {
    // Obtener datos inmediatamente
    fetchSensorData();
    
    // Configurar intervalo de actualización
    intervalRef.current = setInterval(fetchSensorData, 5000); // Actualizar cada 5 segundos
    
    // Limpieza al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, [macAddress]); // Re-iniciar si cambia la MAC
  
  // Función para enviar comandos
  const enviarComando = async (comando: any): Promise<void> => {
    if (!macAddressRef.current) {
      console.error("No se puede enviar comando: MAC Address no proporcionada");
      return;
    }
    
    try {
      // Determinar tipo y valor del comando
      let tipo: string = '';
      let valor: string = '';
      
      if ('ventanaAbierta' in comando) {
        tipo = 'servo';
        valor = comando.ventanaAbierta ? 'abrir' : 'cerrar';
      } 
      else if ('ventiladorActivo' in comando) {
        tipo = 'ventilador';
        valor = comando.ventiladorActivo ? 'encender' : 'apagar';
      }
      else if ('ventiladorVelocidad' in comando) {
        tipo = 'velocidad';
        valor = Math.round(comando.ventiladorVelocidad * 100).toString();
      }
      else if ('riegoActivo' in comando) {
        tipo = 'riego';
        valor = comando.riegoActivo ? 'activar' : 'desactivar';
      }
      
      if (!tipo) {
        console.error("Tipo de comando desconocido:", comando);
        return;
      }
      
      // Optimistic update - actualizar la UI inmediatamente
      setDatos(prevData => ({
        ...prevData,
        ...comando
      }));
      
      // Enviar comando a través de la API
      const topic = `mi/topico/${tipo}/${macAddressRef.current}`;
      await api.post('/mqtt/publish', { 
        topic, 
        message: valor,
        macAddress: macAddressRef.current
      });
      
      console.log(`Comando enviado a ${topic}: ${valor}`);
      
      // Forzar actualización de datos después de enviar comando
      setTimeout(fetchSensorData, 1000);
      
    } catch (error) {
      console.error("Error al enviar comando:", error);
      // Revertir cambio optimista en caso de error
      fetchSensorData();
      throw error;
    }
  };
  
  return {
    datos,
    conectado,
    loading,
    lastFetch,
    enviarComando,
    recargarDatos: fetchSensorData
  };
}