/**
 * Rutas centralizadas para la navegación en AgriMovil
 * Este archivo mantiene todas las rutas de navegación en un solo lugar
 * para facilitar su mantenimiento y evitar errores de tipeo.
 */

// ejemplo de uso de las rutas
// import { ROUTES } from '../constants/routes';
// router.push(ROUTES.LOGIN);
export const ROUTES = {
    // Autenticación (dentro de account)
    LOGIN: '/(tabs)/account/(auth)/login',
    LOGIN_VERIFIED: '/(tabs)/account/(auth)/login?verified=true',
    REGISTER: '/(tabs)/account/(auth)/register',
    VERIFY_CODE: '/(tabs)/account/(auth)/verify-code',
    FORGOT_PASSWORD: '/(tabs)/account/(auth)/forgot-password',
    RESET_PASSWORD: '/(tabs)/account/(auth)/reset-password',
    
    // Tabs principales
    HOME: '/(tabs)',  
    PRODUCTS: '/(tabs)/products',
    CATEGORIES: '/(tabs)/categories',
    ACCOUNT: '/(tabs)/account',
    
    // Detalle de productos
    PRODUCT_DETAIL: (id: string) => `/(detail)/product/${id}`,
  };

// Funciones auxiliares para rutas con parámetros
export const appendQueryParam = (baseRoute: string, key: string, value: string): string => {
    return `${baseRoute}?${key}=${encodeURIComponent(value)}`;
};

export const appendVerifiedParam = (baseRoute: string): string => {
    return `${baseRoute}?verified=true`;
};