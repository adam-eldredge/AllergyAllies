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
               placeholder = "Email"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               autoCapitalize = "none"
               onChangeText = {this.handlePassword}/>
            
            <TouchableOpacity
               style = {styles.logInButton}
               onPress = {
                  () => this.login(this.state.email, this.state.password)
               }>
               <Text style = {styles.logInButtonText}> Log In </Text>
            </TouchableOpacity>

            <TouchableOpacity>
               <Text style = {styles.bottomText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Text style = {styles.bottomText2}>Don't have an account yet?</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <TouchableOpacity
               style = {styles.signUpButton}>
               <Text style = {styles.logInButtonText}>I am a patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.signUpButton}>
               <Text style = {styles.logInButtonText}>I am a practice</Text>
            </TouchableOpacity>
            </View>
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
      borderColor: '#1059d5',
      borderWidth: 1,
      padding: 10
   },
   logInButton: {
      backgroundColor: '#1059d5',
      padding: 10,
      margin: 15,
      height: 40,
      justifyContent: 'center',
      borderRadius: 8,
   },
   logInButtonText:{
      color: 'white',
      textAlign: 'center',
      fontSize: 15,
   },
   bottomText:{
      color: '#1059d5',
      marginLeft: 15,
      marginBottom: 30,
      fontSize: 17,
      textAlign: 'center',
   },
   bottomText2:{
      color: '#606060',
      marginLeft: 15,
      fontSize: 17,
      textAlign: 'center',
      fontWeight: '600'
   },
   signUpButton: {
      backgroundColor: '#1059d5',
      padding: 10,
      margin: 10,
      height: 40,
      width: 150,
      justifyContent: 'center',
      borderRadius: 8,
   },
})
