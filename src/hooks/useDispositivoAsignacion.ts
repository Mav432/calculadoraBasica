import { useState } from 'react';
import { createDispositivoRequest } from '../services/dispositivo';

interface AsignacionValues {
  macAddress: string;
  name: string;
}

export const useDispositivoAsignacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asignarDispositivo = async (values: AsignacionValues) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Values received in hook:", values);
      
      // Make sure data structure matches backend expectations
      const requestData = {
        macAddress: values.macAddress,
        name: values.name,
        // No need to add user here if it's coming from the authentication token
      };
      
      const response = await createDispositivoRequest(requestData);
      console.log("Respuesta del servidor:", response);
      return response;
    } catch (error: any) {
      console.error("Error al asignar el dispositivo:", error);
      setError(error?.response?.data?.message || 'Error al asignar el dispositivo');
      throw error; // Re-throw to allow handling in the component
    } finally {
      setLoading(false);
    }
  };

  return { asignarDispositivo, loading, error };
};