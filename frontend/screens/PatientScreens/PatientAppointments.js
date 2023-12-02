

import React, { Component, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import User from '../../User';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function PatientAppointments({navigation}){

    const userInfo = User();
    const email = userInfo.email;
    const firstName = userInfo.firstName;


    const [patient, setPatient] = useState();
    const [treatments, setTreatments] = useState();
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [futureAppointmentDeadline, setFutureAppointmentDeadline] = useState(null);

    //function that takes in a date from MongoDB and converts it into readable format
    //includes day of week
    function formatDateWithDay(mongoDate){

        const javascriptDate = new Date(mongoDate);
        const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
    
        return utcDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
    
        }


          //get the list of treatments associated with patient
  useEffect(() => {

    const findPatient = async () => {
      if (email){
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const patientObj = await axios.get(`http:///192.168.0.160:5000/api/findPatient/${email}`)
        setPatient(patientObj.data)
      }
    }
    if (!patient) {console.log("can't find patient"); findPatient(); }

    const findTreatments = async () => {
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const treatmentsObj = await axios.get(`http:///192.168.0.160:5000/api/getAllTreatmentsByID/${patient._id}`)
        
       

        //sort treatments by date
        const sortedTreatments = treatmentsObj.data.slice().sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
  
         // only return appointments attended / not future appointment deadline
      const attendedTreatments = sortedTreatments.filter(treatment => treatment.attended === true);
      setTreatments(attendedTreatments)

      const treatmentNotAttended = treatmentsObj.data.filter(treatment => treatment.attended === false);
        if (treatmentNotAttended.length === 1) {
          setFutureAppointmentDeadline(formatDateWithDay(treatmentNotAttended[0].date));
          console.log('Date of future appointment:', futureAppointmentDeadline);
        } else if (treatmentNotAttended.length > 1) {
          setFutureAppointmentDeadline("More than one future appointment found")
          throw new Error('More than one not attended appointment found.');
        } else {
          setFutureAppointmentDeadline("No appointment deadline found!")
          console.log('No appointments with attended = false found.');
        }
      
      

      }

    if (!treatments && patient) { findTreatments(); }

    if (patient && treatments) { setLoading(false) }


    

  })

  if (loading) {
    return <Text>Loading...</Text>
   }

    var msg = "";
    if (patient.missedAppointmentCount){
        //appointments attended on time over total appointments
        var compliance = ((treatments.length - patient.missedAppointmentCount)/treatments.length * 100).toFixed(1);
        if (compliance >= 80)
        msg = "Great job!";
      else if (compliance >= 60)
        msg = "Keep it up!";
      else
        msg = "Talk to your doctor about ways you can improve.";
    }    
    else {
        var compliance  = "-"
        msg = "No compliance rate available yet."   
    }
    
   


      return (

        <ScrollView style = {styles.container}>
        <Text style = {styles.welcome}>Welcome, {firstName}</Text>
        <TouchableOpacity style = {styles.card} onPress={() =>
            navigation.navigate('Progress')
          }>
        <Text style = {styles.title1}>You have been</Text>
        <Text style = {styles.complianceNum}>{compliance}%</Text>
        
        <Text style = {styles.title1}>compliant with your treatment schedule.</Text>
        <Text style = {styles.message}>{msg}</Text>
        
        
        </TouchableOpacity>
        <Text style = {styles.welcome}>Next appointment deadline:</Text>

        <TouchableOpacity style = {styles.appointment}
onPress={() =>
    navigation.navigate('Upcoming')
  }>
    <Text style={styles.appointmentText}>{futureAppointmentDeadline}</Text>
</TouchableOpacity>

<Image style={{ width: "150%", height: "20%", marginTop: 150, marginLeft: -85}} source={require('../AdPlaceholder.png')} />

    </ScrollView>

      )
   }

   const styles = StyleSheet.create({
    container: {
     flex: 1,
     padding: 16,
    },
    card: {
     alignItems: 'center',
     borderRadius: 8,
     //shadowOpacity: 0.1,
     //shadowOffset: {width: 2, height: 4},
     //shadowColor: 'black',
     //shadowOpacity: 0.05,
     //shadowRadius: 8,
     backgroundColor: 'white',
     marginTop: 18,
     marginBottom: 30,
     padding: 12,
 
 
    },
    welcome :{
     fontSize: 20,
     fontWeight: '600',
     alignSelf: 'center',
     color: '#0d3375'
     },
     title1 :{
     marginHorizontal: 8,
     marginVertical: 5,
     textAlign: 'center',
     fontSize: 18,
     fontWeight: '400',
     fontStyle: 'italic',
     color: '#3d3d3d'
     },
     message :{
         marginHorizontal: 8,
         marginVertical: 5,
         textAlign: 'center',
         fontSize: 18,
         fontWeight: '600',
         color: '#539CF5'
         },
     title2 :{
         marginBottom: 15,
         textAlign: 'center',
         fontSize: 20,
         fontWeight: '600',
     },
     compliance: {
         paddingTop: 10,
         marginBottom: -5,
         margin: 20,
         height: 120,
         width: 120,
         justifyContent: 'center',
         textAlignVertical: 'center',
         alignSelf: 'center',
         borderWidth: 1,
         borderColor: '#539CF5',
         borderRadius: 60,
         backgroundColor: '#539CF5'
     },
     complianceNum: {
         //alignSelf: 'center',
         textAlign: 'center',
         fontSize: 32,
         fontWeight: '600',
         color: '#539CF5',
         margin: 10
 
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
         //marginLeft: 15,
         marginVertical: 8,
         height: 60,
         borderRadius: 8,
         backgroundColor: '#84aef8',
         justifyContent: 'center',
         paddingHorizontal: 20,
         textstyle:{fontsize: 60}
     },
     appointmentText: {
         fontSize: 24,
         marginVertical: 4,
         fontWeight: '500',
         color: 'white',
         textAlign: 'center'
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


