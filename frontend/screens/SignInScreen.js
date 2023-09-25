import * as React from 'react';
import {Text, TextInput, View, TouchableOpacity, Button, ActivityIndicator, StyleSheet,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function SignInScreen({navigation, route}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setUserToken } = route.params;

  return (
    <View style = {styles.container}>
    <Text style = {styles.title}>Allergy Ally</Text>
       <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               autoCapitalize = "none"
               onChangeText = {setEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               autoCapitalize = "none"
               onChangeText = {setPassword}
               secureTextEntry={true}/>

            <TouchableOpacity
               style = {styles.logInButton}
               onPress={() => setUserToken('token')}>
               <Text style = {styles.logInButtonText}> Log In </Text>
            </TouchableOpacity>

      <Text style = {styles.bottomText2}>Don't have an account yet?</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <TouchableOpacity
               style = {styles.signUpButton}>
               <Text style = {styles.logInButtonText}>I am a patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.signUpButton}>
               <Text style = {styles.logInButtonText}>I am a practice</Text>
            </TouchableOpacity>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     paddingTop: 23
  },
  title :{
     textAlign: 'center',
     fontSize: 20,
     fontWeight: 'bold',
     color: '#1059d5',
  },
  input: {
     margin: 15,
     height: 40,
     borderColor: '#1059d5',
     borderWidth: 1,
     padding: 10
  },
  logInButton: {
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 15,
     height: 40,
     justifyContent: 'center',
     borderRadius: 8,
  },
  logInButtonText:{
     color: 'white',
     textAlign: 'center',
     fontSize: 15,
  },
  bottomText:{
     color: '#1059d5',
     marginLeft: 15,
     marginBottom: 30,
     fontSize: 17,
     textAlign: 'center',
  },
  bottomText2:{
     color: '#606060',
     marginLeft: 15,
     fontSize: 17,
     textAlign: 'center',
     fontWeight: '600'
  },
  signUpButton: {
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 10,
     height: 40,
     width: 150,
     justifyContent: 'center',
     borderRadius: 8,
  },
})
