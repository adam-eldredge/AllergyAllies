import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function InitialScreen({navigation}){
      return (
         <View>
            <View View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 22}}>
                <Text style = {styles.title}>AllergyAlly</Text>
                <TouchableOpacity
                style = {styles.signUpButton}
                onPress={() =>
                    navigation.navigate('SignIn') }>
                <Text style = {styles.logInButtonText}>Sign In or Create an Account</Text>
                </TouchableOpacity>
            </View>
            <Text style = {styles.subtitle}>Manage your allergies from anywhere.</Text>
         </View>
      )
   }

const styles = StyleSheet.create({
   signUpButton: {
        height: 40,
        width: 220,
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 2,
        marginLeft: 640,
        borderWidth: 1,
        borderColor: '#1059d5',
    },
    logInButtonText:{
        color: '#1059d5',
        textAlign: 'center',
        fontSize: 15,
    },
    title:{
        marginLeft: 30,
        color: '#1059d5',
        fontSize: 60,
        fontWeight: '600',
        marginBottom: 15,
    },
    subtitle:{
        marginLeft: 30,
        color: '#1059d5',
        fontSize: 20,
    },
})
