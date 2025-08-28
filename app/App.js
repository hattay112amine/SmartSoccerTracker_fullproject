import { registerRootComponent } from 'expo';
import React from 'react';
import AppNavigator from './app/navigation/AppNavigator';
import { CardsProvider } from './app/screens/CardsContext.js';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from './app/screens/ThemeContext.js'; 
enableScreens();

function App() {
  return (
    <ThemeProvider>
      <CardsProvider>
        <AppNavigator />
      </CardsProvider>
    </ThemeProvider>
  );
}
registerRootComponent(App);