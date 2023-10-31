import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function AllAlerts({navigation}){
   return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fcfcfc'}}>
      <View style={{backgroundColor: '#fcfcfc', flex: 1}}>
      <TouchableOpacity style={{marginTop: 50, marginBottom: 10, backgroundColor: '#dc6c82', height: 30, width: 100, borderRadius: 5, flexDirection: 'row', alignItems: 'center'}}
               onPress={() =>
                  signOut()
               }>
                <Text style={{color: 'white', size: 5, marginRight: -10, marginLeft: 12, fontWeight: 500}}>Sign out</Text>
                  <IconButton
                     icon="exit-to-app"
                     iconColor="white"
                     size={14}
                  />
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3', marginTop: 15}}
               onPress={() =>
                  navigation.navigate('Reports')
               }>
               <Text style={{...styles.providerDashboardText, fontSize: 12, marginBottom: -15}}>My Patients</Text>
               <IconButton
                  icon="account-heart"
                  iconColor="white"
                  size={37}
               />
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#937fd0'}}
               onPress={() =>
                  navigation.navigate('PracticeSurvey')
               }>
               <Text style={{...styles.providerDashboardText, fontSize: 12}}>View/Edit</Text>
               <Text style={{...styles.providerDashboardText, fontSize: 12, marginTop: 10, marginBottom: -15}}>Practice Info</Text>
               <IconButton
                  icon="pencil"
                  iconColor="white"
                  size={37}
               />
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#7fd0ae'}}
               onPress={() =>
                  navigation.navigate('Reports')
               }>
                  <Text style={styles.providerDashboardText}>Reports</Text>
                  <IconButton
                     icon="file-chart"
                     iconColor="white"
                     size={37}
                  />
               </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#6e85f4'}}
            onPress={() =>
              navigation.navigate('AllAlerts')
             }>
               <Text style={styles.providerDashboardText}>Alerts</Text>
              <IconButton
                icon="bell-ring"
                iconColor="white"
                size={37}
              />
            </TouchableOpacity>
      </View>
      </View>
   )
}

const styles = StyleSheet.create({
   title: {
      fontSize: 40,
      marginTop: 40,
      fontWeight: '600',
      marginLeft: 100,
      color: '#1059d5',
   },
   alert: {
      width: 800,
      height: 70,
      marginLeft: 100,
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: 'white',
      marginBottom: 5,
   },
   providerDashboardItem:{
      borderRadius: 8,
      height: 100,
      width: 100,
      marginBottom: 10,
      alignItems: 'center',
   },
   providerDashboardText:{
      color: 'white',
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: -10,
   },
})
