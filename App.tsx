import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR'
import { ThemeProvider } from 'styled-components';

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as Splashscreen from 'expo-splash-screen'

import theme from './src/global/styles/theme';

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';

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
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </ThemeProvider>


    </>
  )
}