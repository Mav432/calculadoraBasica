import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Definimos una interfaz para props del footer
type Props = {
    Grupo : string // nombre del grupo que se mostrara en el footer
    Fecha: string // fecha que se mostrara en el footer
    color?: string; // color del texto
};

// Componente reutilizable de footer
const Footer: React.FC<Props> = ({ Grupo, Fecha, color}) => {
    return (
        // Contenedor principal
        <View style={[styles.container, { backgroundColor: color}]} >
            <Text style={styles.titulo}>Grupo: {Grupo}</Text>
            <Text style={styles.titulo}>Fecha: {Fecha}</Text>
        </View>
    );
}

export default Footer;

// Estilos del componente Footer
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row', // Disposición en fila
      justifyContent: 'space-between', // Espaciado entre elementos
      alignItems: 'center', // Alineación vertical centrada
      borderColor: 'black', // Color del borde
      borderWidth: 1, // Ancho del borde
      borderRadius: 5, // Radio de las esquinas
      padding: 10, // Espaciado interno
      paddingHorizontal: 15, // Espaciado interno horizontal
    },
    titulo: {
      fontSize: 25, // Tamaño de la fuente del texto
      fontWeight: 'bold', // Peso de la fuente del texto
      color: 'white', // Color del texto
    },
  });