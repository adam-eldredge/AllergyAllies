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
  const [practice, setPractice] = useState();
  const [queriedProtocol, setQueriedProtocol] = useState(false);

  // Get the current bottles for this patient's practice
  useEffect(() => {
    const findProtocol = async () => {
      try {
        const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${patient.practiceID}`)
        const practice = await axios.get(`http://localhost:5000/api/practice/${patient.practiceID}`)

        if (protocol.status == 200) {
          setProtocol(protocol.data.protocol);
        }
        if (practice.status == 200) {
          setPractice(practice.data);
          console.log(practice);
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
          {/* VIAL NAME */}
          <Text style={styles.prompt2}>{bottle.bottleName}</Text>

          {/* MAINTENANCE BOTTLE NUMBER */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Maintenance Botttle: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}>x</Text>
          </View>

          {/* PROGRESS */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Progress: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}> [insert calc here]</Text>
          </View>

          {/* LAST INJECTION */}
          <Text style={{ ...styles.prompt2, paddingTop: 14 }}>Last Injection</Text>

          {/* DOSAGE */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Dosage: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}> [INSERT HERE] </Text>
          </View>

          {/* BOTTLE NUMBER */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Bottle: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}> [INSERT HERE]</Text>
          </View>
        </View>
      )}
    </div>
  );

  const PracticeSection = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={styles.prompt2}>Practice Info</Text>

      {/* PRACTICE NAME */}
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Name: </Text>
        <Text style={{ ...styles.data2, alignSelf: 'center', }}>{practice.practiceName}</Text>
      </View>
    </View>
  )

  const IconSection = () => (
    <View style={styles.section}>
      <IconButton
        icon="account-circle"
        iconColor="green"
        size={150}
        style={{ alignSelf: 'center', marginBottom: -10, marginTop: -5 }}
      />
      <Text style={styles.prompt}>{patient.firstName} {patient.lastName}</Text>
      <Text style={{ fontSize: 12, alignSelf: 'center', }}>{patient.email}</Text>
      <Text style={{ fontSize: 12, alignSelf: 'center', }}>{patient.phone}</Text>
    </View>
  )

  const PersonalInfo = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={styles.prompt2}>Personal Info</Text>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Date of Birth: </Text>
        <Text style={styles.data}>{patient.DoB}     </Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Height: </Text>
        <Text style={styles.data}>{patient.height} in</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Weight: </Text>
        <Text style={styles.data}>{patient.weight} lb</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Practice: </Text>
        <Text style={styles.data}>{patient.practice}</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Status: </Text>
        <Text style={styles.data}>{patient.status}</Text>
      </View>

    </View>
  )

  const TreatmentInfo = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={{ ...styles.prompt2, paddingTop: 10 }}>Treatment Information: </Text>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Treatment start date: </Text>
        <Text style={styles.data3}>11/01/2023</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Tracking start date: </Text>
        <Text style={styles.data3}>11/05/2023</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Frequency of injections: </Text>
        <Text style={styles.data3}>2x/week</Text>
      </View>
    </View>
  )

  const Buttons = () => (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '7' }}>
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
  )


  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row', }}>
        {/* ROW 1*/}
        <View>
          <IconSection />
          <PersonalInfo />
        </View>

        {/* ROW 2*/}
        <View>
          <PracticeSection />
          <TreatmentInfo />
        </View>

        {/* ROW 3*/}
        <Vials />

        {/* ROW 4*/}
        <Buttons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignSelf: 'center',
    minWidth: 800,
    flexDirection: 'column',
    justifyContent: 'center'
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
  prompt3: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 2,
  },
  data: {
    fontSize: 16,
    marginRight: 10,
    alignSelf: 'center'
  },
  data2: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  data3: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  section: {
    borderRadius: 10,
    padding: 7,
    backgroundColor: 'white',
    margin: 10,
    minWidth: 300,
    paddingBottom: 10,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#1059d5',
    padding: 10,
    margin: 10,
    height: 50,
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
