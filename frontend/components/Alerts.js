import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import {Dimensions} from 'react-native';
import { Avatar, Card, Button, Menu, Provider as PaperProvider } from 'react-native-paper';

class Alerts extends Component {
   state = {
   }
   render() {
      return (
         <View>
            <Text style = {styles.topBar}>{'\n'}Alerts</Text>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white" }} subtitleStyle={{color:"white"}}
                  title="Sample Alert 1"
                  subtitle="9/17/2023"
                  right={(props) => <Avatar.Icon {...props} backgroundColor='#5791F3' icon="trash-can-outline"/>}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white" }} subtitleStyle={{color:"white"}}
                  title="Sample Alert 2"
                  subtitle="9/17/2023"
                  right={(props) => <Avatar.Icon {...props} backgroundColor='#5791F3' icon="trash-can-outline"/>}
               />
            </Card>
         </View>
      )
   }
}
export default Alerts

const styles = StyleSheet.create({
   topBar: {
      height: 50,
      width: Dimensions.get('window').width,
      backgroundColor: '#1059d5',
      textAlign: 'center',
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
   },
   alert: {
      backgroundColor:'#5791F3',
      width: Dimensions.get('window').width - 30,
      marginLeft: 15,
      marginTop: 15
   }
})
