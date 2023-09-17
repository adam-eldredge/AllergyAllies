import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

class Alerts extends Component {
   state = {
   }
   render() {
      return (
         <View style = {styles.container}>
            <Text style = {styles.topBar}>{'\n'}Alerts</Text>
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
               <Text style = {styles.menuItemText}>Alerts </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default Alerts

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   topBar: {
      height: 50,
      width: 300,
      backgroundColor: '#1059d5',
      textAlign: 'center',
      color: 'white'
   },
   menuItem: {
      backgroundColor: '#5791F3',
      padding: 10,
      margin: 15,
      height: 50,
      width: 270
   },
   menuItemText:{
      color: 'white'
   }
})