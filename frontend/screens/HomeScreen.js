import * as React from 'react';
import { StyleSheet, Text, Button, Header, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Portal from './Portal.js';
import Alerts from './Alerts.js';
import AuthContext from '../AuthContext';
import { useMemo, useReducer, useEffect, useContext } from 'react';

export default function HomeScreen({navigation}){

  const { signOut } = useContext(AuthContext);

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
      <Button
        title="Patient Home"
        color="#1059d5"
        onPress={() =>
          navigation.navigate('PatientHome')
        }
      />
      <Button
       title="Sign out"
       color="#1059d5"
       onPress={signOut} 
       />
       </View> 
    );
  }
