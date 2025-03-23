import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Switch, Button, useTheme, ProgressBar, Divider } from 'react-native-paper';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface DeviceControlProps {
    datos: {
        temperatura?: number;
        humedad?: number;
        humedadSuelo?: number;
        luz?: number;
        ventanaAbierta: boolean;
        ventiladorActivo: boolean;
        ventiladorVelocidad: number;
        riegoActivo: boolean;
    };
    conectado: boolean;
    mqttConectado?: boolean;
    lastCommands?: {
        servo: string | null;
        riego: string | null;
        ventilador: string | null;
        velocidad: string | null;
    };
    onControlCommand: (comando: { [key: string]: any }) => Promise<void>;
}

const DeviceControl: React.FC<DeviceControlProps> = ({
    datos,
    conectado,
    mqttConectado = true,
    lastCommands = { servo: null, riego: null, ventilador: null, velocidad: null },
    onControlCommand
}) => {
    console.log("Renderizando DeviceControl con datos:", datos);
    
    const theme = useTheme();
    const [ventiladorSpeed, setVentiladorSpeed] = useState(datos.ventiladorVelocidad);
    const [loading, setLoading] = useState({
        ventilador: false,
        ventana: false,
        riego: false,
    });
    
    // Actualizar velocidad local cuando cambian los datos
    useEffect(() => {
        setVentiladorSpeed(datos.ventiladorVelocidad);
    }, [datos.ventiladorVelocidad]);

    const handleVentiladorToggle = async () => {
        try {
            setLoading(prev => ({ ...prev, ventilador: true }));
            await onControlCommand({ ventiladorActivo: !datos.ventiladorActivo });
        } catch (error) {
            console.error('Error al controlar el ventilador:', error);
        } finally {
            setLoading(prev => ({ ...prev, ventilador: false }));
        }
    };

    const handleVentiladorSpeed = async (value: number) => {
        try {
            setVentiladorSpeed(value);
            await onControlCommand({ ventiladorVelocidad: value });
        } catch (error) {
            console.error('Error al ajustar velocidad del ventilador:', error);
        }
    };

    const handleVentanaToggle = async () => {
        try {
            setLoading(prev => ({ ...prev, ventana: true }));
            await onControlCommand({ ventanaAbierta: !datos.ventanaAbierta });
        } catch (error) {
            console.error('Error al controlar la ventana:', error);
        } finally {
            setLoading(prev => ({ ...prev, ventana: false }));
        }
    };

    const handleRiegoToggle = async () => {
        try {
            setLoading(prev => ({ ...prev, riego: true }));
            await onControlCommand({ riegoActivo: !datos.riegoActivo });
        } catch (error) {
            console.error('Error al controlar el riego:', error);
        } finally {
            setLoading(prev => ({ ...prev, riego: false }));
        }
    };

    const obtenerEstadoTemperatura = (temperatura?: number) => {
        if (temperatura === undefined) return "Desconocida";
        if (temperatura < 20) return "Baja";
        if (temperatura > 30) return "Alta";
        return "Óptima";
    };

    const obtenerEstadoHumedad = (humedad?: number) => {
        if (humedad === undefined) return "Desconocida";
        if (humedad < 30) return "Baja";
        if (humedad > 70) return "Alta";
        return "Óptima";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Óptima":
                return theme.colors.primary;
            case "Baja":
            case "Alta":
                return 'orange';
            default:
                return theme.colors.onSurfaceDisabled || '#d3d3d3'; // Fallback to light gray if onSurfaceDisabled is unavailable
        }
    };

    return (
        <View style={styles.container}>
            {/* Tarjeta de Sensores */}
            <Card style={styles.card}>
                <Card.Title title="Sensores" />
                <Card.Content>
                    {/* Temperatura */}
                    <View style={styles.sensorRow}>
                        <View style={styles.sensorIcon}>
                            <FontAwesome5 name="temperature-high" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.sensorData}>
                            <Text style={styles.sensorLabel}>Temperatura</Text>
                            <View style={styles.sensorValueContainer}>
                                <Text style={styles.sensorValue}>
                                    {datos.temperatura !== undefined ? `${datos.temperatura}°C` : 'No disponible'}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(obtenerEstadoTemperatura(datos.temperatura))}]}>
                                    <Text style={styles.statusText}>{obtenerEstadoTemperatura(datos.temperatura)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Humedad */}
                    <View style={styles.sensorRow}>
                        <View style={styles.sensorIcon}>
                            <MaterialCommunityIcons name="water-percent" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.sensorData}>
                            <Text style={styles.sensorLabel}>Humedad</Text>
                            <View style={styles.sensorValueContainer}>
                                <Text style={styles.sensorValue}>
                                    {datos.humedad !== undefined ? `${datos.humedad}%` : 'No disponible'}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(obtenerEstadoHumedad(datos.humedad))}]}>
                                    <Text style={styles.statusText}>{obtenerEstadoHumedad(datos.humedad)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Humedad del Suelo */}
                    <View style={styles.sensorRow}>
                        <View style={styles.sensorIcon}>
                            <FontAwesome5 name="seedling" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.sensorData}>
                            <Text style={styles.sensorLabel}>Humedad del Suelo</Text>
                            <Text style={styles.sensorValue}>
                                {datos.humedadSuelo !== undefined ? `${datos.humedadSuelo}%` : 'No disponible'}
                            </Text>
                            {datos.humedadSuelo !== undefined && (
                                <ProgressBar
                                    progress={datos.humedadSuelo / 100}
                                    color={theme.colors.primary}
                                    style={styles.progressBar}
                                />
                            )}
                        </View>
                    </View>

                    {/* Luz */}
                    <View style={styles.sensorRow}>
                        <View style={styles.sensorIcon}>
                            <Ionicons name="sunny" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.sensorData}>
                            <Text style={styles.sensorLabel}>Intensidad de Luz</Text>
                            <Text style={styles.sensorValue}>
                                {datos.luz !== undefined ? `${datos.luz} lux` : 'No disponible'}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Tarjeta de Control */}
            <Card style={styles.card}>
                <Card.Title title="Control" />
                <Card.Content>
                    {/* Control de Ventilador */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlInfo}>
                            <View style={styles.controlIcon}>
                                <FontAwesome5 name="fan" size={24} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.controlLabel}>Ventilador</Text>
                                {lastCommands.ventilador && (
                                    <Text style={styles.commandLabel}>Último comando: {lastCommands.ventilador}</Text>
                                )}
                            </View>
                        </View>
                        <Switch
                            value={datos.ventiladorActivo}
                            onValueChange={handleVentiladorToggle}
                            disabled={!conectado || !mqttConectado || loading.ventilador}
                            color={theme.colors.primary}
                        />
                    </View>

                    {/* Control de Velocidad del Ventilador */}
                    {datos.ventiladorActivo && (
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabel}>
                                Velocidad: {Math.round(ventiladorSpeed * 100)}%
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                value={ventiladorSpeed}
                                onValueChange={setVentiladorSpeed}
                                onSlidingComplete={handleVentiladorSpeed}
                                minimumTrackTintColor={theme.colors.primary}
                                maximumTrackTintColor="#000000"
                                thumbTintColor={theme.colors.primary}
                                disabled={!conectado || !mqttConectado}
                            />
                            {lastCommands.velocidad && (
                                <Text style={styles.commandLabel}>Último valor: {lastCommands.velocidad}</Text>
                            )}
                        </View>
                    )}

                    <Divider style={styles.divider} />

                    {/* Control de Ventana */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlInfo}>
                            <View style={styles.controlIcon}>
                                <MaterialCommunityIcons 
                                    name={datos.ventanaAbierta ? "window-open" : "window-closed"} 
                                    size={24} 
                                    color={theme.colors.primary} 
                                />
                            </View>
                            <View>
                                <Text style={styles.controlLabel}>Ventana</Text>
                                {lastCommands.servo && (
                                    <Text style={styles.commandLabel}>Último comando: {lastCommands.servo}</Text>
                                )}
                            </View>
                        </View>
                        <Switch
                            value={datos.ventanaAbierta}
                            onValueChange={handleVentanaToggle}
                            disabled={!conectado || !mqttConectado || loading.ventana}
                            color={theme.colors.primary}
                        />
                    </View>

                    <Divider style={styles.divider} />

                    {/* Control de Riego */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlInfo}>
                            <View style={styles.controlIcon}>
                                <MaterialCommunityIcons 
                                    name={datos.riegoActivo ? "water" : "water-off"} 
                                    size={24} 
                                    color={theme.colors.primary} 
                                />
                            </View>
                            <View>
                                <Text style={styles.controlLabel}>Sistema de Riego</Text>
                                {lastCommands.riego && (
                                    <Text style={styles.commandLabel}>Último comando: {lastCommands.riego}</Text>
                                )}
                            </View>
                        </View>
                        <Switch
                            value={datos.riegoActivo}
                            onValueChange={handleRiegoToggle}
                            disabled={!conectado || !mqttConectado || loading.riego}
                            color={theme.colors.primary}
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Estado de la conexión */}
            <View style={styles.connectionContainer}>
                <View style={styles.connectionItem}>
                    <View
                        style={[
                            styles.connectionIndicator,
                            { backgroundColor: conectado ? 'green' : 'red' }
                        ]}
                    />
                    <Text style={styles.connectionText}>
                        {conectado ? 'Dispositivo conectado' : 'Dispositivo desconectado'}
                    </Text>
                </View>
                
                <View style={styles.connectionItem}>
                    <View
                        style={[
                            styles.connectionIndicator,
                            { backgroundColor: mqttConectado ? 'green' : 'red' }
                        ]}
                    />
                    <Text style={styles.connectionText}>
                        {mqttConectado ? 'MQTT conectado' : 'MQTT desconectado'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    sensorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sensorIcon: {
        width: 40,
        alignItems: 'center',
    },
    sensorData: {
        flex: 1,
        marginLeft: 12,
    },
    sensorLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    sensorValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sensorValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    controlInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    controlIcon: {
        width: 40,
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 16,
    },
    commandLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    sliderContainer: {
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    sliderLabel: {
        fontSize: 14,
        marginLeft: 40,
        marginBottom: 4,
    },
    slider: {
        height: 40,
    },
    divider: {
        marginVertical: 8,
    },
    connectionContainer: {
        marginTop: 16,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
    },
    connectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    connectionIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    connectionText: {
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DeviceControl;