import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function Upcoming({navigation}){
      return (
         <ScrollView>
            <View style = {styles.header}>
                <Text style={styles.headerText}>Monday 10/9/2023 - Friday 10/13/2023</Text>
            </View>
            <Card style = {styles.alert}>
               <Card.Title subtitleStyle={{fontWeight:"bold", fontSize:20}}
                  subtitle="8:00am - 5:00pm"
                  left={(props) => <IconButton
                     icon="clock"
                     iconColor="#1059d5"
                     size={30}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title subtitleStyle={{fontWeight:"bold", fontSize:20}}
                  subtitle="ENT Specialists of Nashville"
                  left={(props) => <IconButton
                     icon="map"
                     iconColor="#1059d5"
                     size={30}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title subtitleStyle={{fontWeight:"bold", fontSize:20}}
                  subtitle="Dr. Mark Williams"
                  left={(props) => <IconButton
                     icon="doctor"
                     iconColor="#1059d5"
                     size={30}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title subtitleStyle={{fontWeight:"bold", fontSize:20}}
                  subtitle="Dosage: XX.00mg"
                  left={(props) => <IconButton
                     icon="needle"
                     iconColor="#1059d5"
                     size={30}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title subtitleStyle={{fontWeight:"bold", fontSize:20}}
                  subtitle="Additional Info"
                  left={(props) => <IconButton
                     icon="question"
                     iconColor="#1059d5"
                     size={30}
                   />}
               />
            </Card>
         </ScrollView>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30
   },
   header: {
        marginTop: 30,
        width: Dimensions.get('window').width - 30,
        marginBottom: 2,
        height: 80,
        backgroundColor: '#1059d5',
        justifyContent: 'center',
        textstyle:{fontsize: 80},
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 18,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
    },
    alert: {
        width: Dimensions.get('window').width - 30,
        marginTop: 15,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: 'center',
     },
})
