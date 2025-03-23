import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL base de la API (local para pruebas)
//const API_BASE_URL = "http://localhost:4000/api"; // Cambia esta URL según tu entorno
const API_BASE_URL = "https://api-agristore.vercel.app/api"; // Cambia esta URL según tu entorno

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permite enviar cookies con las solicitudes
});

// Interceptores para manejo global de solicitudes
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener el token de autenticación desde AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Si existe un token, añadirlo al header de autorización
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`🔐 Token añadido a solicitud ${config.url}`);
      }
    } catch (error) {
      console.error("❌ Error al obtener token:", error);
    }

    console.log(`📡 Enviando solicitud a ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Error en solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptores para manejo global de respuestas
// Interceptores para manejo global de respuestas
api.interceptors.response.use(
  (response) => {
    // Tratar todas las respuestas exitosas aquí
    console.log(
      `✅ Respuesta de ${response.config.url}: Estado ${response.status}`
    );
    return response;
  },
  async (error) => {
    // Tratar todos los errores aquí
    if (error.response) {
      // La solicitud fue realizada, pero el servidor respondió con un código de error
      console.error(`❌ Error ${error.response.status} en ${error.config.url}`);

      // Si es error 401 (no autorizado), el token podría ser inválido
      if (error.response.status === 401) {
        console.warn("⚠️ Sesión expirada o no autorizado");

        // Limpiar el token inválido
        try {
          await AsyncStorage.removeItem("token");
          console.log("🔑 Token eliminado por expiración");
        } catch (removeError) {
          console.error("❌ Error al eliminar token expirado:", removeError);
        }

        // Aquí podrías dispatchear una acción para redireccionar al usuario
      }
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error("❌ No se recibió respuesta del servidor");
    } else {
      // Algo ocurrió durante la configuración de la solicitud
      console.error("❌ Error de configuración:", error.message);
    }

    return Promise.reject(error);
  }
);
export default api;
