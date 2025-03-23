import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, Badge, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { Device } from '../services/dispositivo';

interface DeviceCardProps {
    device: Device;
    onPress: (id: string) => void;
    onDelete: (id: string) => void;
    connected?: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
    device,
    onPress,
    onDelete,
    connected = false
}) => {
    const theme = useTheme();

    return (
        <Card style={styles.card} onPress={() => device._id && onPress(device._id)}>
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{device.name}</Text>
                    <IconButton
                        icon="delete"
                        size={20}
                        iconColor={theme.colors.error}
                        onPress={(e) => {
                            e.stopPropagation();
                            device._id && onDelete(device._id);
                        }}
                    />
                </View>

                <View style={styles.details}>
                    <Text style={styles.macAddress}>MAC: {device.macAddress}</Text>

                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusIndicator,
                                { backgroundColor: connected ? theme.colors.primary : theme.colors.error }
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {connected ? 'Conectado' : 'Desconectado'}
                        </Text>
                    </View>
                </View>

                {device.createdAt && (
                    <Text style={styles.date}>
                        Registrado: {new Date(device.createdAt).toLocaleDateString()}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    content: {
        padding: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    macAddress: {
        fontSize: 14,
        opacity: 0.7,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 4,
    },
});

export default DeviceCard;