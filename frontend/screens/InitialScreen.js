import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function InitialScreen({navigation}){
      return (
         <View>
            <Text style = {styles.title}>AllergyAlly</Text>
            <Text style = {styles.subtitle}>Manage your allergies from anywhere, at any time.</Text>
            <TouchableOpacity
                style = {styles.signUpButton}
                onPress={() =>
                    navigation.navigate('SignIn') }>
                <Text style = {styles.logInButtonText}>Sign In or Create an Account</Text>
            </TouchableOpacity>
            <View style={styles.section}>
                <Text>add info</Text>
                <Image style={{ width: "50%", height: "100%", marginTop: "60"}} source={require('./initialbackground.jpg')} />
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
        marginBottom: 15,
    },
    subtitle:{
        marginLeft: 30,
        marginBottom: 30,
        color: '#1059d5',
        fontSize: 20,
    },
    section: {
        backgroundColor: '#c7dafa',
        width: Dimensions.get('window').width,
        marginTop: 30,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    }
})