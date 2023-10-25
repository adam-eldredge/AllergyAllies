import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper';

export default function Reports({navigation}) {
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
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_1...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/12/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_12_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/12/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_09_1...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/11/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_06_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/06/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Attrition_09_05_2023</DataTable.Cell>
            <DataTable.Cell>automated</DataTable.Cell>
            <DataTable.Cell>09/05/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/05/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/04/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={{...styles.tableRow2, borderBottomEndRadius: 8, borderBottomStartRadius: 8}}>
            <DataTable.Cell textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_0...</DataTable.Cell>
            <DataTable.Cell>manual</DataTable.Cell>
            <DataTable.Cell>09/04/2023</DataTable.Cell>
            <DataTable.Cell>additional info here</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <View style={{height: 30}}></View>
        </ScrollView>
        <View style={{flex: 1}}>
        <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3', marginTop: 100}}
               onPress={() =>
                  navigation.navigate('Reports')
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
               navigation.navigate('Reports')
            }>
               <Text style={styles.providerDashboardText}>Reports</Text>
               <IconButton
                  icon="file-chart"
                  iconColor="white"
                  size={37}
               />
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#d07f99'}}
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
  header:{
    fontSize: 50,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 100,
    color: '#1059d5',
    marginBottom: 20,
  },
  table: {
    marginLeft: 100,
    width: 700,
  },
  tableHeader: {
    backgroundColor: '#b3caf2',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    color: 'black',
  },
  tableRow2: {
    backgroundColor: '#e7e7e7',
  },
  providerDashboardItem:{
    borderRadius: 50,
    height: 100,
    width: 100,
    marginBottom: 20,
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
