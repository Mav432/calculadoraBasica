// Importamos las dependencias principales de React y React Native
import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado
import { 
  StyleSheet,    // Para crear estilos
  Text,          // Para renderizar texto
  View,          // Contenedor básico de la interfaz
  FlatList,      // Componente para renderizar listas de forma optimizada
  Alert,          // Para mostrar alertas emergentes
  ScrollView,    // Para crear una vista desplazable
} from 'react-native';

// Importamos los componentes reutilizables previamente creados
import Caja from '../components/Caja'; // Componente para campos de texto
import Boton from '../components/Boton'; // Componente para botones presionables

// Definimos el tipo de dato para cada elemento del historial de cálculos
type HistorialItem = {
  id: string;            // Identificador único para el item
  consumo: number;       // Monto de consumo original ingresado
  tipPorcentaje: number; // Porcentaje de propina usado
  tip: number;           // Monto calculado de la propina
  total: number;         // Total a pagar (consumo + propina)
};

// Declaramos el componente principal CalculadoraPropinas
const CalculadoraPropinas = () => {
  // Estado para almacenar el monto de consumo ingresado (en formato string)
  const [consumo, setConsumo] = useState('');
  // Estado para almacenar la opción de porcentaje seleccionada: '10', '15', '20' o 'custom'
  const [selectedTip, setSelectedTip] = useState<'10' | '15' | '20' | 'custom'>('10');
  // Estado para almacenar el porcentaje personalizado (solo se usa si selectedTip es 'custom')
  const [customTip, setCustomTip] = useState('');
  // Estado para guardar el resultado del cálculo: monto de propina y total a pagar
  const [result, setResult] = useState({ tip: 0, total: 0 });
  // Estado para guardar el historial de operaciones realizadas, como un arreglo de HistorialItem
  const [history, setHistory] = useState<HistorialItem[]>([]);

  // Función que calcula la propina y el total a pagar
  const calcularPropina = () => {
    // Convertimos el monto de consumo (string) a número
    const monto = parseFloat(consumo);
    // Validamos que el monto sea un número válido
    if (isNaN(monto)) {
      Alert.alert('Error', 'Ingresa un monto de consumo válido'); // Mostramos alerta de error
      return; // Salimos de la función si la validación falla
    }

    let tipPorcentaje: number; // Variable para almacenar el porcentaje a usar
    // Si se seleccionó la opción personalizada, usamos el valor de customTip
    if (selectedTip === 'custom') {
      tipPorcentaje = parseFloat(customTip);
      // Validamos que el porcentaje personalizado sea un número válido
      if (isNaN(tipPorcentaje)) {
        Alert.alert('Error', 'Ingresa un porcentaje personalizado válido'); // Mostramos alerta de error
        return; // Salimos si la validación falla
      }
    } else {
      // Si se seleccionó una opción predefinida, convertimos ese valor (string) a número
      tipPorcentaje = parseFloat(selectedTip);
    }

    // Calculamos el monto de propina: (monto de consumo) * (porcentaje / 100)
    const tipAmount = monto * (tipPorcentaje / 100);
    // Calculamos el total a pagar: monto de consumo + monto de propina
    const total = monto + tipAmount;
    // Actualizamos el estado del resultado con el monto de propina y total calculado
    setResult({ tip: tipAmount, total });

    // Creamos un objeto para representar este cálculo en el historial
    const newEntry: HistorialItem = {
      id: Date.now().toString(), // Usamos la marca de tiempo como identificador único
      consumo: monto,            // Guardamos el monto de consumo ingresado
      tipPorcentaje,             // Guardamos el porcentaje de propina usado
      tip: tipAmount,            // Guardamos el monto calculado de la propina
      total,                     // Guardamos el total a pagar
    };

    // Agregamos el nuevo cálculo al inicio del historial
    setHistory(prev => [newEntry, ...prev]);

    // Limpiamos el campo de consumo después del cálculo
    setConsumo('');
    // Si se usó la opción personalizada, limpiamos también el campo de porcentaje personalizado
    if (selectedTip === 'custom') setCustomTip('');
  };

  // Función para renderizar cada item del historial en el FlatList
  const renderHistoryItem = ({ item }: { item: HistorialItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Consumo: ${item.consumo.toFixed(2)}</Text> {/* Muestra el consumo formateado a dos decimales */}
      <Text style={styles.historyText}>Propina: {item.tipPorcentaje}%</Text>           {/* Muestra el porcentaje de propina */}
      <Text style={styles.historyText}>Monto Propina: ${item.tip.toFixed(2)}</Text>     {/* Muestra el monto calculado de la propina */}
      <Text style={styles.historyText}>Total: ${item.total.toFixed(2)}</Text>           {/* Muestra el total a pagar */}
    </View>
  );

  // Renderizamos la interfaz principal del componente
  return (
    <ScrollView style={styles.container}>
      {/* Título principal de la Calculadora */}
      <Text style={styles.title}>Calculadora de Propinas</Text>

      {/* Sección para ingresar el monto de consumo utilizando el componente Caja */}
      <Caja
        label="Monto de Consumo:"                      // Etiqueta del input
        icono={null}                                  // Sin icono para este input (puedes agregar uno si deseas)
        value={consumo}                               // Valor actual del input, controlado por el estado 'consumo'
        onChangeText={setConsumo}                     // Función que actualiza el estado 'consumo' al cambiar el texto
      />

      {/* Sección para seleccionar el porcentaje de propina */}
      <View style={styles.tipOptions}>
        <Text style={styles.label}>Selecciona el porcentaje de propina:</Text>
        {/* Contenedor para los botones de selección de porcentaje */}
        <View style={styles.optionsContainer}>
          {/* Botón para la opción 10% utilizando el componente Boton */}
          <Boton
            titulo="10%"
            onPress={() => setSelectedTip('10')}       // Al presionar, se actualiza el estado 'selectedTip'
            variante="Primario"                         // Usamos la variante primaria para el estilo
            estilo={selectedTip === '10' ? styles.selectedOption : undefined} // Aplica estilo extra si está seleccionado
          />
          {/* Botón para la opción 15% */}
          <Boton
            titulo="15%"
            onPress={() => setSelectedTip('15')}
            variante="Primario"
            estilo={selectedTip === '15' ? styles.selectedOption : undefined}
          />
          {/* Botón para la opción 20% */}
          <Boton
            titulo="20%"
            onPress={() => setSelectedTip('20')}
            variante="Primario"
            estilo={selectedTip === '20' ? styles.selectedOption : undefined}
          />
          {/* Botón para la opción personalizada */}
          <Boton
            titulo="Personalizado"
            onPress={() => setSelectedTip('custom')}
            variante="Primario"
            estilo={selectedTip === 'custom' ? styles.selectedOption : undefined}
          />
        </View>
        {/* Si se selecciona la opción "Personalizado", mostramos un input para ingresar el porcentaje */}
        {selectedTip === 'custom' && (
          <Caja
            label="% Personalizado:"                  // Etiqueta para el campo personalizado
            icono={null}                              // No se utiliza icono en este input
            value={customTip}                         // Valor actual del input, controlado por 'customTip'
            onChangeText={setCustomTip}               // Función que actualiza 'customTip' al cambiar el texto
          />
        )}
      </View>

      {/* Botón para realizar el cálculo de la propina, utilizando el componente Boton */}
      <Boton
        titulo="Calcular Propina"
        onPress={calcularPropina}                     // Llama a la función que realiza el cálculo
        variante="Primario"                           // Aplica el estilo primario al botón
      />

      {/* Sección para mostrar los resultados del cálculo */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Monto de la Propina: ${result.tip.toFixed(2)} {/* Muestra el monto de propina con dos decimales */}
        </Text>
        <Text style={styles.resultText}>
          Total a Pagar: ${result.total.toFixed(2)}      {/* Muestra el total a pagar con dos decimales */}
        </Text>
      </View>

      {/* Sección para mostrar el historial de cálculos utilizando FlatList */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Historial de Operaciones</Text>
        <FlatList
          data={history}                           // Array de datos del historial
          keyExtractor={(item) => item.id}           // Función para obtener la clave única de cada item
          renderItem={renderHistoryItem}             // Función que renderiza cada item del historial
          style={styles.historyList}                 // Estilo aplicado a la lista
        />
      </View>
    </ScrollView>
  );
};


// Exportamos el componente para poder usarlo en otros lugares
export default CalculadoraPropinas;

// Definimos los estilos del componente utilizando StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro, igual que Calculadora1
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Estilo para la sección de selección de propina
  tipOptions: {
    marginBottom: 20,
  },
  // Estilo para las etiquetas
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  // Contenedor para los botones de selección
  optionsContainer: {
    flexDirection: 'row',         // Botones en fila
    flexWrap: 'wrap',             // Permite que los botones salten de línea si no caben
    justifyContent: 'space-between',
    backgroundColor: '#4B0082',   // Fondo morado para agrupar
    borderRadius: 10,
    padding: 16,
  },
  // Estilo para resaltar la opción activa
  selectedOption: {
    backgroundColor: '#6A1B9A',
  },
  // Contenedor para mostrar los resultados
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#2D2D2D',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
    marginVertical: 6,
    textAlign: 'center',
  },
  // Contenedor para el historial de operaciones
  historyContainer: {
    flex: 1, // Ocupa el espacio restante para la lista
    backgroundColor: '#2D2D2D',
    borderRadius: 10,
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  historyText: {
    color: 'white',
    fontSize: 14,
  },
});