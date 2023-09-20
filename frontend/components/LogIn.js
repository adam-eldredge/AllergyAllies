import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

class LogIn extends Component {
   state = {
      email: '',
      password: ''
   }
   handleEmail = (text) => {
      this.setState({ email: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (email, pass) => {
      alert('email: ' + email + ' password: ' + pass)
   }
   render() {
      return (
         <View style = {styles.container}>
         <Text style = {styles.title}>Allergy Ally</Text>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "  Email"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "  Password"
               autoCapitalize = "none"
               onChangeText = {this.handlePassword}/>
            
            <TouchableOpacity
               style = {styles.logInButton}
               onPress = {
                  () => this.login(this.state.email, this.state.password)
               }>
               <Text style = {styles.logInButtonText}> Log In </Text>
            </TouchableOpacity>

            <Text style = {styles.bottomText}>Forgot password?</Text>
            <Text style = {styles.bottomText}>Sign up as a patient</Text>
            <Text style = {styles.bottomText}>Sign up as a medical practice</Text>
         </View>
      )
   }
}
export default LogIn

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   title :{
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1059d5',
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#5791F3',
      borderWidth: 1,
   },
   logInButton: {
      backgroundColor: '#5791F3',
      padding: 10,
      margin: 15,
      height: 40,
      justifyContent: 'center',
      marginBottom: 30,
   },
   logInButtonText:{
      color: 'white',
      textAlign: 'center'
   },
   bottomText:{
      color: '#1059d5',
      marginLeft: 15,
      marginBottom: 5,
      fontSize: 17,
      textAlign: 'center',
   },
})
