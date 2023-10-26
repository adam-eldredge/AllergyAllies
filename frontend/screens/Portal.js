import React, { useContext, Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import AuthContext from '../AuthContext';
import jwt_decode from 'jwt-decode';
import User from '../User';

export default function Portal({navigation}){

   const { signOut } = useContext(AuthContext);
   const userInfo = User();
   const role = userInfo.role;
   const firstName = userInfo.firstName;

   return role == 2 ? (
      // PATIENT PORTAL
      <View style = {styles.container}>
      <Text style={styles.header}>Welcome, {firstName}</Text>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 22}}>
      <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            navigation.navigate('PatientHome')
         }>
            <Text style={styles.menuItemText}>Appointments</Text>
            <IconButton
               icon="calendar-month"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            navigation.navigate('Alerts')
         }>
            <Text style={styles.menuItemText}>Alerts</Text>
            <IconButton
               icon="alert"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Report a Reaction</Text>
            <IconButton
               icon="exclamation-thick"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}onPress={() =>
            navigation.navigate('PracticeSurvey')
         }>
            <Text style={styles.menuItemText}>Edit Survey Responses</Text>
            <IconButton
               icon="pencil"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            signOut()
         }>
            <Text style={styles.menuItemText}>Sign Out</Text>
            <IconButton
               icon="exit-to-app"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
      </View>
      </View>
   ) : (
      // PROVIDER PORTAL
      <View style = {styles.container2}>
         <Text style={styles.header2}>Welcome, {firstName}!</Text>
         <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap',}}>
            <View style={{marginLeft: 100, marginRight: 170}}>
               <Text style={{fontSize: 18, marginBottom: 10, fontWeight: '500'}}>Your Alerts:</Text>
               <Card style = {styles.alertCard}>
                  <Card.Title titleStyle={styles.alertText}
                     title="Patient Bob is at risk for attrition."
                     subtitle="9/17/2023"
                  />
               </Card>
               <Card style = {styles.alertCard}>
                  <Card.Title titleStyle={styles.alertText}
                     title="Patient Rob’s injections are expiring or will soon need to be mixed"
                     subtitle="9/17/2023"
                  />
               </Card>
               <Card style = {styles.alertCard}>
                  <Card.Title titleStyle={styles.alertText}
                     title="Patient Lisa’s injections are expiring or will soon need to be mixed"
                     subtitle="9/16/2023"
                  />
               </Card>
               <TouchableOpacity
               onPress={() =>
                  navigation.navigate('AllAlerts')}>
                  <Text style = {{textDecorationLine: 'underline', color: '#1059d5', fontSize: 15, marginTop: 10, fontWeight: 'bold',}}>View All Alerts</Text>
               </TouchableOpacity>
            </View>
            <View style = {{marginRight: 40}}>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3'}}
                  onPress={() =>
                     navigation.navigate('ViewPatients')
                  }>
                  <Text style={{...styles.providerDashboardText}}>My Patients</Text>
                  <IconButton
                     icon="account-heart"
                     iconColor="white"
                     size={60}
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
                     size={60}
                  />
               </TouchableOpacity>
            </View>
            <View style = {{marginBottom: 20}}>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#937fd0'}}
                  onPress={() =>
                     navigation.navigate('PracticeSurvey')
                  }>
                  <Text style={{...styles.providerDashboardText, fontSize: 16,}}>View/Edit Practice Info</Text>
                  <IconButton
                     icon="pencil"
                     iconColor="white"
                     size={60}
                  />
               </TouchableOpacity>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#d07f99'}}
               onPress={() =>
                  signOut()
               }>
                  <Text style={styles.providerDashboardText}>Sign out</Text>
                  <IconButton
                     icon="exit-to-app"
                     iconColor="white"
                     size={60}
                  />
               </TouchableOpacity>
            </View>
         </View>
         <View style={{height: 23, backgroundColor: '#1059d5'}}></View>
      </View>
   )
}

const styles = StyleSheet.create({
   header:{
      color: '#606060',
      marginBottom: 15,
      fontSize: 25,
      textAlign: 'center',
      fontWeight: '600',
      marginTop: 10,
   },
   header2:{
      marginBottom: 20,
      fontSize: 50,
      fontWeight: '600',
      marginTop: 20,
      marginLeft: 100,
      color: '#1059d5',
   },
   container: {
      paddingTop: 23
   },
   container2: {
      paddingTop: 23,
      backgroundColor: 'white'
   },
   menuItem: {
      padding: 10,
      margin: 15,
      height: 150,
      width: 150,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 3,
      backgroundColor: '#d1ddf2',
      borderColor: '#1059d5',
   },
   menuItemText:{
      color: '#1059d5',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
   },
   providerDashboardItem:{
      borderRadius: 20,
      height: 150,
      width: 200,
      marginBottom: 30,
      alignItems: 'center'
   },
   providerDashboardText:{
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      marginTop: 20,
   },
   alertCard: {
      width: 400,
      height: 70,
      borderRadius: 8,
      backgroundColor: 'white',
      marginBottom: 10,
   },
   alertText: {
      fontSize: 15,
      fontWeight: '600',
   },
   spacer: {
      width: 300
   }
})