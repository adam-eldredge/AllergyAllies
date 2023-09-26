import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

class AllAlerts extends Component {
   state = {
   }
   render() {
      return (
         <ScrollView style={styles.container}>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
                  title="Patient Bob is at risk for attrition!"
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
               <Card.Title titleStyle={{ color: "#1059d5", fontWeight:"bold" }} subtitleStyle={{color:"#1059d5"}}
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
         </ScrollView>
      )
   }
}
export default AllAlerts

const styles = StyleSheet.create({
   alert: {
      width: Dimensions.get('window').width - 30,
      height: 80,
      marginLeft: 15,
      marginTop: 15,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: '#1059d5'
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
