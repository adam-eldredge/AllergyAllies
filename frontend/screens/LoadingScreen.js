import * as React from 'react';
import {Text, TextInput, View, Button, ActivityIndicator, StyleSheet,} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function LoadingScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
    );
  }