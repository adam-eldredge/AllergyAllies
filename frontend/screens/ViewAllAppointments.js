import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function ViewAllAppointments({navigation}){
   return (
    <ScrollView style = {styles.container}>
    <Text style = {styles.title2}>Past Appointments Attended</Text>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Monday 9/25/2023</Text>
        <View style={styles.flags}>
            <View style={styles.onTime}>
            <Text style={{color: 'white'}}> Attended on Time </Text>
            </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.attendedLate}>
            <Text style={{color: 'white'}}> 12 Days Late - Dose Adjustment </Text>
        </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
            <View style={styles.onTime}>
            <Text style={{color: 'white'}}> Attended on Time </Text>
            </View>
            <View style={styles.adverseReaction}>
            <Text style={{color: 'white'}}> Adverse Reaction </Text>
            </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.flags}>
            <View style={styles.onTime}>
            <Text style={{color: 'white'}}> Attended on Time </Text>
            </View>
        </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.onTime}>
        <Text style={{color: 'white'}}> Attended on Time </Text>
        </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.attendedLate}>
            <Text style={{color: 'white'}}> 2 Days Late </Text>
        </View>
        <View style={styles.adverseReaction}>
            <Text style={{color: 'white'}}> Adverse Reaction </Text>
            </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.onTime}>
        <Text style={{color: 'white'}}> Attended on Time </Text>
        </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.onTime}>
        <Text style={{color: 'white'}}> Attended on Time </Text>
        </View>
        </View>
    </View>
    <View style = {styles.pastAppointment}>
        <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
        <View style={styles.flags}>
        <View style={styles.onTime}>
        <Text style={{color: 'white'}}> Attended on Time </Text>
        </View>
        </View>
    </View>
    <Text>   </Text>
    <Text>  </Text>
    <Text>  </Text>
    <Text>  </Text>
    </ScrollView>
   )
}



const styles = StyleSheet.create({
    container: {
       paddingTop: 20,
    },

     title2 :{
         fontSize: 20,
         fontWeight: 'bold',
         color: '#424242',
         marginBottom: 4,
         alignSelf: 'center'
     },
    
     appointment: {
         width: Dimensions.get('window').width - 30,
         marginLeft: 15,
         marginBottom: 8,
         height: 60,
         borderRadius: 8,
         backgroundColor: '#84aef8',
         justifyContent: 'center',
         paddingHorizontal: 20,
         textstyle:{fontsize: 60}
     },
 
     pastAppointmentText: {
         fontSize: 17,
         marginBottom: 4,
         fontWeight: '500',
         marginTop: 12,
     },
     pastAppointment: {
         margin: 10,
         marginHorizontal: 22,
         marginBottom: 10,
         borderRadius: 12,
         backgroundColor: '#d1ddf2',
         paddingLeft: 20,
         paddingBottom: 8,
         textstyle:{fontsize: 60},
         shadowColor: 'black',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.3,
         shadowRadius: 2,
     },
     
     flags: {
         flex: 1,
         flexDirection: 'row',
         flexWrap: 'wrap',
         alignItems: 'center',
         borderRadius: 20,
     },
     onTime: {
         borderRadius: 8, 
         backgroundColor: '#5ba863',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     adverseReaction: {
         borderRadius: 8, 
         backgroundColor: '#e55555',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     attendedLate: {
         borderRadius: 8, 
         backgroundColor: '#ff955c',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     flagText: {
         backgroundColor: 'red',
         color: 'white',
     }
 })
 
 
 
 
 