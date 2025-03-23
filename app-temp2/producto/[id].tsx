import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Boton from '../../app-temp/components/Boton'
import Foother from '../../app-temp/components/Footer'
import Header from '../../app-temp/components/Header'
import { useLocalSearchParams } from 'expo-router'

const productodetalle = () => {

    const {id}=useLocalSearchParams();

    type producto={
        id: number,
        title: string,
        price: number,
        description: string,
        category: string,
        image: string,
        rating: {
            rate: number,
            count: number
        }
    }

    const [Product,setProduct]=useState<producto>();
    const [loading,setLoading]=useState<boolean>(true);

    //pantalla unload
    const UnLoadScreen=()=>{
        return(
            <View>
                <Text>Esperando Datos...</Text>
                <ActivityIndicator/>
                <Boton titulo='Cargar datos...' 
                onPress={()=>{Consultar()}}/>
            </View>
        )
    }

    //pantalla con datos cargados
    const LoadScreen=()=>{
        return(
            <View>
                <Text>Datos Cargados...</Text>
                <Text>Producto : {Product?.title}</Text>
                <Text>Precio : ${Product?.price}</Text>
                <Text>Descripcion : {Product?.description}</Text>
                <Image source={{uri:Product?.image}} style={{width:200,height:200}}/>
            </View>
        )
    }

    const Consultar= async ()=>{
        setLoading(true);
        try {
            const respuesta= await fetch('https://fakestoreapi.com/products/'+id);
            
            //preguntamos si no quiso diosito
            if(!respuesta.ok){
                throw new Error ('Problema al obtener datos : ${respuesta.status}');
            }
            //si si quiso pasamos la respuesta a json
            const datos= await respuesta.json();
            //guardamos los datos en el estado product
            setProduct(datos);
            setLoading(false);
        } catch (error) {
            console.log('Ocurrio un error al consultar los datos....',error);
        }

    }

  return (
    <View style={styles.container}>
        <Header Titulo='Fake Store...' 
        nombre='MTI. Luis Alberto Mendoza'
        imagen={require('../../assets/myAvatar.png')}/>

        {loading?UnLoadScreen():LoadScreen()}

      <Foother Fecha='06/03/25' Grupo='5A'/>
    </View>
  )
}

export default productodetalle

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
    }
})