import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function ProviderAccount({navigation}){
      return (
         <View>
            <Text>account info will be placed here.</Text>
         </View>
      )
   }

const styles = StyleSheet.create({
   alert: {
      width: Dimensions.get('window').width - 30,
      height: 70,
      marginLeft: 15,
      marginTop: 20,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#1059d5'
   },
   bottomText: {
      paddingTop: 20,
      color: '#1059d5',
      alignSelf: 'center',
      fontSize: 17,
      fontWeight: '500',
      textDecorationLine: 'underline',
   }
})