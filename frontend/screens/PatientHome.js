import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function PatientHome({navigation}){
      return (
         <ScrollView>
            <Text style = {styles.title}>Upcoming Walk-in Dates</Text>
            <Text style = {styles.subtitle}>Tap for more info</Text>
            <TouchableOpacity style = {styles.appointment}
            onPress={() =>
                navigation.navigate('Upcoming')
              }>
                <Text style={styles.appointmentText}>Monday 10/9/2023 - Friday 10/13/2023</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.appointment}>
                <Text style={styles.appointmentText}>Monday 10/9/2023 - Friday 10/13/2023</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.appointment}>
                <Text style={styles.appointmentText}>Monday 10/9/2023 - Friday 10/13/2023</Text>
            </TouchableOpacity>

            <Text style={styles.container}></Text>
            <Text style = {styles.title}>Past Appointment Dates</Text>
            <View style = {styles.appointmentAttended}>
                <Text style={styles.appointmentText}>Monday 9/25/2023</Text>
            </View>
            <View style = {styles.appointmentAdverse}>
                <Text style={styles.appointmentText}>Thursday 9/14/2023</Text>
            </View>
            <View style = {styles.appointmentAttended}>
                <Text style={styles.appointmentText}>Thursday 9/14/2023</Text>
            </View>
            <View style = {styles.appointmentAttended}>
                <Text style={styles.appointmentText}>Thursday 9/14/2023</Text>
                <Text style={styles.appointmentSubtext}>Thursday 9/14/2023</Text>
            </View>
         </ScrollView>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30
   },
   title :{
    paddingTop: 20,
    paddingBottom: 18,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    },
    subtitle :{
        paddingTop: 20,
        paddingBottom: 18,
        textAlign: 'center',
        fontSize: 14,
        },
    appointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 2,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#b3caf2',
        justifyContent: 'center',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    appointmentText: {
        fontSize: 17,
        marginBottom: 4,
        textDecorationLine: 'underline',
    },
    appointmentSubtext: {
        fontSize: 12,
    },
    appointmentAdverse: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 2,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f39aac',
        justifyContent: 'center',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    appointmentAttended: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 2,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#a7cf91',
        justifyContent: 'center',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
})
