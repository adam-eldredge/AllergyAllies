import React, { Component, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Alerts from './Alerts.js';
import ViewAllAppointments from './ViewAllAppointments.js';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Carousel from 'react-native-reanimated-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSyringe } from '@fortawesome/free-solid-svg-icons/faSyringe'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons/faLocationCrosshairs'
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar'
import { faDroplet } from '@fortawesome/free-solid-svg-icons/faDroplet'

const Tab = createBottomTabNavigator();

export default function InjectionInfo({navigation}){

        //get from backend: from practice survey
        const numVials = 3;

        //create arrays for progress percentage, last injection dosage, and last injection date for each vial
        const progress = Array(numVials).fill(null);
        const dosages = Array(numVials).fill(null);
        const dates = Array(numVials).fill(null);
        const bottleNums = Array(numVials).fill(null);
        const maintenanceNums = Array(numVials).fill(null);
        const reactions = Array(numVials).fill(null);
    
        //dummy values right now, get from backend
        for (let i = 0; i <= numVials; i++) {
            dosages[i] = (i+1)*.25;
            dates[i] = ('10/9/23')
            progress[i] = (i+1)*10;
            maintenanceNums[i] = i+4;
            bottleNums[i] = i+2;
            reactions[i] = true;
          }
    
        const data = Array.from({ length: numVials }, (_, index) => ({
            id: index + 1,
            title: `Vial ${index + 1}`,
            progress: progress[index], 
            lastInjDate: dates[index],
            maintenanceNum: maintenanceNums[index],
            bottleNum: bottleNums[index],
            lastInjDosage: dosages[index],
            reaction: reactions[index]
          }));
    
    
          const renderDot = (index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: index === activeSlide ? 0.6 : 0.2 }, // Adjust the opacity based on activeIndex
              ]}
            />
          );
    
          const onIndexChanged = (index) => {
            setActiveSlide(index);
          };
    
    
        const [activeSlide, setActiveSlide] = useState(0);
    
        const renderItem = ({ item }) => (
            <View>


<View style = {styles.pastAppointment}>

     <View style = {styles.divider}>
     <Text style={styles.pastAppointmentText}>{item.title}</Text>
    </View>           
   

    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
         <FontAwesomeIcon icon={faSyringe} color={'#424242'} size={20}/>
      </View>
      <View>
        <Text style={styles.cardSubData}>Dosage</Text>    
        <Text style={styles.cardData}>{item.maintenanceNum} ml</Text>    
      </View> 
    </View>

    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
        <FontAwesomeIcon icon={faDroplet} color={'#424242'} size={20}/> 
      </View>
      <View>
        <Text style={styles.cardSubData}>Bottle</Text>    
        <Text style={styles.cardData}>3</Text>    
      </View> 
    </View>

    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={styles.icon}>
        <FontAwesomeIcon icon={faLocationCrosshairs} color={'#424242'} size={20}/> 
      </View>
      <View>
        <Text style={styles.cardSubData}>Location</Text>    
        <Text style={styles.cardData}>Left Arm</Text>    
      </View> 
    </View>



    
</View>



 {/* Conditionally render adverseReaction view based on the value of item.reaction */}
 {item.reaction ? (
      <View>
        <View style={styles.adverseReaction}>
          <Text style={{ color: 'white', textAlign: 'center', paddingHorizontal: 12 }}>
            Reported Adverse Reaction
          </Text>
          <View style={styles.reactionContents}>
            <Text style={{ color: '#e55555' }}>Wheal Size {'>'} 11mm</Text>
          </View>
        </View>
      </View>
    ) : null}       

       

                
</View>


          );

 return (
       
<ScrollView>


<View style = {styles.carouselItem}>

<Text style={styles.dateTitle}>Thursday 10/25/2023</Text>  
     <Carousel
        data={data}
        loop={false}
        onIndexChanged={onIndexChanged}
        renderItem={renderItem}
        width={350}
        height = {370}
        onSnapToItem={(index) => setActiveSlide(index)}
      />

<View style={styles.dotsContainer}>
        {data.map((_, index) => renderDot(index))}
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
    title :{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginLeft: 28,
        marginBottom: 2,
        marginTop: 20
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
    carouselItem:{
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
        fontWeight: '500',
        marginTop: 12,
        marginLeft: 20,
        marginBottom: 8
    },
    pastAppointment: {
        margin: 10,
        marginHorizontal: 22,
        //marginBottom: 10,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingBottom: 6,
        textstyle:{fontsize: 60},
        //shadowColor: 'black',
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.3,
        //shadowRadius: 2,
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
        marginLeft: 12,
        color: '#878787',
    },
    flags: {
        flex: 1,
        flexDirection: 'col',
        flexWrap: 'wrap',
        alignItems: 'left',
        borderRadius: 20,
        marginLeft: 22,
        margin: 10
    },
    onTime: {
        borderRadius: 6, 
        backgroundColor: '#5ba863',
        padding: 2,
        paddingHorizontal: 4,
       // marginRight: 6,
        marginBottom: 12
    },
    adverseReaction: {
        borderRadius: 8, 
        backgroundColor: '#e55555',
       // paddingHorizontal: 10,
        //paddingVertical: 5,
        //padding: 2,
        //paddingHorizontal: 4,
        //marginRight: 6,
        //marginBottom: 6,
        //paddingHorizontal: 10,
        paddingTop: 5,
        marginTop: 8,
        marginHorizontal: 22

    },
    attendedLate: {
        borderRadius: 8, 
        backgroundColor: '#ff955c',
        padding: 2,
        paddingHorizontal: 4,
        marginRight: 6,
        marginBottom: 6
    },
    reactionContents: {
        //borderRadius: 5, 
        backgroundColor: 'white',
        padding: 4,
        marginTop: 4,
        paddingHorizontal: 10,
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
    },
    flagText: {
        backgroundColor: 'red',
        color: 'white',
    },
    viewAllAppointments: {
      margin: 18,
      color: '#1059d5',
      alignSelf: 'center',
      fontSize: 17,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        paddingBottom: 10,
        margin: 4,
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
    maintenance: {
        alignSelf: 'left',
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 4,
       marginLeft: 12,
       color: '#878787',
    }, 
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -12,
        marginTop: -40
      },
      dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: 'black',
        marginHorizontal: 5,
      },
    icon: {
        marginLeft: 4,
        alignSelf: 'center',
        verticalAlign: 'center',
    },
    iconMaintenance: {
        alignSelf: 'center',
        verticalAlign: 'center',
        marginLeft: -130
    },
      description: {
        fontSize: 14,
        marginTop: 5,
      },
      divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        marginLeft: -20,
      },
      dateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginLeft: 22,
      },
})




