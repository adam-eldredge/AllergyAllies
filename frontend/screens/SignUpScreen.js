import * as React from 'react';
import { StyleSheet, Text, Button, Header, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../App.js'


export default function SignUpScreen() {
  return (
    <AuthProvider>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Placeholder</Text>
  </View>
  </AuthProvider>
  );
  }