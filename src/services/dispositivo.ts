// c:\Users\hpx36\Documents\my_projects\proyect\AgriMovil\src\services\dispositivo.ts
import api from "./api";

// Definición de la interfaz Device basada en tu modelo de MongoDB
export interface Device {
  _id?: string;
  macAddress: string;
  name: string;
  user?:
    | string
    | {
        _id: string;
        username?: string;
        email?: string;
        // Otros campos de usuario si se hace populate
      };
  createdAt?: string;
  updatedAt?: string;
}

export const getDispositivosRequest = async () => {
  try {
    const response = await api.get("/dispositivos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    throw error;
  }
};

export const getDispositivosByUserIdRequest = async (userId: string) => {
  try {
    const response = await api.get(`/usuarios/${userId}/dispositivos`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener dispositivos del usuario ${userId}:`,
      error
    );
    throw error;
  }
};

export const getDispositivoRequest = async (id: string) => {
  try {
    const response = await api.get(`/dispositivos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener dispositivo ${id}:`, error);
    throw error;
  }
};

export const createDispositivoRequest = async (dispositivo: {
  macAddress: string;
  name: string;
}) => {
  try {
    const response = await api.post("/dispositivos", dispositivo);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw error;
  }
};

export const updateDispositivoRequest = async (
  id: string,
  dispositivo: { macAddress?: string; name?: string }
) => {
  try {
    const response = await api.put(`/dispositivos/${id}`, dispositivo);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar dispositivo ${id}:`, error);
    throw error;
  }
};

export const deleteDispositivoRequest = async (id: string) => {
  try {
    const response = await api.delete(`/dispositivos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar dispositivo ${id}:`, error);
    throw error;
  }
};

// Nota: Este endpoint debe existir en el backend para controlar dispositivos
export const controlDispositivoRequest = async (
  id: string,
  comando: { [key: string]: any }
) => {
  try {
    const response = await api.post(`/dispositivos/${id}/control`, comando);
    return response.data;
  } catch (error) {
    console.error(`Error al enviar comando al dispositivo ${id}:`, error);
    throw error;
  }
};

// Nuevos endpoints para la comunicación MQTT
export const getSensorDataRequest = async (macAddress: string) => {
  try {
    const response = await api.get(`/mqtt/sensor-data/${macAddress}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos del sensor ${macAddress}:`, error);
    throw error;
  }
};

export const publishMqttMessageRequest = async (
  topic: string,
  message: string,
  macAddress: string
) => {
  try {
    const response = await api.post('/mqtt/publish', {
      topic,
      message,
      macAddress
    });
    return response.data;
  } catch (error) {
    console.error(`Error al publicar mensaje MQTT:`, error);
    throw error;
  }
};