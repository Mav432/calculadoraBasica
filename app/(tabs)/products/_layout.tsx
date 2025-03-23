import React from 'react';
import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  // Oculta el encabezado para mantener consistencia visual
      }}
    />
  );
}