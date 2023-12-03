import React, { Component, useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import AuthContext from '../AuthContext';
import User from '../User';
import axios from 'axios';
import ProviderMenu from './ProviderMenu';

export default function ViewPatients({ navigation }) {

    const { signOut } = useContext(AuthContext);
    const userInfo = User();
    const practiceID = userInfo.practiceID;
    const [patientsArray, setPatientsArray] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [queriedPatients, setQueriedPatients] = useState(false);
    const stylesList = [styles.tableRow2, styles.tableRow1];
    const [filter, setFilter] = useState('All');
    const filterList = ['All', 'ATTRITION', 'INACTIVE', 'ACTIVE', 'MAINTENANCE']
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        const getPatients = async () => {
            const patients = await axios.get(`http://localhost:5000/api/getPatientsByPractice/${practiceID}`)
            if (patients.status == 200) {
                setPatientsArray(patients.data)
                setRenderData(patients.data)
            }
            setQueriedPatients(true);
        }

        if (!queriedPatients) { getPatients() }
    })

    useEffect(() => updateRenderData(), [patientName])

    const PList = () => (
        <div>
            {renderData.map((p, index) =>
            <TouchableOpacity onPress={() => handlePatientSelect(p)} key={p.id}>
                <DataTable.Row style={index == renderData.length - 1 ? { ...stylesList[index % 2], borderBottomEndRadius: 8, borderBottomStartRadius: 8 } : stylesList[index % 2]}>
                    <DataTable.Cell>{p.firstName}</DataTable.Cell>
                    <DataTable.Cell>{p.lastName}</DataTable.Cell>
                    <DataTable.Cell>{p.email}</DataTable.Cell>
                    <DataTable.Cell textStyle={{ marginLeft: 20 }}>{p.status}</DataTable.Cell>
                    <DataTable.Cell >Patient Account</DataTable.Cell>
                </DataTable.Row>
            </TouchableOpacity>
            )}
        </div>
    );

    function handlePatientSelect(patient) {
       navigation.navigate('PatientDetails', { patient });
    }

    function updateRenderData() {
        let newList = []

        patientsArray.map((element) => {
            let lastName = element.lastName.toLowerCase()
            if (patientName && filter == 'All') {
                let match = patientName.toLowerCase()
                if (lastName.includes(match)) {
                    newList.push(element);
                }
            }
            else if (filter == 'All'){
                newList.push(element);
            }
            else if (patientName && element.status == filter) {
                let match = patientName.toLowerCase()
                if (lastName.includes(match)) {
                    newList.push(element);
                }
            }
            else if (element.status == filter){
                newList.push(element);
            }
        })

        setRenderData(newList);
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 30 }}>
                <Text style={styles.header}>Patients</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Last Name"
                        placeholderTextColor="#7a7a7a"
                        value={patientName}
                        autoCapitalize="none"
                        onChangeText={(name) => {
                            setPatientName(name)
                        }}
                    />
                    <SelectList
                        placeholder='Filter'
                        search={false}
                        defaultOption='All'
                        setSelected={(val) => setFilter(val)}
                        onSelect={() => updateRenderData()}
                        data={filterList}
                        boxStyles={styles.dropdown}
                        inputStyles={{ color: "#7a7a7a" }}
                        dropdownStyles={styles.dropdownSelect}
                    />
                </View>
            </View>
                <DataTable style={styles.table}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>First Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Last Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Email</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14, marginLeft: 20 }}>Status</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Profile</DataTable.Title>
                    </DataTable.Header>
                    <PList />
                </DataTable>
                <View style={{ height: 30 }}></View>
        </View>
        <View style={{width: 900}}></View>
        <ProviderMenu navigation={navigation} style={{ alignSelf: 'flex-end', marginRight: 20 }} />
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        margin: 15,
        height: 40,
        width: height > width ? null : 300,
        borderColor: '#1059d5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    header: {
        fontSize: 40,
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 100,
        marginRight: 20,
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
    dropdown: {
        margin: 15,
        height: 40,
        borderColor: '#1059d5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    dropdownSelect: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1059d5',
        padding: 10
    }
})

