import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function AllAlerts({navigation}){
   return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fcfcfc'}}>
      <ScrollView style={{ backgroundColor: '#fcfcfc'}}>
         <Text style={styles.title}>Your Alerts</Text>
         <Card style = {{...styles.alert, marginTop: 20}}>
            <Card.Title titleStyle={{ fontWeight:"600" }}
               title="Patient Bob is at risk for attrition."
               subtitle="9/17/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600" }}
               title="Patient Rob’s injections are expiring or will soon need to be mixed"
               subtitle="9/17/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600" }}
               title="Sample Alert 3"
               subtitle="9/16/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600" }}
               title="Sample Alert 4"
               subtitle="9/15/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600" }}
               title="Sample Alert 5"
               subtitle="9/15/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600" }}
               title="Sample Alert 6"
               subtitle="9/14/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600"}}
               title="Sample Alert 7"
               subtitle="9/12/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <Card style = {styles.alert}>
            <Card.Title titleStyle={{fontWeight:"600"}}
               title="Sample Alert 8"
               subtitle="9/10/2023"
               right={(props) => <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={20}
                  onPress={showAlert}
                />}
            />
         </Card>
         <View style={{height: 20, backgroundColor: '#fcfcfc'}}></View>
      </ScrollView>
      <View style={{backgroundColor: '#fcfcfc', flex: 1, marginLeft: 300, marginTop: -40}}>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3', marginTop: 100}}
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
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#d07f99'}}
               onPress={() =>
                  signOut()
               }>
                  <Text style={styles.providerDashboardText}>Sign out</Text>
                  <IconButton
                     icon="exit-to-app"
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
      width: 600,
      height: 70,
      marginLeft: 100,
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: 'white',
      marginBottom: 5,
   },
   providerDashboardItem:{
      borderRadius: 50,
      height: 100,
      width: 100,
      marginBottom: 20,
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

const showAlert = () =>
  Alert.alert(
    'Delete this alert?',
    'This action cannot be undone!',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        //onPress: () => Alert.alert('add in delete functionality'),
      },
      {
         text: 'Yes',
         style: 'cancel',
       },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    },
  );
