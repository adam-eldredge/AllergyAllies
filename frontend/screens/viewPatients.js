import React, { Component, useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';
import AuthContext from '../AuthContext';
import User from '../User';
import axios from 'axios';

export default function viewPatients({ navigation }) {

    const { signOut } = useContext(AuthContext);
    const userInfo = User();
    const practiceID = userInfo.practiceID;
    const [patientsArray, setPatientsArray] = useState([]);
    const [queriedPatients, setQueriedPatients] = useState(false);

    useEffect(() => {
        const getPatients = async () => {
            const patients = await axios.get(`http://localhost:5000/api/getPatientsByPractice/${practiceID}`)
            if (patients.status == 200) {setPatientsArray(patients.data)}
            setQueriedPatients(true);
        }

        if (!queriedPatients) { getPatients() }
    })
    
    const PList = () => (
        <div>
            {patientsArray.map(p => 
            <DataTable.Row style={styles.tableRow2}>
                <DataTable.Cell>{p.firstName}</DataTable.Cell>
                <DataTable.Cell>{p.lastName}</DataTable.Cell>
                <DataTable.Cell>{p.email}</DataTable.Cell>
                <DataTable.Cell>Patient Account</DataTable.Cell>
            </DataTable.Row>
            )} 
        </div>
    );

    console.log(PList);

    return (
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white' }}>
            <ScrollView style={{ backgroundColor: 'white' }}>
                <Text style={styles.header}>Patients</Text>
                <DataTable style={styles.table}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>First Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Last Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Email</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>View patient account</DataTable.Title>
                    </DataTable.Header>
                    <PList />
                </DataTable>
                <View style={{ height: 30 }}></View>
            </ScrollView>


            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ ...styles.providerDashboardItem, backgroundColor: '#71a1f3' }}
                    onPress={() =>
                        navigation.navigate('Reports')
                    }>
                    <Text style={styles.providerDashboardText}>Reports</Text>
                    <IconButton
                        icon="file-chart"
                        iconColor="white"
                        size={37}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.providerDashboardItem, backgroundColor: '#937fd0' }}
                    onPress={() =>
                        navigation.navigate('PracticeSurvey')
                    }>
                    <Text style={{ ...styles.providerDashboardText, fontSize: 12 }}>View/Edit</Text>
                    <Text style={{ ...styles.providerDashboardText, fontSize: 12, marginTop: 10, marginBottom: -15 }}>Practice Info</Text>
                    <IconButton
                        icon="pencil"
                        iconColor="white"
                        size={37}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.providerDashboardItem, backgroundColor: '#7fd0ae' }}
                    onPress={() =>
                        navigation.navigate('AllAlerts')
                    }>
                    <Text style={styles.providerDashboardText}>Alerts</Text>
                    <IconButton
                        icon="bell-ring"
                        iconColor="white"
                        size={37}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.providerDashboardItem, backgroundColor: '#d07f99' }}
                    onPress={() =>
                        signOut()
                    }>
                    <Text style={styles.providerDashboardText}>Sign out</Text>
                    <IconButton
                        icon="exit-to-app"
                        iconColor="white"
                        size={37}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        fontSize: 40,
        marginTop: 40,
        fontWeight: '600',
        marginLeft: 100,
        color: '#1059d5',
        marginBottom: 20,
    },
    table: {
        marginLeft: 100,
        width: 700,
    },
    tableHeader: {
        backgroundColor: '#cbdeff',
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        color: 'black',
    },
    tableRow2: {
        backgroundColor: '#ebebeb',
    },
    providerDashboardItem: {
        borderRadius: 50,
        height: 100,
        width: 100,
        marginBottom: 20,
        alignItems: 'center',
    },
    providerDashboardText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: -10,
    },
})

const showAlert = () =>
    Alert.alert(
        'Delete this alert?',
        'This action cannot be undone!',
        [
            {
                text: 'Cancel',
                style: 'cancel',
                //onPress: () => Alert.alert('add in delete functionality'),
            },
            {
                text: 'Yes',
                style: 'cancel',
            },
        ],
        {
            cancelable: true,
            onDismiss: () =>
                Alert.alert(
                    'This alert was dismissed by tapping outside of the alert dialog.',
                ),
        },
    );