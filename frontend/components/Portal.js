import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Rect } from 'react-native'

class Portal extends Component {
   state = {
   }
   render() {
      return (
         <View style = {styles.container}>
            <TouchableOpacity
               style = {styles.menuItem}
               onPress = {
                  () => this.portal()
               }>
               <Text style = {styles.menuItemText}>Alerts </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.menuItem}
               onPress = {
                  () => this.portal()
               }>
               <Text style = {styles.menuItemText}>Reports </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.menuItem}
               onPress = {
                  () => this.portal()
               }>
               <Text style = {styles.menuItemText}>View Patients </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.menuItem}
               onPress = {
                  () => this.portal()
               }>
               <Text style = {styles.menuItemText}>Edit Survey Responses </Text>
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
   menuItem: {
      backgroundColor: '#5791F3',
      padding: 10,
      margin: 15,
      height: 100,
      width: 100
   },
   menuItemText:{
      color: 'white'
   }
})