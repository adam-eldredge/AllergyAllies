import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogIn from './components/LogIn.js';
import Portal from './components/Portal.js';
import Alerts from './components/Alerts.js';
import HomeScreen from './components/HomeScreen.js';

const Stack = createNativeStackNavigator();


export default function App({navigation}) {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{title: 'HomeScreen'}}
        />
        <Stack.Screen
          name="Alerts"
          component={Alerts}
          options={{title: 'Alerts'}}
        />
        <Stack.Screen
          name="Login"
          component={LogIn}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Portal"
          component={Portal}
          options={{title: 'Portal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
