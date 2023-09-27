import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { DataTable } from 'react-native-paper';

export default function Reports({navigation}) {
    return (
        <ScrollView>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={{fontWeight:'bold'}} style={{minWidth:40}}>Past Reports</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold'}} style={{minWidth:14}}>Type</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold'}}>NewCol1</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold'}}>NewCol2</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}} textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Attrition_09_12_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>automated</DataTable.Cell>
            <DataTable.Cell>23</DataTable.Cell>
            <DataTable.Cell>48163</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_12_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>manual</DataTable.Cell>
            <DataTable.Cell>26</DataTable.Cell>
            <DataTable.Cell>40284</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_12_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>automated</DataTable.Cell>
            <DataTable.Cell>20</DataTable.Cell>
            <DataTable.Cell>19462</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_09_12_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>manual</DataTable.Cell>
            <DataTable.Cell>24</DataTable.Cell>
            <DataTable.Cell>61735</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_09_06_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>automated</DataTable.Cell>
            <DataTable.Cell>20</DataTable.Cell>
            <DataTable.Cell>19462</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Maintenance_09_12_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>manual</DataTable.Cell>
            <DataTable.Cell>26</DataTable.Cell>
            <DataTable.Cell>40284</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>NeedsRetest_08_23_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>manual</DataTable.Cell>
            <DataTable.Cell>24</DataTable.Cell>
            <DataTable.Cell>61735</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow1}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}} textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Attrition_08_23_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>automated</DataTable.Cell>
            <DataTable.Cell>23</DataTable.Cell>
            <DataTable.Cell>48163</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={styles.tableRow2}>
            <DataTable.Cell style={{minWidth:114, maxWidth: 111, paddingRight: 7}}  textStyle={{color: '#1059d5', textDecorationLine: 'underline'}}>Refills_08_23_2023</DataTable.Cell>
            <DataTable.Cell style={{minWidth:84, maxWidth: 84, paddingRight: 10}}>automated</DataTable.Cell>
            <DataTable.Cell>20</DataTable.Cell>
            <DataTable.Cell>19462</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        </ScrollView>
      );
}

const styles = StyleSheet.create({
   container: {
      paddingTop: 23,
      paddingLeft: 10,
      paddingRight: 10,
   },
   tableHeader: {
    backgroundColor: '#b3caf2',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  tableRow2: {
    backgroundColor: '#e7e7e7',
  },
})
