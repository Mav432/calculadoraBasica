//componente que muestra targeta con la informacion del clima
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// interfaz para definir estrcutura de datos
interface WeatherData {
    date: string; // fecha formateada
    day: string; // dia de la semana
    tempMin: number; // temperatura minima
    tempMax: number; // temperatura maxima
    rainProbability: number; // probabilidad de lluvia
    weatherState: string; // estado del clima
}

// definimos los props que refibira el componente
interface WeatherCardProps {
    data: WeatherData; // datos del clima
}

// Componente funcional que muestra la tarjeta del clima.
const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
    // Función para determinar el color de fondo de la tarjeta según la temperatura máxima.
    const getBackgroundColor = () => {
        if (data.tempMax < 20) {
            return '#ADD8E6'; // Azul claro para temperaturas menores a 20°C.
        } else if (data.tempMax <= 30) {
            return '#FFFACD'; // Amarillo claro para temperaturas entre 21°C y 30°C.
        } else {
            return '#FFA500'; // Naranja para temperaturas mayores a 30°C.
        }
    };

    // Renderizamos la tarjeta con la información del clima.
    return (
        <View style={[styles.card, { backgroundColor: getBackgroundColor() }]}>
            <Text style={styles.day}>{data.day}</Text>
            <Text style={styles.date}>{data.date}</Text>
            <Text style={styles.info}>Max: {data.tempMax}°C</Text>
            <Text style={styles.info}>Min: {data.tempMin}°C</Text>
            <Text style={styles.info}>Prob. Lluvia: {data.rainProbability}%</Text>
            <Text style={styles.info}>Estado: {data.weatherState}</Text>
        </View>
    );
};

// Estilos para la tarjeta.
const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 20,
        borderRadius: 10,
        elevation: 3, // Sombra para Android.
        // Propiedades de sombra para iOS.
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    day: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
    },
});

export default WeatherCard;