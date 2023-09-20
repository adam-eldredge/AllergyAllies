import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView } from 'react-native'
import * as React from 'react';
import {NavigationContainer, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogIn from './components/LogIn.js';
import Portal from './components/Portal.js';
import Alerts from './components/Alerts.js';
import HomeScreen from './components/HomeScreen.js';

const Stack = createNativeStackNavigator();

export default function App({navigation}) {
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        headerTitleStyle: styles.headerTitleStyle,
        headerStyle: { backgroundColor: '#1059d5'},
        headerTintColor: 'white'
      })}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
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
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    flex: 1,
  },
});
