import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

class Alerts extends Component {
   state = {
   }
   render() {
      return (
         <View>
            <View style = {styles.topBar}>
               <IconButton
                  icon="menu"
                  iconColor="white"
                  size={20}
                  onPress={() => console.log('Pressed')}
               />
               <Text style = {styles.topBarText}>Alerts</Text>
               <IconButton
               //take this out and fix spacing
                  icon="menu"
                  iconColor="#1059d5"
                  size={20}
                  onPress={() => console.log('Pressed')}
               />
            </View>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white", fontWeight:"bold" }} subtitleStyle={{color:"white"}}
                  title="Patient Bob is at risk for attrition"
                  subtitle="9/17/2023"
                  right={(props) => <IconButton
                     icon="trash-can-outline"
                     iconColor="white"
                     size={20}
                     onPress={() => console.log('Pressed')}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white", fontWeight:"bold" }} subtitleStyle={{color:"white"}}
                  title="Patient Rob’s injections are expiring or will soon need to be mixed"
                  subtitle="9/17/2023"
                  right={(props) => <IconButton
                     icon="trash-can-outline"
                     iconColor="white"
                     size={20}
                     onPress={() => console.log('Pressed')}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white", fontWeight:"bold" }} subtitleStyle={{color:"white"}}
                  title="Sample Alert 3"
                  subtitle="9/16/2023"
                  right={(props) => <IconButton
                     icon="trash-can-outline"
                     iconColor="white"
                     size={20}
                     onPress={() => console.log('Pressed')}
                   />}
               />
            </Card>
            <Card style = {styles.alert}>
               <Card.Title titleStyle={{ color: "white", fontWeight:"bold" }} subtitleStyle={{color:"white"}}
                  title="Sample Alert 4"
                  subtitle="9/15/2023"
                  right={(props) => <IconButton
                     icon="trash-can-outline"
                     iconColor="white"
                     size={20}
                     onPress={() => console.log('Pressed')}
                   />}
               />
            </Card>
            <Button style = {styles.bottomText}>View more alerts</Button>
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
   alert: {
      backgroundColor:'#5791F3',
      width: Dimensions.get('window').width - 30,
      height: 80,
      marginLeft: 15,
      marginTop: 15
   },
   bottomText: {
      color: '#1059d5',
      fontSize: 17,
      textAlign: 'center',
      marginTop: 20,
   }
})
