import * as React from 'react';
import { StyleSheet, Text, Button, Header, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function HomeScreen({navigation}){
    return (
       <View>
        <Button
        title="Alerts"
        onPress={() =>
          navigation.navigate('Alerts')
        }
      />
        <Button
        title="Login"
        onPress={() =>
          navigation.navigate('Login')
        }
      />
      <Button
        title="Portal"
        onPress={() =>
          navigation.navigate('Portal')
        }
      />
       </View> 
      
    );
  }
