import * as React from 'react';
import { StyleSheet, Text, Button, Header, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Portal from './Portal.js';
import Alerts from './Alerts.js';


export default function HomeScreen({navigation}){
    return (
       <View>
        <Button
        title="Alerts"
        color="#1059d5"
        onPress={() =>
          navigation.navigate('Alerts')
        }
      />
      <Button
        title="Portal"
        color="#1059d5"
        onPress={() =>
          navigation.navigate('Portal')
        }
      />
       </View> 
      
    );
  }
