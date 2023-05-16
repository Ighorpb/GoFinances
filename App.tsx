import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR'
import { ThemeProvider } from 'styled-components';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as Splashscreen from 'expo-splash-screen'

import theme from './src/global/styles/theme';

import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';

import { StatusBar } from 'react-native';

import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/hooks/auth';



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
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>


    </>
  )
}