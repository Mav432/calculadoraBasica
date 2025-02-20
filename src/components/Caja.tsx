import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// definomos una interfaz para los props del componente
type Props = {
    label: string;
    icono: React.ReactNode;
    color?: string;
    value?: string;
    onChangeText: (valor: string) => void; // Funcion que llamara cuando el texto acmbie

};

// Componentes reutilizable de caja de texto
const Caja: React.FC<Props> = ({ label, icono, color = 'black', onChangeText, value }) => {
    return (
        // Contenedor principal
        <View style={[styles.container, { borderBottomColor: color}]}>
            <Text style={[styles.label, { color }]}>{label}</Text>
            <View style={styles.caja}>
                {icono}
                <TextInput
                    placeholder={label}
                    placeholderTextColor={color}
                    style={[styles.input, { color}]}
                    onChangeText={onChangeText}
                    value={value}
                />
            </View>
        </View>
    )
};

export default Caja;

// Estilos del componente
const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        width: '90%',
    },
    caja: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#A0A0A0',
        marginBottom: 8,
        fontFamily: 'Inter-Medium',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        color: 'white',
        fontFamily: 'Inter-Regular',
    },
});