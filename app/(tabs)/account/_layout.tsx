// app/(tabs)/account/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AccountStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta el encabezado para todas las pantallas de "Mi Cuenta"
      }}
    />
  );
}