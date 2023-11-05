import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, Dimensions, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PatientAppointments from './PatientAppointments.js';
import PatientProfile from '../screens/PatientProfile.js';
import PatientProgress from '../screens/PatientProgress.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function PatientHome(){
      return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }
              else if (route.name === 'Progress') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              }
              else if (route.name === 'Alerts') {
                iconName = focused ? 'notifications' : 'notifications-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1059d5',
            tabBarInactiveTintColor: 'gray',
            headerShown: false
          })}
        >
<<<<<<< HEAD
        <Tab.Screen name="Home" component={PatientAppointments} />
        <Tab.Screen name="Progress" component={PatientProgress} />
        <Tab.Screen name="Alerts" component={Alerts} />
=======
        <Tab.Screen name="Appointments" component={PatientAppointments} />
        <Tab.Screen name="History" component={PatientAppointments} />
>>>>>>> 4e82c169d9e075a8582a4bd3a08d30751e9d03ec
        <Tab.Screen name="Profile" component={PatientProfile} />
        </Tab.Navigator>
      )
   }