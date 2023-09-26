import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView } from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Portal from './screens/Portal.js';
import Alerts from './screens/Alerts.js';
import AllAlerts from './screens/AllAlerts.js';
import Reports from './screens/Reports.js';
import HomeScreen from './screens/HomeScreen.js';
import SignInScreen from './screens/SignInScreen';
import LoadingScreen from './screens/LoadingScreen.js';
import SignUpScreen from './screens/SignUpScreen';
import AuthContext from './AuthContext';
import { useMemo, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';



const Stack = createNativeStackNavigator();


export default function App({navigation}) {

  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
  };

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    initialState // Use the initial state here
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);


  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, you would implement sign-in logic here
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  return (

    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={() => ({
        headerTitleStyle: styles.headerTitleStyle,
        headerStyle: { backgroundColor: '#1059d5'},
        headerTintColor: 'white'
        })}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Loading" component={LoadingScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          ) : (
            // User is signed in
            <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Alerts" component={Alerts} />
            <Stack.Screen name="Portal" component={Portal} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider> 
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
  root: {
    flex: 1,
  }
});
