import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ImageBackground, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function InitialMobileScreen({navigation}){
      return (

<View style={styles.container}>
      <View style={styles.content}>
      <IconButton
                        icon="flower-pollen"
                        iconColor="white"
                        size={60}
                        style={{marginTop: -40}}
                        />
        <Text style={styles.appName}>AllergyAlly</Text>
        <Text style={styles.description}>
          Manage your allergies from anywhere, at any time.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
      style = {styles.signUpButton}
      onPress={() =>
      navigation.navigate('SignIn') }>
      <Text style = {styles.logInButtonText}>Sign In or Create an Account</Text>
    </TouchableOpacity>
      </View>
    </View>
      )
   }

   const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1059d5', // Blue background color
      },
      appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
      },
      description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
      },
    signUpButton: {
        //justifyContent: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        margin: 4,
        justifyContent: 'flex-end',
        //alignItems: 'center',
        shadowColor: '#041f4f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    logInButtonText:{
        color: '#1059d5',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    content: {
        marginTop: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonContainer: {
        marginBottom: 50,
      },
  });