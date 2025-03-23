// src/hooks/useToast.ts
import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info" | "warning";

// Configuración de límites por tipo de notificación
interface LimitConfig {
  maxCount: number; // Máximo de notificaciones en el período
  timeWindow: number; // Período de tiempo en milisegundos
}

const DEFAULT_LIMITS: Record<ToastType, LimitConfig> = {
  success: { maxCount: 3, timeWindow: 60000 }, // 3 notificaciones por minuto
  error: { maxCount: 2, timeWindow: 30000 }, // 2 notificaciones cada 30 segundos
  info: { maxCount: 4, timeWindow: 60000 }, // 4 notificaciones por minuto
  warning: { maxCount: 3, timeWindow: 45000 }, // 3 notificaciones cada 45 segundos
};

// Historial de notificaciones para controlar frecuencia
const notificationHistory: Record<
  ToastType,
  { count: number; lastReset: number }
> = {
  success: { count: 0, lastReset: 0 },
  error: { count: 0, lastReset: 0 },
  info: { count: 0, lastReset: 0 },
  warning: { count: 0, lastReset: 0 },
};

/**
 * Hook para mostrar notificaciones toast con control de frecuencia
 */
export const useToast = () => {
  /**
   * Método principal para mostrar una notificación con control de límites
   */
  const show = (params: {
    type: ToastType;
    text1: string;
    text2?: string;
    [key: string]: any;
  }) => {
    const type = params.type || "info";
    const now = Date.now();
    const history = notificationHistory[type];
    const limits = DEFAULT_LIMITS[type];

    // Resetear contador si ha pasado el tiempo de la ventana
    if (now - history.lastReset > limits.timeWindow) {
      history.count = 0;
      history.lastReset = now;
    }

    // Verificar si excedemos el límite
    if (history.count >= limits.maxCount) {
      console.log(`🔄 Límite de notificaciones de tipo ${type} alcanzado`);
      return; // No devuelve nada en lugar de false
    }

    // Actualizar contador e intentar mostrar
    history.count++;

    Toast.show({
      position: "top",
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
      ...params,
    });
  };

  /**
   * Fuerza la visualización de una notificación sin aplicar límites
   */
  const forceShow = (params: {
    type: ToastType;
    text1: string;
    text2?: string;
    [key: string]: any;
  }) => {
    // Forzar la visualización sin límites
    console.log(`Forzando mostrar toast: ${params.text1}`);
    
    Toast.show({
      position: "top",
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
      ...params,
    });
  };

  /**
   * Muestra una notificación de éxito
   */
  const success = (title: string, message?: string, options = {}) => {
    show({
      type: "success",
      text1: title,
      text2: message,
      ...options,
    });
  };

  /**
   * Muestra una notificación de error
   */
  const error = (title: string, message?: string, options = {}) => {
    return show({
      type: "error",
      text1: title,
      text2: message,
      ...options,
    });
  };

  /**
   * Muestra una notificación informativa
   */
  const info = (title: string, message?: string, options = {}) => {
    return show({
      type: "info",
      text1: title,
      text2: message,
      ...options,
    });
  };

  /**
   * Muestra una notificación de advertencia
   */
  const warning = (title: string, message?: string, options = {}) => {
    return show({
      type: "warning",
      text1: title,
      text2: message,
      ...options,
    });
  };

  /**
   * Oculta todas las notificaciones actuales
   */
  const hide = () => {
    Toast.hide();
  };

  // Retornar todas las funciones, incluida forceShow
  return {
    success,
    error,
    info,
    warning,
    show,
    forceShow,
    hide,
  };
};