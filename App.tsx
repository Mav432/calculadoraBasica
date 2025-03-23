// src/App.tsx

import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import agricultureTheme from './src/theme/theme';
import "expo-router/entry";

import Toast from 'react-native-toast-message'; // Añadir esta importación
import { toastConfig } from './src/theme/toastConfig'; // Importar configuración

export default function App() {
  return (
    <PaperProvider theme={agricultureTheme}>
      <>
        {/* <Toast config={toastConfig} /> */}
        <Toast config={toastConfig} />
      </>
    </PaperProvider>
  );
}
