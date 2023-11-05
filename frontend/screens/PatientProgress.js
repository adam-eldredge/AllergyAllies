import React, { Component, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Alerts from './Alerts.js';
//import { AnimatedCircularProgress } from 'react-native-circular-progress';
//import Carousel, { Pagination } from 'react-native-snap-carousel';
//import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
//import { faSyringe } from '@fortawesome/free-solid-svg-icons/faSyringe'
//import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar'
//import { faDroplet } from '@fortawesome/free-solid-svg-icons/faDroplet'

const Tab = createBottomTabNavigator();

export default function PatientHome({navigation}){

    //get from backend: from practice survey
    const numVials = 3;

    //create arrays for progress percentage, last injection dosage, and last injection date for each vial
    const progress = Array(numVials).fill(null);
    const dosages = Array(numVials).fill(null);
    const dates = Array(numVials).fill(null);
    const bottleNums = Array(numVials).fill(null);
    const maintenanceNums = Array(numVials).fill(null);

    //dummy values right now, get from backend
    for (let i = 0; i <= numVials; i++) {
        dosages[i] = (i+1)*.25;
        dates[i] = ('10/9/23')
        progress[i] = (i+1)*10;
        maintenanceNums[i] = i+4;
        bottleNums[i] = i+2;
      }

    const data = Array.from({ length: numVials }, (_, index) => ({
        id: index + 1,
        title: `Vial ${index + 1}`,
        progress: progress[index], //random values, get from backend
        lastInjDate: dates[index],
        maintenanceNum: maintenanceNums[index],
        bottleNum: bottleNums[index],
        lastInjDosage: dosages[index]
      }));


    const [activeSlide, setActiveSlide] = useState(0);

    const renderItem = ({ item }) => (
        <View>
        <Text style={styles.title}>{item.title}</Text>  
        <View style={styles.card}>
        <View style={{flexDirection: 'row', }}>
        {/* <AnimatedCircularProgress
            size={150}
            width={12}
            rotation={0}
            lineCap="round"
            fill={item.progress}
            tintColor="#1059d5"
            backgroundColor="#d1d1d1">
            {
                (fill) => (
                    <View>
                    <Text style = {styles.progressCircleText}>
                    { item.progress }%
                </Text>
                <Text style = {styles.progressCircleSubText}>
                    to maintenance
                </Text>
                    </View>
      
      
                )
            }
        </AnimatedCircularProgress> */}
        <View>
        <Text style={styles.lastInj}>Last injection:</Text>  





    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.icon}>
      {/* <FontAwesomeIcon icon={faCalendar} color={'#737373'} size={20}/>  */}
      </View>
      <View>
        <Text style={styles.cardSubData}>Date</Text>    
        <Text style={styles.cardData}>{item.lastInjDate}</Text>    
      </View> 
    </View>


    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
         {/* <FontAwesomeIcon icon={faSyringe} color={'#737373'} size={20}/> */}
      </View>
      <View>
        <Text style={styles.cardSubData}>Dosage</Text>    
        <Text style={styles.cardData}>{item.lastInjDosage} ml</Text>    
      </View> 
    </View>

    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
         {/* <FontAwesomeIcon icon={faDroplet} color={'#737373'} size={20}/> */}
      </View>
      <View>
        <Text style={styles.cardSubData}>Bottle #</Text>    
        <Text style={styles.cardData}>{item.bottleNum}</Text>    
      </View> 
    </View>



        

        </View>







        

        </View>

{/* 
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
      <FontAwesomeIcon icon={faDroplet} color={'#737373'} size={20}/>
      </View>
      <View>
        <Text style={styles.maintenanceSub}>Maintenance Bottle #</Text>    
        <Text style={styles.maintenanceNum}>{item.maintenanceNum}</Text>    
      </View> 
        </View> */}


    
        </View>
       

    </View>
      );

 return (
       
<ScrollView>
<View style = {styles.progressCircle}>
   {/*  <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={350}
        itemWidth={350}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
<Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        inactiveDotOpacity={0.3}
        inactiveDotScale={.8}
 /> */}
</View>


<Text style={styles.container}></Text>
<Text style = {styles.title2}>Past Appointments Attended:</Text>
<View style = {styles.pastAppointment}>
    <Text style={styles.pastAppointmentText}>Monday 9/25/2023</Text>
    <View style={styles.flags}>
        <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
    </View>
</View>
<View style = {styles.pastAppointment}>
    <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
    <View style={styles.flags}>
        <Text style={{color: 'white', backgroundColor:'#e66624', marginRight: 10}}> 12 Days Late - Dose Adjustment </Text>
    </View>
</View>
<View style = {styles.pastAppointment}>
    <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
    <View style={styles.flags}>
        <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
        <Text style={{color: 'white', backgroundColor:'#e55555', marginRight: 10}}> Adverse Reaction </Text>
    </View>
</View>
<View style = {styles.pastAppointment}>
    <Text style={styles.pastAppointmentText}>Thursday 9/14/2023</Text>
    <View style={styles.flags}>
        <Text style={{color: 'white', backgroundColor:'#498e3b', marginRight: 10}}> Attended on Time </Text>
    </View>
</View>
</ScrollView>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30
   },
    title1 :{
    paddingTop: 10,
    marginBottom: -5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    },
    title2 :{
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
    },
    compliance: {
        paddingTop: 10,
        marginBottom: -5,
        height: 200,
        width: 200,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 60,


    },
    subtitle :{
        paddingBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: '#8b8b8b',
        fontStyle: 'italic',
    },
    appointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 8,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#84aef8',
        justifyContent: 'center',
        paddingHorizontal: 20,
        textstyle:{fontsize: 60}
    },
    appointmentText: {
        fontSize: 18,
        marginVertical: 4,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center'
    },
    progressCircle:{
        alignItems: 'center',
        margin: 20,
    },
    progressCircleText:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#424242'
    },
    progressCircleSubText:{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
        color: '#424242'
    },
    pastAppointmentText: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: '500',
        marginTop: 12,
    },
    pastAppointment: {
        width: Dimensions.get('window').width - 30,
        marginLeft: 15,
        marginBottom: 10,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#d1ddf2',
        paddingLeft: 20,
        textstyle:{fontsize: 60}
    },
    maintenanceNum: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 10,
        marginLeft: 12,
        color: "#2b2b2b"
    },
    maintenanceSub: {
        fontWeight: '400',
        fontSize: 12,
        marginTop: 30,
        color: '#878787',
    },
    flags: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        //marginTop: 10,
    },
    flagText: {
        backgroundColor: 'red',
        color: 'white',
    },

    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        //elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    cardData: {
        alignSelf: 'left',
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 10,
        marginLeft: 12,
        color: "#2b2b2b"
    }, 
    cardSubData: {
        alignSelf: 'left',
        fontWeight: '400',
        fontSize: 12,
        color: '#878787',
        marginLeft: 12,
        marginTop: 8
    }, 
    lastInj: {
        alignSelf: 'left',
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 2,
        marginLeft: 20,
        color: "#2b2b2b"
    }, 
    icon: {
        marginLeft: 40,
        alignSelf: 'center',
        verticalAlign: 'center',
    },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginLeft: 10
      },
      description: {
        fontSize: 14,
        marginTop: 5,
      },
})




