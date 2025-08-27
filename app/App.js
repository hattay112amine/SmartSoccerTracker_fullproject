import { registerRootComponent } from 'expo';
import React from 'react';
import AppNavigator from './app/navigation/AppNavigator';
import { CardsProvider } from './app/screens/CardsContext.js';
import { enableScreens } from 'react-native-screens';
enableScreens();

function App() {
  return (
    <CardsProvider>
      <AppNavigator />
    </CardsProvider>
  );
}
registerRootComponent(App);