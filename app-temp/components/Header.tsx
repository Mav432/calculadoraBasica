import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

// Definimos una interfaz para props del header
type Props = {
  Titulo: string; // Titulo mostrara en el encabezado
  nombre: string; // Nombre que mostrara en el encabezado
  imagen: any; // Imagen que mostrara en el encabezado
  color?: string; // Color de fondo opcional
};

// Componente reutilizable de encabezado
const Header: React.FC<Props> = ({ Titulo, nombre, imagen, color = '#C0A16B' }) => {
    return (
        // Contenedor  principal
        <View style={[styles.container, { backgroundColor: color}]}>
            <View>
                <Image source={imagen} style={styles.imagen} />
            </View>
            <View>
                <Text style={styles.titulo}>{Titulo}</Text>
                <Text style={styles.nombre}>{nombre}</Text>
            </View>
        </View>
    );
};

export default Header;

// Estilos del componente
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
    imagen: {
      height: 75, // Altura de la imagen
      width: 75, // Ancho de la imagen
      borderRadius: 38, // Radio de las esquinas de la imagen
    },
    titulo: {
      fontSize: 25, // Tamaño de la fuente del título
      fontWeight: 'bold', // Peso de la fuente del título
      color: 'white', // Color del texto
    },
    nombre: {
      fontSize: 18, // Tamaño de la fuente del nombre
      fontWeight: 'bold', // Peso de la fuente del nombre
      color: 'white', // Color del texto
    },
  });