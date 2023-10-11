import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../App.js'
import axios from 'axios';


export default function PatientSignUpScreen() {

  const [display, setDisplay] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSignUp = async () => {
    setDisplay('')
    if (firstName && lastName && email && password && confirmPass) {
      if (password == confirmPass) {
        try {
          const data = {
            firstName,
            lastName,
            email,
            password
          }

          const emailExists = await axios.post('http://localhost:5000/api/getPatient', { email });

          if (emailExists.status === 200) {
            const response = await axios.post('http://localhost:5000/api/addPatient', data);
            console.log(response);
          }
          else if (emailExists.status === 201) {
            setDisplay('This email is already associated with an account!');
          }

        }
        catch (error) {
          console.log(error, " Error");
        }
      }
      else {
        setDisplay('Passwords do not match!');
      }
    }
    else {
      setDisplay('Please fill out all fields!')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Ally</Text>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="First Name"
          value={firstName}
          autoCapitalize="none"
          onChangeText={setFirstName} />

        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="Last Name"
          value={lastName}
          autoCapitalize="none"
          onChangeText={setLastName} />
      </View>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Password"
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
        secureTextEntry={true} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Confirm Password"
        value={confirmPass}
        autoCapitalize="none"
        onChangeText={setConfirmPass}
        secureTextEntry={true} />


      <Text style={styles.message}>{display}</Text>
      <TouchableOpacity
        style={styles.logInButton}
        onPress={handleSignUp}>
        <Text style={styles.logInButtonText}> Create Account </Text>
      </TouchableOpacity>

      <Text style = {styles.bottomText2}>Already have an account?</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <TouchableOpacity
               style = {styles.logInButton}
               onPress={() =>
                  navigation.navigate('SignInScreen') }>
               <Text style = {styles.logInButtonText}>Log in here!</Text>
            </TouchableOpacity>
            </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23
  },
  title: {
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
  shortInput: {
    margin: 15,
    flexGrow: 1,
    height: 40,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
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
  logInButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  bottomText: {
    color: '#1059d5',
    marginLeft: 15,
    marginBottom: 30,
    fontSize: 17,
    textAlign: 'center',
  },
  bottomText2: {
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