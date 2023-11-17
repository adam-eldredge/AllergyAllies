import React, { Component, useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, ScrollView, Platform } from 'react-native'
import { Avatar, Card, Button, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import User from '../../User';
import axios from 'axios';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';

export default function Maintenance({route, navigation}){

   // Current user
   const userInfo = User();

   // Protocol information
   const [protocol, setProtocol] = useState();
   const [queriedProtocol, setQueriedProtocol] = useState(false);

   // Today's date
   const date = new Date();

   // Current patient *** NEEDS TO BE UPDATED ONCE PROPERLY SET UP
   const {patient} = route.params

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
   const BottleQuestions = {
      title: `Set Maintenance Bottle Numbers - ${patient.firstName} ${patient.lastName}`,
      description: `Date: ${date}`,
      textAlign: "center",
      completedHtml: 'Successfully updated patient account',
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
                           name: 'bottleNum' + index,
                           title: 'Maintenance Bottle Number:',
                           type: 'text',
                           inputType: 'number',
                           defaultValue: 0,
                           isRequired: true
                        }
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
   const bottleForm = new Model(BottleQuestions);

   // Apply theme to survey
   bottleForm.applyTheme(theme);

   bottleForm.onComplete.add((sender, options) => {
      updateMaintenanceBottles(sender.data, protocol.bottles, {patient});
  });

   return <Survey model={bottleForm} />;
}

const updateMaintenanceBottles = async (data, bottles, patient) => {
   let bottleNums = []
   const numBottles = bottles.map((bottle, index) => {
    const bottleData = {
        nameOfBottle: bottle.bottleName,
        maintenanceNumber: eval(`data.bottleNum${index}`)
    }
      bottleNums.push(bottleData)
   })

   console.log(patient.patient)
   const update = await axios.patch(`http://localhost:5000/api/${patient.patient.email}/updateMaintenanceBottleNums`, bottleNums)
   console.log(update)
}

