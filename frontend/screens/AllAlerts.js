import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import AuthContext from '../AuthContext';
import {formatDate, alertMessage, fetchRecentAlerts} from '../utils/alertUtils';
import User from '../User';
import axios from 'axios';

export default function AllAlerts({navigation}){
   const { signOut } = useContext(AuthContext);
   const userInfo = User();
   const [recentAlerts, setRecentAlerts] = useState([]);

   useEffect(() => {
      const fetchAlerts = async () => {
         const alerts = await fetchRecentAlerts(userInfo.id);
         setRecentAlerts(alerts);
      }

      fetchAlerts();
   }, []);

   const removeAlert = async (alertToDelete) => {
      try {
        // Optimistically update the local state
        const updatedAlerts = recentAlerts.filter((alert) => alert._id !== alertToDelete._id);
        setRecentAlerts(updatedAlerts);
    
        // Make the API call to delete the alert
        await axios.delete(`http://localhost:5000/api/deleteAlert/${alertToDelete._id}`);
      } catch (error) {
        console.error('Error deleting alert in DB', error);
        setRecentAlerts(prevAlerts => [...prevAlerts, alertToDelete]);
      }
   };

   return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fcfcfc'}}>
      <ScrollView style={{ backgroundColor: '#fcfcfc'}}>
         <Text style={styles.title}>Your Alerts</Text>
         {recentAlerts.length === 0 ? (
            <View style={{ marginLeft: 100, marginTop: 30, marginRight: 300}}>
            <Text style={{fontSize: 18}}>There are currently no alerts.</Text>
            </View>
         ) : (
            recentAlerts.map((alert, index) => (
               <Card key={index} style={styles.alert}>
                  <Card.Title
                     titleStyle={{ fontWeight: "600" }}
                     title={`${alertMessage(alert.alertType, alert.patientName)}`}
                     subtitle={formatDate(alert.date)}
                     right={(props)=><IconButton
                        icon="trash-can-outline"
                        iconColor="#1059d5"
                        size={20}
                        onPress={() => removeAlert(alert)}
                     />}
                  ></Card.Title>
               </Card>
            ))
         )}
         <View style={{height: 20, backgroundColor: '#fcfcfc'}}></View>
      </ScrollView>
      <View style={{backgroundColor: '#fcfcfc', flex: 1,}}>
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
                  navigation.navigate('ViewPatients')
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
              navigation.navigate('Portal')
             }>
               <Text style={styles.providerDashboardText}>Home</Text>
              <IconButton
                icon="home"
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

