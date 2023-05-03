import React from 'react';
import { ThemeProvider } from 'styled-components';

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as Splashscreen from 'expo-splash-screen'

import { Dashboard } from './src/screens/Dashboard';
import theme from './src/global/styles/theme';

import { StatusBar } from 'react-native';


export default function App() {
  Splashscreen.preventAutoHideAsync();
  const [fontsLoaded] = useFonts({ // Carregamento das fontes
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null; // Enquanto as fontes não estiverem disponíveis/carregadas, devolveremos null.
  }

  Splashscreen.hideAsync();
  return (
    <>
      <StatusBar barStyle="light-content" />
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
    </>
  )
}