import React, { useContext, Component } from 'react'
import { View, Text, Image,  Button, ScrollView, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert} from 'react-native'
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AuthContext from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import User from '../User';
import { DataTable } from 'react-native-paper'; 
   


export default function PatientProfile({navigation}){

    const { signOut } = useContext(AuthContext);
    const userInfo = User();
    const firstName = userInfo.firstName;
    const lastName = userInfo.lastName;
    const email = userInfo.email;


    const editCurrentMeds = () => {
   
      navigation.navigate('EditCurrentMedications')
  
  };

      return (
      <ScrollView style={styles.container}>
        <View style={styles.profilePhotoContainer}>
        <Image
          source={require('./profilepic.png')}
          style={styles.profilePhoto}
        />
        <Text style={styles.name}>{firstName} {lastName}</Text>
        <Text style={styles.grayText}> testemail@gmail.com </Text>
      </View>
      <View style={styles.textBoxContainer}>
        <View style={styles.textBoxDivider}> 
        <Text style={styles.textBoxTitle}>Current Allergy Medications</Text>
        <TouchableOpacity onPress={editCurrentMeds} style={{marginRight: 8}}>
        <FontAwesomeIcon style={{alignContent: 'flex-end', marginLeft: 85}} icon={faPenToSquare} color={'#0d3375'} size={20}/>
        </TouchableOpacity>
       
        </View>
        <Text style={styles.textBoxContent}>Nasal Steroid Spray </Text> 
        <Text style={styles.textBoxContent}>Nasal Antihistamine Spray </Text>
        <Text style={styles.textBoxContent}>Oral Antihistamine </Text> 
        <Text style={styles.textBoxContent}>Other </Text>
      </View>
      <View style={styles.textBoxContainer}>
      <View style={styles.textBoxDivider}>
        <Text style={styles.textBoxTitle}>Medical Practice                                                                                                               </Text>
      </View>
        <Text style={styles.textBoxContent}>ENT Specialists of Nashville </Text> 
      </View>
      <View style={styles.textBoxContainer}>
      <View style={styles.textBoxDivider}>
        <Text style={styles.textBoxTitle}>Treatment Information                                                                                                               </Text>
        </View>
        <Text style={styles.textBoxContent}>Treatment Start Date:</Text> 
        <Text style={styles.textBoxSubContent}>10/17/23</Text> 
        <Text style={styles.textBoxContent}>Tracking Start Date:</Text> 
        <Text style={styles.textBoxSubContent}>10/17/23</Text>
            
        <Text style={styles.textBoxContent}>Frequency of Injections:</Text> 
        <Text style={styles.textBoxSubContent}>2x a week</Text>

{/* 
        <DataTable style={styles.container}> 
      <DataTable.Header style={styles.tableHeader}> 
        <DataTable.Title fontSize = {20}>Vial</DataTable.Title> 
        <DataTable.Title>Maintenance Bottle #</DataTable.Title> 
      </DataTable.Header> 
      <DataTable.Row> 
        <DataTable.Cell>Vial 1 (Insects)</DataTable.Cell> 
        <DataTable.Cell>6</DataTable.Cell> 
      </DataTable.Row> 
  
      <DataTable.Row> 
        <DataTable.Cell>Vial 2 (Molds)</DataTable.Cell> 
        <DataTable.Cell>6</DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row> 
        <DataTable.Cell>Vial 3 (Pollen)</DataTable.Cell> 
        <DataTable.Cell>4</DataTable.Cell> 
      </DataTable.Row> 
    </DataTable>   */}
      </View>

      <TouchableOpacity
               style = {styles.signOutButton}
               onPress={signOut}>
               <Text style = {styles.signOutButtonText}> Sign Out </Text>
            </TouchableOpacity>
    </ScrollView>
      )
   }

   const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    textBoxContainer: {
        alignItems: 'center',
        borderRadius: 8,
        //shadowOpacity: 0.1,
        //shadowOffset: {width: 2, height: 4},
        //shadowColor: 'black',
        //shadowOpacity: 0.05,
        //shadowRadius: 8,
        backgroundColor: 'white',
        marginTop: 18,
        marginBottom: 18,
        paddingBottom: 6
        
      },
      textBoxTitle: {
        fontSize: 16,
        marginTop: 8,
        alignSelf: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingLeft: 15,
        paddingBottom: 6,
        color: '#0d3375',
        fontWeight: '600'
      },
      textBoxDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        flexDirection: 'row',
        alignItems: 'center'
      },
      textBoxContent: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingLeft: 15,
        paddingBottom: 8,
        color: '#5e5e5e',
        fontWeight: '400'
      },
      textBoxSubContent: {
        fontSize: 16,
        marginTop: -2,
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingLeft: 15,
        paddingBottom: 6,
        color: '#878787',
        fontWeight: '400'
      },
    profilePhotoContainer: {
        alignItems: 'center',
        marginTop: 16,
      },
      profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
      },
    label: {
      fontSize: 16,
      fontWeight: 'light',
      marginTop: 22,
      marginHorizontal: 4,
    },
    text: {
      fontSize: 16,
      marginTop: 8,

    },
    name: {
        fontSize: 20,
        marginTop: 8,
        fontWeight: '700'
    },
    grayText: {
        fontSize: 14,
        marginTop: 2,
        marginBottom: 15,
        color: '#757575'
      },
    signOutButton: {
        backgroundColor: '#ffe3e7',
        padding: 5,
        marginHorizontal: 50,
        height: 40,
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff6177',
        marginBottom: 40
     },
     signOutButtonText:{
        color: '#ff6177',
        textAlign: 'center',
        fontSize: 15,
     },
     tableHeader: { 
      backgroundColor: '#DCDCDC', 
    }
  });