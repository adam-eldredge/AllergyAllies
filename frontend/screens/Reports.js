import React, { Component, useContext } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';
import AuthContext from '../AuthContext';


export default function Reports({navigation}) {

  const { signOut } = useContext(AuthContext);
  
    return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white'}}>
        <ScrollView style={{backgroundColor:'white'}}>
        <Text style={styles.header}>Your Reports</Text>
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={{fontWeight:'bold', color: 'black', fontSize: 14}}>Past Reports</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold', color: 'black', fontSize: 14}}>Type</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold', color: 'black', fontSize: 14}}>Date Generated</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold', color: 'black', fontSize: 14}}>Notes</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Attrition_09_12_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/12/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_1...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/12/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_12_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/12/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_09_1...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/11/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_06_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/06/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Attrition_09_05_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/05/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/05/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/04/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={{...styles.tableRow2, borderBottomEndRadius: 8, borderBottomStartRadius: 8}}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/04/2023</DataTable.Cell>
            <DataTable.Cell>
              additional info here
              <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 20}}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#1059d5"
                  size={17}
                  onPress={showAlert}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <View style={{height: 30}}></View>
        </ScrollView>
        <View style={{flex: 1}}>
        <TouchableOpacity style={{marginTop: 50, marginBottom: 10, backgroundColor: '#dc6c82', height: 30, width: 100, borderRadius: 5, flexDirection: 'row', alignItems: 'center'}}
               onPress={() =>
                  signOut()
               }>
                <Text style={{color: 'white', size: 5, marginRight: -10, marginLeft: 12, fontWeight: 500}}>Sign out</Text>
                  <IconButton
                     icon="exit-to-app"
                     iconColor="white"
                     size={14}
                  />
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3', marginTop: 15}}
               onPress={() =>
                  navigation.navigate('ViewPatients')
               }>
               <Text style={{...styles.providerDashboardText, fontSize: 12, marginBottom: -15}}>My Patients</Text>
               <IconButton
                  icon="account-heart"
                  iconColor="white"
                  size={37}
               />
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#937fd0'}}
               onPress={() =>
                  navigation.navigate('PracticeSurvey')
               }>
               <Text style={{...styles.providerDashboardText, fontSize: 12}}>View/Edit</Text>
               <Text style={{...styles.providerDashboardText, fontSize: 12, marginTop: 10, marginBottom: -15}}>Practice Info</Text>
               <IconButton
                  icon="pencil"
                  iconColor="white"
                  size={37}
               />
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#7fd0ae'}}
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
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#6e85f4'}}
            onPress={() =>
              navigation.navigate('Portal')
             }>
               <Text style={styles.providerDashboardText}>Home</Text>
              <IconButton
                icon="home"
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
  header:{
    fontSize: 40,
    marginTop: 40,
    fontWeight: '600',
    marginLeft: 100,
    color: '#1059d5',
    marginBottom: 10,
  },
  table: {
    marginLeft: 100,
    width: 800,
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