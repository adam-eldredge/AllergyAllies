import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView, Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Portal from './screens/Portal.js';
import AllAlerts from './screens/AllAlerts.js';
import Reports from './screens/Reports.js';
import Injections from './screens/Injections.js';
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
import ViewPatients from './screens/ViewPatients.js';
import ViewAllAppointments from './screens/ViewAllAppointments.js';
import { useMemo, useReducer, useEffect } from 'react';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import PatientAppointments from './screens/PatientAppointments.js';
import InitialMobileScreen from './screens/InitialMobileScreen.js'
import InjectionInfo from './screens/InjectionInfo.js';
//import AppointmentInfo from './screens/AppointmentInfo';

// Secure store doesn't work on web, only iOS and android ^

const Stack = createNativeStackNavigator();



const InitialMobileStack = (
  <>
  <Stack.Screen
      name="InitialMobileScreen"
      component={InitialMobileScreen}
      options={{
        title: 'InitialMobileScreen',
        headerTitleAlign: 'center',
        headerShown: false,
        headerBackTitleVisible: false,
        headerTitleStyle: { textAlign: 'center' },
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        title: 'Sign In',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        headerBackTitleVisible: false,
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
              name="PatientSignUpScreen"
              component={PatientSignUpScreen}
              options={{
                title: 'Patient Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    <Stack.Screen
              name="ProviderSignUpScreen"
              component={ProviderSignUpScreen}
              options={{
                title: 'Provider Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    <Stack.Screen
              name="PracticeEnrollment"
              component={practiceEnrollment}
              options={{
                title: 'Practice Enrollment',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    {/* Add other mobile-specific screens here */}
  </>
);

const InitialDesktopStack = (
  <>
    <Stack.Screen
      name="InitialScreen"
      component={InitialScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        headerShown: false
      }}
    />
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        title: 'Sign In',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
              name="PatientSignUpScreen"
              component={PatientSignUpScreen}
              options={{
                title: 'Patient Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="ProviderSignUpScreen"
              component={ProviderSignUpScreen}
              options={{
                title: 'Provider Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="PracticeEnrollment"
              component={practiceEnrollment}
              options={{
                title: 'Practice Enrollment',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    {/* Add other desktop-specific screens here */}
  </>
);


const SignedInMobileStack = (
  <>
      <Stack.Screen name="PatientHome" component={PatientHome} options={{title: 'AllergyAlly'}} />
      <Stack.Screen name="Upcoming" component={Upcoming} options={{title: 'Upcoming Appointment'}} />
      <Stack.Screen name="UpcomingInfo" component={UpcomingInfo} options={{title: 'Additional Info'}} />
      <Stack.Screen name="PatientSignUpScreen" component={PatientSignUpScreen} options={{title: 'Patient Sign Up'}} />
      <Stack.Screen name= "ViewAllAppointments" component={ViewAllAppointments} options={{title: 'AllergyAlly', headerBackTitleVisible: false, animationTypeForReplace: 'push'}} />
      <Stack.Screen name="InjectionInfo" component={InjectionInfo} options={{title: 'Injection Info'}} />
     
  </>
);


const SignedInDesktopStack = (
  <>
      <Stack.Screen name="Portal" component={Portal} />
      <Stack.Screen name="AllAlerts" component={AllAlerts} options={{title: 'All Alerts'}}/>
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="PatientHome" component={PatientHome} options={{title: 'Allergy Ally'}} />
      <Stack.Screen name="Upcoming" component={Upcoming} options={{title: 'Upcoming Appointment'}} />
      <Stack.Screen name="UpcomingInfo" component={UpcomingInfo} options={{title: 'Additional Info'}} />
      <Stack.Screen name="PatientSignUpScreen" component={PatientSignUpScreen} options={{title: 'Patient Sign Up'}} />
      <Stack.Screen name="ProviderSignUpScreen" component={ProviderSignUpScreen} options={{title: 'Provider Sign Up'}} />
      <Stack.Screen name="PracticeEnrollmentScreen" component={practiceEnrollment} options={{ title: 'Practice Enrollment Screen'}} />
      <Stack.Screen name="PracticeSurvey" component={PracticeSurvey} />
      <Stack.Screen name="ViewPatients" component={ViewPatients} options={{ title: 'View Patients'}}/>
      <Stack.Screen name="ProviderAccount" component={ProviderAccount} options={{title: 'Account'}} />
      <Stack.Screen name="Injections" component={Injections} options={{title: 'Injections'}} />
  </>
);


//PatientHome: the bottom tab navigation bar
//PatientAppointments: the patient home screen

export default function App({navigation}) {

  const isDesktop = Platform.OS === 'web';
  
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
            isDesktop ? InitialDesktopStack : InitialMobileStack
          ) : (
            // User is signed in
            isDesktop ? SignedInDesktopStack : SignedInMobileStack
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
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    flex: 1,
  },
  root: {
    flex: 1,
  }
});
