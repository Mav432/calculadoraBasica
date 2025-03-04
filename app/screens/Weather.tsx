// mostrar el pronostico
// llamado de weather api
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Alert } from 'react-native';
// importamos el componente WeatherCard
import WeatherCard from '../components/WeatherCard';

// interfaz para definir estrcutura de datos
interface WeatherData {
    date: string;
    day: string;
    tempMin: number;
    tempMax: number;
    rainProbability: number;
    weatherState: string;
}

const Weather: React.FC = () => {
    // estado almacena informacion del clima
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    //estado controla indicador de carga
    const [loading, setLoading] = useState<boolean>(true);

    //const API_KEY = '4d445eedf41f49a7b7c141522240411';
    const API_KEY = '343b477f73084abc85d150410252602'; // nueva clave
    const CITY = 'Hidalgo';

    // usseEfect para obtener la info del clima
    useEffect(() => {
        fetchWeatherData();
    }, []);

    // funcion asinc para obtenr datos de la api
    const fetchWeatherData = async () => {
        try {
            // llamada de la api
            const response = await fetch(
                `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=5&aqi=no&alerts=no`
            );
            const data = await response.json();
            console.log('Weather data:', data);

            // si respuesta contiene error mostrar alerta
            if (data.error) {
                Alert.alert('Error', data.error.message);
                setLoading(false);
                return;
            }

            // procesar data para extraer info
            const processedData = data.forecast.forecastday.map((dayData: any) => {
                // fecha
                const dateObj = new Date(dayData.date);
                // formato "dd/mm/aaaa"
                const formattedDate = dateObj.toLocaleDateString('es-ES');
                // nombre del dia
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
                const dayFormatted = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                // retornamos la info para cada dia
                return {
                    date: formattedDate,
                    day: dayFormatted,
                    tempMax: dayData.day.maxtemp_c,
                    tempMin: dayData.day.mintemp_c,
                    rainProbability: dayData.day.daily_chance_of_rain,
                    weatherState: dayData.day.condition.text,
                };
            });

            // actualizamois el estado 
            setWeatherData(processedData);

        } catch (error) {
            //si courre une rror, mostramos erro
            console.log('Error fecth weather data:', error);
            Alert.alert('Error', 'Ocurrio un error al obtener los datos')
        } finally {
            //finalizar indicador de carga
            setLoading(false);
        }
    };

    // fucnon para renderizar elemento de la lista
    
    const renderItem = ({ item }: { item: WeatherData }) => (
        <WeatherCard data={item} />
    )

    // si los datos estan cargando, mostrar indicador
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={"#0000ff"} />
            </View>
        );
    }

    // Renderizar el flatlizt con la info del clima
    return (
        <View style={styles.container}>
            <FlatList
                data={weatherData} // informacion process del cima
                renderItem={renderItem} // funcionrenderiza cada weather
                keyExtractor={(item) => item.date} //usamos fecha como clave
                horizontal={true} // scroll horizontal  
            />
        </View>
    );
};

// Estilos para la página Weather.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Weather;