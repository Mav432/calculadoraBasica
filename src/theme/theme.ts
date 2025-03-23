// src/theme/theme.ts
import { MD3LightTheme, configureFonts } from "react-native-paper";

// Definir directamente el tipo completo de colores
type AgricultureColors = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  background: string;
  surface: string;
  error: string;
  notification: string;
  text: string;
  onSurface: string;
  onPrimary: string;
  onSecondary: string;
  disabled: string;
  placeholder: string;
  outline: string;
  accent: string;
  success: string;
  info: string;
  warning: string;
  harvest: string;
  soil: string;
  water: string;
  // Incluir todas las propiedades de MD3Colors que estés usando
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  // Añade cualquier otra propiedad de MD3Colors que puedas necesitar
};

const fontConfig = {
  fontFamily: "System",
};

// Paleta de colores mejorada para agricultura con tonos verdes más intensos
const agricultureTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Colores principales - verdes más intensos
    primary: "#2E7D32", // Verde más oscuro e intenso
    primaryContainer: "#C8E6C9", // Contenedor verde claro
    secondary: "#558B2F", // Verde secundario
    secondaryContainer: "#DCEDC8", // Contenedor verde secundario claro

    // Colores de fondo
    background: "#FFFFFF",
    surface: "#F5F5F5",

    // Colores funcionales
    error: "#D32F2F",
    notification: "#AED581", // Notificación en tono verde claro

    // Colores de texto
    text: "#212121",
    onSurface: "#424242",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",

    // Elementos de UI
    disabled: "#BDBDBD",
    placeholder: "#757575",
    outline: "#E0E0E0",

    // Colores de acento para características específicas
    accent: "#8BC34A", // Acento verde más claro
    success: "#4CAF50",
    info: "#81C784", // Info en tono verde
    warning: "#FF9800",

    // Colores específicos para características agrícolas
    harvest: "#689F38", // Verde cosecha
    soil: "#795548",
    water: "#26A69A", // Agua en tono verde-azulado

    // Propiedades adicionales requeridas
    surfaceDisabled: "#F5F5F5",
    onSurfaceDisabled: "#9E9E9E",
    surfaceVariant: "#EEEEEE",
    onSurfaceVariant: "#757575",
    elevation: {
      level0: "#FFFFFF",
      level1: "#F5F5F5",
      level2: "#EEEEEE",
      level3: "#E0E0E0",
      level4: "#BDBDBD",
      level5: "#9E9E9E",
    },
  } as AgricultureColors,
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
  animation: {
    scale: 0.5,
  },
};

// Declaración explícita de los tipos para TypeScript
declare global {
  namespace ReactNativePaper {
    interface Theme {
      colors: AgricultureColors;
    }
  }
}

export default agricultureTheme;
