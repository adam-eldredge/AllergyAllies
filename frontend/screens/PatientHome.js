import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function PatientHome({navigation}){
      return (
         <ScrollView>
            <Text style = {styles.title1}>Upcoming Walk-in Dates</Text>
            <Text style = {styles.subtitle}>Tap on a time range for more info:</Text>
            <TouchableOpacity style = {styles.appointment}
            onPress={() =>
                navigation.navigate('Upcoming')
              }>
                <Text style={styles.appointmentText}>Monday 10/9/2023 - Friday 10/13/2023</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.appointment}
            onPress={() =>
                navigation.navigate('Upcoming')
              }>
                <Text style={styles.appointmentText}>Monday 10/16/2023 - Friday 10/20/2023</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.appointment}
            onPress={() =>
                navigation.navigate('Upcoming')
              }>
                <Text style={styles.appointmentText}>Monday 10/30/2023 - Friday 11/03/2023</Text>
            </TouchableOpacity>

            <Text style={styles.container}></Text>
            <Text style = {styles.title2}>Past Appointment Dates</Text>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Monday 9/25/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#e55555', marginRight: 10}}> Missed </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended </Text>
                    <Text style={{color: 'white', backgroundColor:'#e66624', marginRight: 10}}> Adverse Reaction </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended </Text>
                </View>
            </View>
         </ScrollView>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30
   },
    title1 :{
    paddingTop: 20,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    },
    title2 :{
        paddingTop: 20,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
    },
    subtitle :{
        paddingBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: '#545454',
        fontStyle: 'italic',
    },
    appointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 8,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#d1ddf2',
        justifyContent: 'center',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    appointmentText: {
        fontSize: 17,
        marginBottom: 4,
        fontWeight: '500',
    },
    pastAppointmentText: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: '500',
        marginTop: 12,
    },
    pastAppointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 10,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#d1ddf2',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    flags: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        //marginTop: 10,
    },
    flagText: {
        backgroundColor: 'red',
        color: 'white',
    },
})
