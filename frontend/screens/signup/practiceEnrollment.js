import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../../App.js'
import axios from 'axios';

export default function PatientSignUpScreen() {
  var success = true;
  const [display, setDisplay] = useState('');
  const [practiceName, setName] = useState('');
  const [providerNames, setProviderNames] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [allergyShotHours, setAllergyShotHours] = useState('');

  const handleEnrollment = async () => {

    setDisplay('')
    if (practiceName && providerNames && phoneNumber && email && officeHours && allergyShotHours) {
        try {
          const data = {
            practiceName,
            providerNames,
            phoneNumber,
            email,
            officeHours,
            allergyShotHours
          }

          const practiceExists = await axios.get(`http://localhost:5000/api/practiceByName/${practiceName}`);
          console.log(practiceExists.status);

          if (practiceExists.status === 201) {
            const response = await axios.post('http://localhost:5000/api/addPractice', data);
            console.log(response);
          }
          else if (practiceExists.status === 200) {
            setDisplay('This practice is already enrolled!');
            success = false;
            console.log(response);
          }

        }
        catch (error) {
          success = false;
          console.log(error, " Error");
        }
    }
    else {
      setDisplay('Please fill out all fields!');
      success = false;
    }
    if (success) {
      setDisplay('Practice successfully enrolled!');
      setTimeout(() => {
        navigation.navigate('SignIn');
        }, 1000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Ally</Text>

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Practice Name"
          placeholderTextColor="#7a7a7a"
          value={practiceName}
          autoCapitalize="none"
          onChangeText={setName} />

        {/* NEEDS TO BE UPDATED TO A MULTI INPUT*/}
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Provider Name"
          placeholderTextColor="#7a7a7a"
          value={providerNames}
          autoCapitalize="none"
          onChangeText={setProviderNames} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Email"
        placeholderTextColor="#7a7a7a"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Phone Number"
        placeholderTextColor="#7a7a7a"
        value={phoneNumber}
        autoCapitalize="none"
        onChangeText={setPhoneNumber}/>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Office Hours"
        placeholderTextColor="#7a7a7a"
        value={officeHours}
        autoCapitalize="none"
        onChangeText={setOfficeHours} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Allergy Shot Hours"
        placeholderTextColor="#7a7a7a"
        value={allergyShotHours}
        autoCapitalize="none"
        onChangeText={setAllergyShotHours} />

      <Text style={styles.message}>{display}</Text>
      <TouchableOpacity
        style={styles.logInButton}
        onPress={handleEnrollment}>
        <Text style={styles.logInButtonText}> Enroll Practice </Text>
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
    color: '#000000'
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