import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Card, IconButton } from 'react-native-paper';
import AuthContext from '../../AuthContext';
import {formatDate, alertMessage, fetchRecentAlerts} from '../../utils/alertUtils';
import User from '../../User';
import axios from 'axios';
import ProviderMenu from './ProviderMenu';

export default function AllAlerts({navigation}){
   const { signOut } = useContext(AuthContext);
   const userInfo = User();
   const [recentAlerts, setRecentAlerts] = useState([]);
   const [deletedAlerts, setDeletedAlerts] = useState([]);

   useEffect(() => {
      const fetchAlerts = async () => {
         const alerts = await fetchRecentAlerts(userInfo.id);
         setRecentAlerts(alerts);
      }

      fetchAlerts();
   }, []);

   const removeAlert = async (alertToDelete) => {
      try {

         setDeletedAlerts((prevDeletedAlerts) => [...prevDeletedAlerts, alertToDelete]);

         // update the local state of alerts/cards
         const updatedAlerts = recentAlerts.filter((alert) => alert._id !== alertToDelete._id);
         setRecentAlerts(updatedAlerts);
    
         // mark alert for deletion in API
         await axios.delete(`http://localhost:5000/api/deleteAlert/${alertToDelete._id}`);

      } catch (error) {
         console.error('Error deleting alert in DB', error);
         setRecentAlerts(prevAlerts => [...prevAlerts, alertToDelete]);
      }
   };

   const undoDelete = async () => {
      try {
         if (deletedAlerts.length > 0) {
            const latestDeletedAlert = deletedAlerts.pop();
            setDeletedAlerts([...deletedAlerts]);

            const updatedAlerts = [...recentAlerts, latestDeletedAlert].sort(
               (a, b) => new Date(b.date) - new Date(a.date)
            );

            setRecentAlerts(updatedAlerts);

            // undo alert deletion
            await axios.patch(`http://localhost:5000/api/undoDelete`);
         }
       } catch (error) {
         console.error('Error deleting alert in DB', error);
       }
   }

   return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fcfcfc'}}>
      <ScrollView style={{ backgroundColor: '#fcfcfc'}}>
         <Text style={styles.title}>Your Alerts</Text>

         <View style={{ alignItems: 'flex-end', marginRight: 520 }}>
            <TouchableOpacity onPress={undoDelete}>
                  <Text style = {{ textDecorationLine: 'underline', color: '#1059d5', fontSize: 15, fontWeight: 'bold' }}>Undo</Text>
            </TouchableOpacity>
         </View>
         
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
      <ProviderMenu navigation={navigation} />
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
})

