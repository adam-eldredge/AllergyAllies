import React, { useContext, useState } from 'react';
import { Dimensions, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AuthContext from '../AuthContext';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignInScreen({navigation}) {
  const { signIn } = useContext(AuthContext);
  const [display, setDisplay] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
   setDisplay('Loading...');
    if (email && password) {
      try {
         const authData = {
            email,
            password
         };
         
         // this needs to have your ip address for android (probably iOS too). 
         // get ip quickly from "Metro waiting on exp://<ip>:port"
         const response = await axios.post('http://localhost:5000/auth/', authData);
         console.log(response);
         // response successful
         if (response.status === 200) {
            const userToken = response.data.accessToken;
            const decodedToken = jwt_decode(userToken);
  
            await AsyncStorage.setItem('userToken', userToken);
            // data from token
            // const userEmail = decodedToken.UserInfo.email;
            // console.log(userEmail)
            signIn(userToken);
         } else {
            console.log("Error with response ", response.status);
         }

      } catch (error) {
         setDisplay(error.response.data.message);
         console.log(error, " Error"); 
      }
    }
    else {
      setDisplay('All fields required!');
    }
  };

  return (
    <View style = {styles.container}>
    <Text style = {styles.title}>Allergy Ally</Text>
       <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               value = {email}
               autoCapitalize = "none"
               onChangeText = {setEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               value = {password}
               autoCapitalize = "none"
               onChangeText = {setPassword}
               secureTextEntry={true}/>

            <Text style = {styles.message}>{display}</Text>
            <TouchableOpacity
               style = {styles.logInButton}
               onPress={handleSignIn}>
               <Text style = {styles.logInButtonText}> Log In </Text>
            </TouchableOpacity>

      <Text style = {styles.bottomText2}>Don't have an account yet?</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <TouchableOpacity
               style = {styles.signUpButton}
               onPress={() =>
                  navigation.navigate('PatientSignUpScreen') }>
               <Text style = {styles.logInButtonText}>I am a patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.signUpButton}
               onPress={() =>
                  navigation.navigate('ProviderSignUpScreen') }>
               <Text style = {styles.logInButtonText}>I am a practice</Text>
            </TouchableOpacity>
            </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
     paddingTop: 23, 
     alignItems: height > width ? null : 'center',
     justifyContent: height > width ? null : 'center',
     flex: 1
  },
  title :{
     textAlign: 'center',
     fontSize: 20,
     fontWeight: 'bold',
     color: '#1059d5',
  },
  message: {
      textAlign: 'center',
      fontSize: 12,
      color: '#DC143C',
  },
  input: {
     margin: 15,
     height: 40,
     width: height > width ? null : 300,
     borderColor: '#1059d5',
     borderWidth: 1,
     padding: 10
  },
  logInButton: {
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 15,
     height: 40,
     width: height > width ? null : 300,
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
