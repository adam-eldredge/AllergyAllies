import React, { useContext, Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import AuthContext from '../AuthContext';
import jwt_decode from 'jwt-decode';

export default function Portal({navigation}){

   const { signOut } = useContext(AuthContext);
   const authContext = useContext(AuthContext);
   const decodedToken = jwt_decode(authContext.userToken);
   const role = decodedToken.UserInfo.role;
   const firstName = decodedToken.UserInfo.firstName;

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
      <View style = {styles.container}>
      <Text style={styles.header}>Welcome, {firstName}</Text>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 22}}>
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
         <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            navigation.navigate('Reports')
         }>
            <Text style={styles.menuItemText}>Reports</Text>
            <IconButton
               icon="newspaper-check"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>View Patients</Text>
            <IconButton
               icon="face-man-shimmer-outline"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}>
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
   )
}

const styles = StyleSheet.create({
   header:{
      color: '#606060',
      marginLeft: 15,
      fontSize: 25,
      textAlign: 'center',
      fontWeight: '600'
   },
   container: {
      paddingTop: 23
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
})
