// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import agricultureTheme from '../../src/theme/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  // Color primario del tema para los iconos activos
  const activeColor = agricultureTheme.colors.primary;
  // Color para los iconos inactivos
  const inactiveColor = "#9E9E9E";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Productos",
          tabBarIcon: ({ color }) => <TabBarIcon name="package" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="categories"
        options={{
          title: "Categorías",
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="account"
        options={{
          title: "Cuenta",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="iot"
        options={{
          href: isAuthenticated ? undefined : null, // Oculta la pestaña cuando no está autenticado
          title: "IoT",
          tabBarIcon: ({ color }) => <TabBarIcon name="wifi" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={24} {...props} />;
}