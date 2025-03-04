import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle, Platform } from "react-native";

// definomos una interfaz para los props del componente
type Props = {
    titulo: string; // txt del boton
    variante?: 'Primario' | 'Secundario'; // variante del boton
    estilo?: StyleProp<ViewStyle>; // estilo personalizado
    disable?: boolean; // indica si el boton esta deshabilitado
    icono?: React.ReactNode; // icono del boton
    posicionIcono?: 'Izquierda' | 'Derecha'; // posicion del icono
    onPress: () => void; // funcion que se ejecutara al presionar el boton
};

// Componete reutilizable de boton
const Boton: React.FC<Props> = (props) => {
    // funcion para obtener el estilo del boton
    const getVariante = () => {
        switch (props.variante) {
            case 'Secundario':
                return styles.Secundario;
            default: 
                return styles.Primario;
        }
    };

return (
    // Cmponente presionable con estilo y funcion
    <Pressable
        // Estilos del boton
        style={[
            styles.boton, // Estilos base del boton
            getVariante(), // Estilo basado en la variante (Primario, Secundario)
            props.estilo, // Estilo personalizado
            props.disable && styles.Desabilitado, // Estilo de desabilitado si el boton esta deshabilitado
        ]}
        // Funcion que se ejecutara al presionar el boton
        onPress={props.onPress} 
        // Deshabilitar el boton si la prop 'disable' es verdarera
        disabled={props.disable} 
        >
            {/* Si hay un icono y la posicion del icono no es 'Derecha', mostramos el icono a la izquierda */}
            {props.icono && props.posicionIcono !== 'Derecha' && props.icono}
            
            <Text style={styles.Texto}>{props.titulo}</Text>

            {/* Si hay un icono y la posicion del icono en 'Derecha', mostramos el icono a la derecha */}
            {props.icono && props.posicionIcono === 'Derecha' && props.icono}
    </Pressable>
)
};

export default Boton;

// Estilos del componente Boton
const styles = StyleSheet.create({
  boton: {
    padding: 16,
    margin: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '40%',
    // Sombra multiplataforma
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  Texto: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 8,
    // fontFamily: 'Inter-SemiBold', // Si la tienes instalada
  },
  Primario: {
    backgroundColor: '#4B0082',
  },
  Secundario: {
    backgroundColor: '#6A1B9A',
  },
  Desabilitado: {
    opacity: 0.6,
  },
});