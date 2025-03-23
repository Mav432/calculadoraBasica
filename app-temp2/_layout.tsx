// app/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';

export default function Layout(): JSX.Element {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="products" options={{ title: 'Productos' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categorías' }} />
      <Tabs.Screen name="account" options={{ title: 'Mi Cuenta' }} />
    </Tabs>
  );
}
