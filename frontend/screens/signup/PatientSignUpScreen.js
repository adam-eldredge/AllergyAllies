import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../../App.js'
import axios from 'axios';

export default function PatientSignUpScreen() {
  var success = true;
  const [display, setDisplay] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [practiceCode, setPracticeCode] = useState('');
  const [pracID, setPracID] = useState('');

  const handleSignUp = async () => {

    setDisplay('')
    if (firstName && lastName && email && password && confirmPass) {

      const practice = await axios.get(`http://localhost:5000/api/practiceByCode/${practiceCode}`);

      const practiceID = practice.data._id;
      setPracID(practiceID)
      if (!practiceID) {
        setDisplay('Invalid Practice ID');
        success = false;
        return;
      }

      if (password == confirmPass) {
        try {
          const data = {
            firstName,
            lastName,
            email,
            password,
            practiceID
          }

          const emailExists = await axios.post('http://localhost:5000/api/checkEmail', { email });

          if (emailExists.status === 200) {
            const response = await axios.post('http://localhost:5000/api/addPatient', data);
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
      setDisplay('Please fill out all fields!');
      success = false;
    }
    if (success) {
      // Add initial blank treatment to account to be used in calculations
      const patient = await axios.get(`http://localhost:5000/api/findPatient/${email}`)
      const pID = patient.data._id

      console.log(pID)

      const toAdd = {
        patientLastName: lastName,
        patientFirstName: firstName,
        patientID: pID,
        date: new Date(),
        practiceID: pracID
      }

      const addingTreatment = await axios.post(`http://localhost:5000/api/addTreatment`, toAdd)



      setDisplay('Account successfully created! Returning to sign in screen...');
      // setTimeout(() => {
      //   navigation.navigate('SignIn');
      // }, 1000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Ally</Text>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
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
        placeholder="Practice Code"
        placeholderTextColor="#7a7a7a"
        value={practiceCode}
        autoCapitalize="none"
        onChangeText={setPracticeCode} />

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
    flexGrow: 1,
    height: 40,
    width: height > width ? null : 136,
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
    width: height > width ? null : 300,
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