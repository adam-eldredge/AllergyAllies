import React, { Component, useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView, Platform } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import User from '../../User';
import axios from 'axios';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';

export default function Injections({route, navigation}){

   // Current user
   const userInfo = User();

   // Protocol information
   const [protocol, setProtocol] = useState();
   const [queriedProtocol, setQueriedProtocol] = useState(false);

   // Today's date
   const date = new Date();

   // Current Patient
   const {patient} = route.params

   // Calculated value - NEEDS TO BE UPDATED WITH JIMMY'S CALCULATIONS
   const [calculatedVolume, setCalculatedVolume] = useState('0');
   const [calculatedDilution, setCalculatedDilution] = useState('0');
   const [calculatedBottleNum, setCalculatedBottleNum] = useState('0');

   useEffect(() => {
      const findProtocol = async() => {
         try {
            const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${userInfo.practiceID}`)
      
            if (protocol.status == 200) {
               setProtocol(protocol.data.protocol);
               const bottles = protocol.data.protocol.bottles;
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
      title: `Add an Injection - ${patient.firstName} ${patient.lastName}`,
      description: `Date: ${date}`,
      textAlign: "center",
      completedHtml: 'Successfully added injection',
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
                           name: 'b' + index,
                           title: 'Edit?',
                           titleLocation: 'left',
                           type: 'boolean',
                           defaultValue: false,
                           valueTrue: 'Edit',
                           valueFalse: 'Lock'
                        },
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           description: 'Calculated next dose volume',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: calculatedVolume,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'bottleNum' + index,
                           title: 'Bottle Number:',
                           description: "Patient's current bottle number for this vial.",
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: calculatedBottleNum,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'dilution' + index,
                           title: 'Injection Dilution:',
                           description: "Dilution of patient's current bottle.",
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: calculatedDilution,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'location' + index,
                           title: 'Injection Location:',
                           description: "Location of injection on patient's arm.",
                           type: 'dropdown',
                           choices: [
                              'Right Upper',
                              'Right Lower',
                              'Left Upper',
                              'Left Lower'
                           ],
                           defaultValue: 'Right Upper',
                           enableIf: `{b${index}} == "Edit"`,
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
   const injectionForm = new Model(InjectionQuestions);

   // Apply theme to survey
   injectionForm.applyTheme(theme);

   injectionForm.onComplete.add((sender, options) => {
      createInjectionObject(sender.data, protocol.bottles);
  });

   return <Survey model={injectionForm} />;
}

const createInjectionObject = (data, bottles) => {
   let Injections = []
   const numBottles = bottles.map((bottle, index) => {
      const bottleInjection = {
         nameOfBottle: bottle.bottleName,
         injVol: eval(`data.volume${index}`),
         injDilution: eval(`data.dilution${index}`),
         currBottleNumber: eval(`data.bottleNum${index}`),
         date: new Date()
      }
      Injections.push(bottleInjection)
   })
   console.log(Injections)
}

