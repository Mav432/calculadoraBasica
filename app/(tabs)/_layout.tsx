// app/_layout.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import IndexScreen from './index';
import ProductosScreen from './productos';
import { DarkTheme } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={IndexScreen} />
        <Tab.Screen name="Productos" component={ProductosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
