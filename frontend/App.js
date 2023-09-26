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


const Stack = createNativeStackNavigator();

export default function App({navigation}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const getUserToken = async () => {
    // testing purposes
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      // custom logic
      await sleep(2000);
      const token = null;
      setUserToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getUserToken();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <LoadingScreen />;
  }


  return (
    <NavigationContainer>
    <Stack.Navigator
      screenOptions={() => ({
        headerTitleStyle: styles.headerTitleStyle,
        headerStyle: { backgroundColor: '#1059d5'},
        headerTintColor: 'white'
      })}>
         {userToken == null ? (
          // No token found, user isn't signed in
          <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Sign in',
            }}
            initialParams={{ setUserToken }}
          />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
          
        ) : (
          // User is signed in
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Alerts" component={Alerts} />
          <Stack.Screen name="Portal" component={Portal} />
          <Stack.Screen name="AllAlerts" component={AllAlerts} options={{title: 'All Alerts'}}/>
          <Stack.Screen name="Reports" component={Reports}/>
          </>
          
        )}
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
  root: {
    flex: 1,
  }
});
