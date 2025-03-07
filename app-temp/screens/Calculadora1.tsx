import React, { useState }from "react"; // Importar libreria de react y hook
import { StyleSheet, Text, View } from "react-native"; // importa componentes 
import Octicons from '@expo/vector-icons/Octicons'; // importa iconos de Octicons de expo
import AntDesing from '@expo/vector-icons/AntDesign'; // Importa conjunto de iconos de AntDesign de expo
import Feather from '@expo/vector-icons/Feather'; // Importa iconos de Feather de expo
import Toast from 'react-native-toast-message'; // Importa componente Toast para mostrar mensajes

// Importar componentes personalizados
import Caja from "../components/Caja";
import Boton from "../components/Boton";

// Parte logica
type Operacion = "suma" | "resta" | "multiplicacion" | "division";

const Calculadora1 = () => {
    // Estados de la aplicacion
    const [valor1, setValor1] = useState(''); // Estado del valor 1
    const [valor2, setValor2] = useState(''); // Estado del valor 2
    const [res, setRes] = useState<number | null>(0); // Estado del resultado

    // Funcion para validar y convertir valores ingresados
    const validarValores = (): { v1: number; v2: number } | null => {
        const v1 = parseFloat(valor1);
        const v2 = parseFloat(valor2);

        if(isNaN(v1) || isNaN(v2)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Valores no validos',
            });
            return null;
        }
        return { v1, v2 };
    };

    // Funciones de operaciones

     // Función para limpiar los inputs
    const clearInputs = () => {
        setValor1('');
        setValor2('');
    };

// Función única para manejar todas las operaciones usando un switch
const calcular = (operacion: Operacion) => {
    const valores = validarValores();
    if (!valores) return;

    let resultado: number;

    switch (operacion) {
      case "suma":
        resultado = valores.v1 + valores.v2;
        break;
      case "resta":
        resultado = valores.v1 - valores.v2;
        break;
      case "multiplicacion":
        resultado = valores.v1 * valores.v2;
        break;
      case "division":
        if (valores.v2 === 0) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se puede dividir por cero',
          });
          return;
        }
        resultado = valores.v1 / valores.v2;
        break;
      default:
        return;
    }

    setRes(resultado);
    clearInputs();
  };
 

    // Renderizado de la aplicacion
    return (
        <View style={styles.container}>
            {/** Cja para el primer valor */}
            <Caja
                label="Valor 1"
                icono={<Octicons name="number" size={24} color={'black'}/>}
                onChangeText={(contenido => {setValor1(contenido)})}
                value={valor1}
            />

            {/** Caja para el segundo valor */}
            <Caja
                label="Valor 2"
                icono={<Octicons name="number" size={24} color={'black'}/>}
                onChangeText={(contenido => {setValor2(contenido)})}
                value={valor2}
            />

            {/** Botonera con las operaciones */}
            <View style={styles.botonera}>
                <Boton
                    titulo="Suma"
                    icono={<Octicons name="plus-circle" size={24} color={'white'}/>}
                    onPress={() => calcular("suma")}
                />

                <Boton
                    titulo="Resta"
                    icono={<AntDesing name="minuscircleo" size={24} color={'white'}/>}
                    onPress={() => calcular("resta")}
                />

                <Boton
                    titulo="Multiplicacion"
                    icono={<Octicons name="x-circle" size={24} color={'white'}/>}
                    onPress={() => calcular("multiplicacion")}
                />

                <Boton
                    titulo="Division"
                    icono={<Feather name="divide-circle" size={24} color={'white'}/>}
                    onPress={() => calcular("division")}
                />

                {/** Resultado de la operacion */}
                <Text style={styles.resultText}>
                    El resultado es: {res}
                </Text>

                <Text style={styles.resultText}>
                    Valor 1: {valor1}, Valor 2: {valor2}
                </Text>

            </View>
        </View>
    );
};

export default Calculadora1;

// Estilos del componente
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#121212',
      alignItems: 'center',
    },
    botonera: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 24,
    },
    resultText: {
      fontSize: 18,
      color: 'white',
      marginVertical: 10,
      backgroundColor: '#2D2D2D',
      padding: 16,
      borderRadius: 10,
      width: '100%',
      textAlign: 'center',
    },
  });