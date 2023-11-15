import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import axios from 'axios';
import User from '../User';

export default function Reports({ navigation }) {
  const userInfo = User();
  const providerId = userInfo.providerId;
  const [reports, setReports] = useState([]);
  const [attritionError, setAttritionError] = useState(null);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const [refillError, setRefillError] = useState(null);
  const [needsRetestError, setNeedsRetestError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const generateAttritionReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attritionReport/${providerId}`);
      const newReport = {
        type: 'Attrition',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => [...prevReports, newReport]);
      setAttritionError(null);
    } catch (error) {
      console.error('Error fetching attrition report:', error);
      setAttritionError('Error fetching attrition report. Please try again.');
    }
  };

  const generateApproachingMaintenanceReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/approachingMaintenanceReport/${providerId}`);
      const newReport = {
        type: 'Approaching Maintenance',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => [...prevReports, newReport]);
      setMaintenanceError(null);
    } catch (error) {
      console.error('Error fetching Approaching Maintenance report:', error);
      setMaintenanceError('Error fetching Approaching Maintenance report. Please try again.');
    }
  };

  const needsRetestReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/needsRetestReport/${providerId}`);
      const newReport = {
        type: 'Needs Retest',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => [...prevReports, newReport]);
      setNeedsRetestError(null);
    } catch (error) {
      console.error('Error fetching Needs Retest report:', error);
      setNeedsRetestError('Error fetching Needs Retest report. Please try again.');
    }
  };

  const refillsReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/refillsReport/${providerId}`);
      const newReport = {
        type: 'Refills',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };
  
      setReports((prevReports) => [...prevReports, newReport]);
      setRefillError(null); // Fix the typo here
    } catch (error) {
      console.error('Error fetching Refills report:', error);
      setRefillError('Error fetching Refills report. Please try again.'); // Fix the typo here
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={styles.header}>Your Reports</Text>
          <Text style={{ fontSize: 15, color: '#1059d5', paddingLeft: 40, marginTop: 65, marginRight: 5 }}>
            Generate a new report of type:{' '}
          </Text>
          <TouchableOpacity onPress={generateAttritionReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Attrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={generateApproachingMaintenanceReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Approaching Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={refillsReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Refills
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={needsRetestReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Needs Retest
            </Text>
          </TouchableOpacity>
          
        </View>

        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Past Reports</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Type</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Date Generated</DataTable.Title>
          </DataTable.Header>

          {reports.map((report, index) => (
            <DataTable.Row key={index} style={index % 2 === 0 ? styles.tableRow2 : styles.tableRow1}>
              <DataTable.Cell>
                {report.data ? (
                  <TouchableOpacity onPress={() => openModal(report)}>
                    <Text style={{ color: '#1059d5', textDecorationLine: 'underline' }}>View</Text>
                  </TouchableOpacity>
                ) : (
                  <Text>No patients at risk of attrition.</Text>
                )}
              </DataTable.Cell>
              <DataTable.Cell>{report.type}</DataTable.Cell>
              <DataTable.Cell>{report.dateGenerated}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        {attritionError && (
          <View>
            <Text style={{ color: 'red' }}>{attritionError}</Text>
          </View>
        )}

        <View style={{ height: 30 }}></View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{selectedReport && selectedReport.data ? JSON.stringify(selectedReport.data, null, 2) : ''}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{backgroundColor: '#fcfcfc', flex: 1,}}>
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
  header: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
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
});
