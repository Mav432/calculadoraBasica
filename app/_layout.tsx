// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../src/theme/toastConfig';
import { AuthProvider } from '../src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout(): JSX.Element {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                {/* Stack principal de navegación sin encabezado */}
                <Stack screenOptions={{ headerShown: false }} />
                {/* Toast global para notificaciones */}
                <Toast config={toastConfig} />
            </AuthProvider>
        </GestureHandlerRootView>
    );
}