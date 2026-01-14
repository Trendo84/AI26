import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarHeightProvider } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Import screens (we'll create these next)
import ChatScreen from './screens/ChatScreen';
import BreedsScreen from './screens/BreedsScreen';
import FactsScreen from './screens/FactsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BreedDetailScreen from './screens/BreedDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Bruce AI',
          tabBarIcon: () => '💬',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
        }}
      />
      <Tab.Screen
        name="Breeds"
        component={BreedsScreen}
        options={{
          title: 'Breeds',
          tabBarIcon: () => '🐈',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
        }}
      />
      <Tab.Screen
        name="Facts"
        component={FactsScreen}
        options={{
          title: 'Facts',
          tabBarIcon: () => '✨',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: () => '⚙️',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BreedDetail"
        component={BreedDetailScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <BottomTabBarHeightProvider>
          <RootStack />
        </BottomTabBarHeightProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
