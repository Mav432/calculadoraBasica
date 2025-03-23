import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  getDispositivosRequest,
  getDispositivoRequest,
  createDispositivoRequest,
  updateDispositivoRequest,
  deleteDispositivoRequest,
  Device
} from '../services/dispositivo';

interface DispositivoContextType {
  dispositivos: Device[];
  loading: boolean;
  error: string | null;
  getDispositivos: () => Promise<Device[] | null>;
  getDispositivo: (id: string) => Promise<Device | null>;
  createDispositivo: (dispositivo: { macAddress: string; name: string }) => Promise<Device | null>;
  updateDispositivo: (id: string, dispositivo: { macAddress?: string; name?: string }) => Promise<Device | null>;
  deleteDispositivo: (id: string) => Promise<boolean>;
}

const DispositivoContext = createContext<DispositivoContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useDispositivos = () => {
  const context = useContext(DispositivoContext);
  if (!context) {
    throw new Error('useDispositivos debe usarse dentro de un DispositivoProvider');
  }
  return context;
};

interface DispositivoProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export function DispositivoProvider({ children }: DispositivoProviderProps) {
  const [dispositivos, setDispositivos] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los dispositivos
  const getDispositivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDispositivosRequest();
      setDispositivos(data);
      return data;
    } catch (err) {
      console.error('Error al obtener dispositivos:', err);
      setError('No se pudieron cargar los dispositivos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un dispositivo por su ID
  const getDispositivo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDispositivoRequest(id);
      return data;
    } catch (err) {
      console.error('Error al obtener el dispositivo:', err);
      setError('No se pudo obtener el dispositivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo dispositivo
  const createDispositivo = async (dispositivo: { macAddress: string; name: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createDispositivoRequest(dispositivo);
      setDispositivos([...dispositivos, data]);
      return data;
    } catch (err) {
      console.error('Error al crear el dispositivo:', err);
      setError('No se pudo crear el dispositivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un dispositivo existente
  const updateDispositivo = async (id: string, dispositivo: { macAddress?: string; name?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateDispositivoRequest(id, dispositivo);
      setDispositivos(dispositivos.map(d => (d._id === id ? { ...d, ...data } : d)));
      return data;
    } catch (err) {
      console.error('Error al actualizar el dispositivo:', err);
      setError('No se pudo actualizar el dispositivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un dispositivo
  const deleteDispositivo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDispositivoRequest(id);
      setDispositivos(dispositivos.filter(dispositivo => dispositivo._id !== id));
      return true;
    } catch (err) {
      console.error('Error al eliminar el dispositivo:', err);
      setError('No se pudo eliminar el dispositivo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DispositivoContext.Provider
      value={{
        dispositivos,
        loading,
        error,
        getDispositivos,
        getDispositivo,
        createDispositivo,
        updateDispositivo,
        deleteDispositivo,
      }}
    >
      {children}
    </DispositivoContext.Provider>
  );
}