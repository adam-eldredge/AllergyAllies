import React, { Component, useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import AuthContext from '../AuthContext';
import User from '../User';
import axios from 'axios';

export default function PatientDetails({ route, navigation }) {
  const { patient } = route.params;

  const [protocol, setProtocol] = useState();
  const [queriedProtocol, setQueriedProtocol] = useState(false);

  // Get the current bottles for this patient's practice
  useEffect(() => {
    const findProtocol = async () => {
      try {
        const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${patient.practiceID}`)

        if (protocol.status == 200) {
          setProtocol(protocol.data.protocol);
        }

        setQueriedProtocol(true);
      }
      catch (err) {
        setQueriedProtocol(true);
        return ('Something went wrong');
      }
    }

    if (!queriedProtocol) { findProtocol(); }
  })
  if (!protocol) return ('Something went wrong');


  // Create a section for each vial
  const Vials = () => (
    <div>
      {protocol.bottles.map((bottle, index) =>
        <View style={styles.section}>
          <Text style={styles.prompt2}>{bottle.bottleName}</Text>
          <Text style={styles.data3}>Maintenance Bottle: x</Text>
          <Text style={styles.data3}>x% to maintenance</Text>
          <Text style={styles.data3}>Last injection: x</Text>
          <Text style={styles.data3}>Dosage: x</Text>
          <Text style={styles.data3}>Bottle: x</Text>
        </View>
      )}
    </div>
  );


  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row', }}>
        <View>
          <View style={styles.section}>
            <IconButton
              icon="account-circle"
              iconColor="gray"
              size={150}
              style={{ alignSelf: 'center', marginBottom: -10, marginTop: -5 }}
            />
            <Text style={styles.prompt}>{patient.firstName} {patient.lastName}</Text>
            <Text style={{ fontSize: 12, alignSelf: 'center', }}>{patient.email}</Text>
            <TouchableOpacity style={{ marginLeft: 10, alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ fontSize: 12, marginBottom: 10, color: 'green', }}>edit patient info</Text>
              <IconButton icon="pencil" iconColor="green" size={10} style={{ marginTop: -4, marginLeft: -5 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
              <Text style={styles.prompt2}>Date of Birth: </Text>
              <Text style={{ ...styles.data2, alignSelf: 'center', }}>{patient.DoB}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
              <Text style={styles.prompt2}>Height: </Text>
              <Text style={{ ...styles.data2, alignSelf: 'center', }}>x'xx</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
              <Text style={styles.prompt2}>Weight: </Text>
              <Text style={{ ...styles.data2, alignSelf: 'center', }}>xx lb</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
              <Text style={styles.prompt2}>Practice: </Text>
              <Text style={{ ...styles.data2, alignSelf: 'center', }}>ENT Specialists of Nashville     </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
              <Text style={styles.prompt2}>Status: </Text>
              <Text style={{ ...styles.data2, alignSelf: 'center', }}>{patient.status}</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.section}>
            <View>
              <Text style={styles.prompt2}>Current Allergy Medications: </Text>
              <Text style={styles.data2}>   {'>'} xxx</Text>
              <Text style={styles.data2}>   {'>'} xxx</Text>
              <Text style={{ ...styles.data2, marginBottom: 10 }}>   {'>'} xxx</Text>
            </View>

            <Text style={{ ...styles.prompt2, paddingTop: 10 }}>Treatment Information: </Text>
            <Text style={styles.data2}>   Treatment start date of 11/01/2023</Text>
            <Text style={styles.data2}>   Tracking start date of 11/05/2023</Text>
            <Text style={{ ...styles.data2, paddingBottom: 15 }}>   Frequency of injections: 2x/week</Text>
          </View>
        </View>
        <Vials />
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Maintenance', { patient })}>
            <Text style={styles.buttonText}>Set Maintenance Bottle Numbers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Injections', { patient })}>
            <Text style={styles.buttonText}>Add an Injection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignSelf: 'center',
    width: 800,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1059d5',
    marginLeft: 10,
    marginRight: 2,
  },
  data: {
    fontSize: 18,
    alignSelf: 'center'
  },
  data2: {
    fontSize: 16,
    marginRight: 10,
  },
  data3: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 3,
  },
  section: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    minWidth: 300,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#1059d5',
    padding: 10,
    margin: 10,
    height: 40,
    width: 150,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});
