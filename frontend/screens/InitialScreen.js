import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function InitialScreen({navigation}){
      return (
         <View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', }}>
                <View style={{ marginBottom: 200 }}>
                    <Text style = {styles.title}>AllergyAlly</Text>
                    <Text style = {styles.subtitle}>Manage your allergies from anywhere, at any time.</Text>
                    <Text style = {styles.description}>Keep track of appointments, calculate injection dosages, record data, and more with AllergyAlly.</Text>
                    <TouchableOpacity
                        style = {styles.signUpButton}
                        onPress={() =>
                        navigation.navigate('SignIn') }>
                        <Text style = {styles.logInButtonText}>Sign In or Create an Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginLeft: 25,}}>
                <IconButton
                    icon="doctor"
                    iconColor="#1059d5"
                    size={60}
                />
                <View>
                    <Text style = {styles.text}>As a Patient</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                </View>
                <View
                    style={{
                    marginLeft: 30,
                    borderLeftWidth: 2,
                    borderLeftColor: '#1059d5',
                    height: 200,
                    }}
                />
                <IconButton
                    icon="account-injury-outline"
                    iconColor="#1059d5"
                    size={60}
                />
                <View>
                    <Text style = {styles.text}>As a Patient</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                    <Text style = {styles.text2}>   • feature explanation</Text>
                </View>
                <Image style={{ width: "50%", height: "50%", marginLeft: 50}} source={require('./initialbackground.jpg')} />
            </View>
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
        marginLeft: 30,
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
        marginBottom: 12,
    },
    subtitle:{
        marginLeft: 30,
        marginBottom: 10,
        fontSize: 20,
    },
    description:{
        marginLeft: 30,
        fontSize: 15,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    text:{
        fontSize: 15,
        color: '#1059d5',
        marginTop: 12,
        fontWeight: 'bold',
    },
    text2:{
        fontSize: 15,
        color: '#1059d5',
        marginTop: 12,
    },
})