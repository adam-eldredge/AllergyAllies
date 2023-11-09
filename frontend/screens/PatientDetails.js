import React, { Component, useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import AuthContext from '../AuthContext';
import User from '../User';
import axios from 'axios';

export default function PatientDetails({ route, navigation }) {
  const { patient } = route.params;

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row',}}>
        <View style={{borderRightWidth: 1, borderColor: '#1059d5',}}>
          <IconButton
          icon="account-circle"
          iconColor="gray"
          size={150}
          style={{alignSelf: 'center', marginBottom: -10, marginTop: -5}}
          />
          <Text style={styles.prompt}>{patient.firstName} {patient.lastName}</Text>
          <Text style={{fontSize: 12, alignSelf: 'center',}}>{patient.email}</Text>
          <Text style={{fontSize: 12, alignSelf: 'center', marginBottom: 15, color: 'green'}}>edit patient info</Text>
          <View style={{flex: 1, flexDirection: 'row', borderTopWidth: 1, borderColor: '#1059d5', paddingTop: 15}}>
            <Text style={styles.prompt2}>Date of Birth: </Text>
            <Text style={{...styles.data2, alignSelf: 'center',}}>07/09/2001     </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.prompt2}>Height: </Text>
            <Text style={{...styles.data2, alignSelf: 'center',}}>x'xx</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.prompt2}>Weight: </Text>
            <Text style={{...styles.data2, alignSelf: 'center',}}>xx lb</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.prompt2}>Medical Practice: </Text>
            <Text style={{...styles.data2, alignSelf: 'center',}}>ENT Specialists of Nashville     </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
            <Text style={styles.prompt2}>Status: </Text>
            <Text style={{...styles.data2, alignSelf: 'center',}}>{patient.status}</Text>
          </View>
        </View>
        <View style={{paddingTop: 10, marginBottom: 10}}>
          <View style={{borderBottomColor: '#1059d5', borderBottomWidth: 1, width: 425}}>
            <Text style={styles.prompt2}>Current Allergy Medications: </Text>
            <Text style={styles.data2}>   {'>'} xxx</Text>
            <Text style={styles.data2}>   {'>'} xxx</Text>
            <Text style={{...styles.data2, marginBottom: 10}}>   {'>'} xxx</Text>
          </View>
          
          <Text style={{...styles.prompt2, paddingTop: 10}}>Treatment Information: </Text>
          <Text style={styles.data2}>   Treatment start date of 11/01/2023</Text>
          <Text style={styles.data2}>   Tracking start date of 11/05/2023</Text>
          <Text style={{...styles.data2, paddingBottom: 15}}>   Frequency of injections: 2x/week</Text>

          <View style={{borderTopColor: '#1059d5', borderTopWidth: 1, width: 425, paddingTop: 10,}}>
            <Text style={styles.prompt2}>Notes: </Text>
            <Text style={styles.data2}>   {'>'} xxx</Text>
            <Text style={styles.data2}>   {'>'} xxx</Text>
            <Text style={styles.data2}>   {'>'} xxx</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 800,
        borderWidth: 2,
        borderColor: '#1059d5',
    },
    header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  prompt: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  prompt2: {
    fontSize: 18,
    color: '#1059d5',
    marginLeft: 10,
  },
  data: {
    fontSize: 18,
    alignSelf: 'center'
  },
  data2: {
    fontSize: 16,
    marginRight: 10,
  },
});
