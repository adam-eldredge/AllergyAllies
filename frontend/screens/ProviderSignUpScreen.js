import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../App.js'
import axios from 'axios';


export default function ProviderSignUpScreen() {
  var success = true;
  const [display, setDisplay] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [NPI, setNPI] = useState('');
  const [nameOfPractice, setNameOfPractice] = useState('');

  const handleSignUp = async () => {
    setDisplay('')
    if (firstName && lastName && email && password && confirmPass && NPI && nameOfPractice) {
      if (password == confirmPass) {
        try {
          const data = {
            firstName,
            lastName,
            email,
            password,
            NPI,
            nameOfPractice
          }

        // Used to check if provider has a valid NPI, WIP
        //   const NPIreigstryURI = `https://npiregistry.cms.hhs.gov/api/?number=${NPI}&pretty=&version=2.1`
        //   const NPIexists = await axios.get(NPIreigstryURI);
        //   console.log(NPIexists.data);


          const emailExists = await axios.post('http://localhost:5000/api/getProvider', { email });

          if (emailExists.status === 200) {
            const response = await axios.post('http://localhost:5000/api/addProvider', data);
            console.log(response);
          }
          else if (emailExists.status === 201) {
            setDisplay('This email is already associated with an account!');
            success = false;
          }

        }
        catch (error) {
          success = false;
          console.log(error, " Error");
        }
      }
      else {
        setDisplay('Passwords do not match!');
        success = false;
      }
    }
    else {
      setDisplay('Please fill out all fields!')
      success = false;
    }
    if (success) {
      setDisplay('Account successfully created! Returning to sign in screen...');
      setTimeout(() => {
        navigation.navigate('SignIn');
        }, 3000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Ally</Text>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="First Name"
          placeholderTextColor="#7a7a7a"
          value={firstName}
          autoCapitalize="none"
          onChangeText={setFirstName} />

        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="Last Name"
          placeholderTextColor="#7a7a7a"
          value={lastName}
          autoCapitalize="none"
          onChangeText={setLastName} />
      </View>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Email"
        placeholderTextColor="#7a7a7a"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail} />

    <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="National Provider Identifier"
        placeholderTextColor="#7a7a7a"
        value={NPI}
        autoCapitalize="none"
        onChangeText={setNPI}/>

    {/*TODO Will update to Drop Down option of all practices */}

    <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Name of Practice"
        placeholderTextColor="#7a7a7a"
        value={nameOfPractice}
        autoCapitalize="none"
        onChangeText={setNameOfPractice}/>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Password"
        placeholderTextColor="#7a7a7a"
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
        secureTextEntry={true} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Confirm Password"
        placeholderTextColor="#7a7a7a"
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

    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    alignItems: height > width ? null : 'center',
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
    width: height > width ? null : 136,
    flexGrow: 1,
    height: 40,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
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