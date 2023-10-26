import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView, Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Portal from './screens/Portal.js';
import AllAlerts from './screens/AllAlerts.js';
import Reports from './screens/Reports.js';
import PracticeSurvey from './screens/Survey/PracticeSurvey.js';
import SignInScreen from './screens/SignInScreen';
import LoadingScreen from './screens/LoadingScreen.js';
import PatientSignUpScreen from './screens/signup/PatientSignUpScreen';
import ProviderSignUpScreen from './screens/signup/ProviderSignUpScreen.js';
import practiceEnrollment from './screens/signup/practiceEnrollment.js';
import PatientHome from './screens/PatientHome.js';
import Upcoming from './screens/Upcoming.js';
import UpcomingInfo from './screens/UpcomingInfo.js';
import InitialScreen from './screens/InitialScreen.js';
import ProviderAccount from './screens/ProviderAccount.js';
import AuthContext from './AuthContext';
import viewPatients from './screens/viewPatients.js';
import { useMemo, useReducer, useEffect } from 'react';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';

// Secure store doesn't work on web, only iOS and android ^

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
        // restore token - see SignInScreen for how to decrypt
        userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        } 
        else {
          dispatch({ type: 'RESTORE_TOKEN', token: null });
        } 
      } catch (e) {
        // Restoring token failed
        console.error('Error:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: async (data) => {
      await AsyncStorage.setItem('userToken', data);
      dispatch({ type: 'SIGN_IN', token: data });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      dispatch({ type: 'SIGN_OUT'});
    },
    userToken: state.userToken, 
  }), [state.userToken]);

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
              name="InitialScreen"
              component={InitialScreen}
              options={{
                title: '',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                headerShown: false
              }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign In',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="PatientSignUpScreen"
              component={PatientSignUpScreen}
              options={{
                title: 'Patient Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="ProviderSignUpScreen"
              component={ProviderSignUpScreen}
              options={{
                title: 'Provider Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="PracticeEnrollment"
              component={practiceEnrollment}
              options={{
                title: 'Practice Enrollment',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            </>
          ) : (
            // User is signed in
            <>
            <Stack.Screen name="Portal" component={Portal} />
            <Stack.Screen name="AllAlerts" component={AllAlerts} options={{title: 'All Alerts'}}/>
            <Stack.Screen name="Reports" component={Reports} />
            <Stack.Screen name="PatientHome" component={PatientHome} options={{title: 'Patient Home'}} />
            <Stack.Screen name="Upcoming" component={Upcoming} options={{title: 'Upcoming Appointment'}} />
            <Stack.Screen name="UpcomingInfo" component={UpcomingInfo} options={{title: 'Additional Info'}} />
            <Stack.Screen name="PatientSignUpScreen" component={PatientSignUpScreen} options={{title: 'Patient Sign Up'}} />
            <Stack.Screen name="ProviderSignUpScreen" component={ProviderSignUpScreen} options={{title: 'Provider Sign Up'}} />
            <Stack.Screen name="PracticeEnrollmentScreen" component={practiceEnrollment} options={{ title: 'Practice Enrollment Screen'}} />
            <Stack.Screen name="PracticeSurvey" component={PracticeSurvey} />
            <Stack.Screen name="ViewPatients" component={viewPatients} options={{ title: 'View Patients'}}/>
            <Stack.Screen name="ProviderAccount" component={ProviderAccount} options={{title: 'Account'}} />
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
