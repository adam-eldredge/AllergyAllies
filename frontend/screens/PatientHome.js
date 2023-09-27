import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function PatientHome({navigation}){
      return (
         <ScrollView>
            <Text style = {styles.title1}>Next Appointment Deadline:</Text>
            <Text style = {styles.subtitle}>Tap on the day for more info</Text>
            <TouchableOpacity style = {styles.appointment}
            onPress={() =>
                navigation.navigate('Upcoming')
              }>
                <Text style={styles.appointmentText}>Monday 10/9/2023</Text>
            </TouchableOpacity>

            <Text style={styles.container}></Text>
            <Text style = {styles.title2}>Past Appointments Attended:</Text>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Monday 9/25/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#e66624', marginRight: 10}}> 12 Days Late - Dose Adjustment </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
                    <Text style={{color: 'white', backgroundColor:'#e55555', marginRight: 10}}> Adverse Reaction </Text>
                </View>
            </View>
            <View style = {styles.pastAppointment}>
                <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
                <View style={styles.flags}>
                    <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
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
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
    },
    subtitle :{
        paddingBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: '#8b8b8b',
        fontStyle: 'italic',
    },
    appointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 8,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#84aef8',
        justifyContent: 'center',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    appointmentText: {
        fontSize: 18,
        marginBottom: 4,
        fontWeight: '500',
        color: 'white',
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
