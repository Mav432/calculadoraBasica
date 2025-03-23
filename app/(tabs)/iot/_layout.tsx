import React from 'react';
import { Stack } from 'expo-router';
import { DispositivoProvider } from '../../../src/contexts/DispositivoContext';

export default function IoTLayout() {
  return (
    <DispositivoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </DispositivoProvider>
  );
}