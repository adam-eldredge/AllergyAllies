import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

class Portal extends Component {
   state = {
   }
   render() {
      return (
         <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            <View style = {styles.topBar}>
               <IconButton
                  icon="menu"
                  iconColor="white"
                  size={20}
                  onPress={() => console.log('Pressed')}
               />
               <Text style = {styles.topBarText}>Portal</Text>
               <IconButton
               //take this out and fix spacing
                  icon="menu"
                  iconColor="#1059d5"
                  size={20}
                  onPress={() => console.log('Pressed')}
               />
            </View>
            <TouchableOpacity style={styles.menuItem}
            onPress={() =>
               navigation.navigate('Alerts')
             }>
               <Text style={styles.menuItemText}>Alerts</Text>
               <IconButton
                  icon="alert"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuItemText}>Reports</Text>
               <IconButton
                  icon="newspaper-check"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuItemText}>View Patients</Text>
               <IconButton
                  icon="face-man-shimmer-outline"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuItemText}>Edit Survey Responses</Text>
               <IconButton
                  icon="pencil"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuItemText}>Other Feature</Text>
               <IconButton
                  icon="close"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuItemText}>Other Feature</Text>
               <IconButton
                  icon="close"
                  iconColor="#1059d5"
                  size={30}
                  onPress={() => console.log('Pressed')}
                  alignItems='center'
               />
            </TouchableOpacity> 
         </View>
      )
   }
}
export default Portal

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   topBar: {
      height: 50,
      width: Dimensions.get('window').width,
      backgroundColor: '#1059d5',
      textAlign: 'center',
      justifyContent: 'center',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   topBarText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
   },
   menuItem: {
      padding: 10,
      margin: 15,
      height: 120,
      width: 100,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 3,
      borderColor: '#1059d5'
   },
   menuItemText:{
      color: '#1059d5',
      textAlign: 'center',
      fontSize: 16,
   }
})
