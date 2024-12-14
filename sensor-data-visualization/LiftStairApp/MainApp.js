import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import GoingDown from './GoingDown';
import GoingUp from './GoingUp';
import LiftUp from './LiftUp';
import LiftDown from './LiftDown';

const Stack = createStackNavigator();

export default function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="GoingDown" component={GoingDown} />
        <Stack.Screen name="GoingUp" component={GoingUp} />
        <Stack.Screen name="LiftUp" component={LiftUp} />
        <Stack.Screen name="LiftDown" component={LiftDown} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
