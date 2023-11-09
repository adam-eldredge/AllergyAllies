import React, { Component, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import User from '../../User';
import axios from 'axios';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';

export default function Injections({navigation}){

   const userInfo = User();
   const [protocol, setProtocol] = useState();
   const [queriedProtocol, setQueriedProtocol] = useState(false);
   const [patientName, setPatientName] = useState('example name')

   useEffect(() => {
      const findProtocol = async() => {
         try {
            const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${userInfo.practiceID}`)
      
            if (protocol.status == 200) {
               setProtocol(protocol.data.protocol);
               const bottles = protocol.data.protocol.bottles;
               console.log(bottles);
            }

            setQueriedProtocol(true);
         }
         catch (err) {
            setQueriedProtocol(true);
            return ('Something went wrong');
         }
      }

      if (!queriedProtocol) {findProtocol();}
   })
   if (!protocol) return ('Something went wrong');
   

   // Input Fields
   const InjectionQuestions = {
      title: "Add an Injection",
      description: `Patient: ${patientName}`,
      textAlign: "center",
      pages:
         [
            {
               name: "main page",
               elements: protocol.bottles.map((vial, index) => {
                  return {
                     name: String(index),
                     title: vial.bottleName,
                     type: 'panel',
                     elements: [
                        {
                           name: 'maintenance' + index,
                           title: 'Maintenance Bottle Number:',
                           type: 'panel',
                           elements: [
                              {
                                 name: 'b' + index,
                                 title: 'Edit?',
                                 titleLocation: 'left',
                                 type: 'boolean',
                                 defaultValue: false,
                                 valueTrue: 'Edit',
                                 valueFalse: 'Lock'
                              },
                              {
                                 name: 'a' + index,
                                 titleLocation: 'hidden',
                                 type: 'text',
                                 inputType: 'number',
                                 defaultValue: '5',
                                 isRequired: true,
                                 startWithNewLine: false,
                                 enableIf: `{b${index}} == "Edit"`
                              }
                           ]
                        },
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: '0.15',
                           startWithNewLine: false,
                           isRequired: true
                        },
                     ]
                  }
               })
            }
         ],
      completeText: 'Submit',
      showQuestionNumbers: 'false',
      questionErrorLocation: 'bottom',
   }

   // ***** SURVEY OBJECT ***** //
   const survey = new Model(InjectionQuestions);

   // Apply theme to survey
   survey.applyTheme(theme);

   return (<Survey model={survey} />)
   
   
   // Need to get all vials that this practice uses
         // If not already set - add a red message to tell dr to set
         // Input for each for maintenance bottle nums

   

   // For each vial
         // Bottle num input
         // Injection Volume input
            // Use jimmys calcs to auto get the next injection
            // button with a +/- to increase or decrease the dosage
         // Injection location text box
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
      width: 800,
      height: 70,
      marginLeft: 100,
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: 'white',
      marginBottom: 5,
   },
   providerDashboardItem:{
      borderRadius: 8,
      height: 100,
      width: 100,
      marginBottom: 10,
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
