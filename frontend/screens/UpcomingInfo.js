import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Header, FlatList, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Avatar, Card, Menu, IconButton, Provider as PaperProvider } from 'react-native-paper';

export default function UpcomingInfo({navigation}){
      return (
        <View>
            <Text style={styles.container}>Notes from doctor:</Text>
            <FlatList
                data={[
                {key: 'Arrive 5-10 minutes early'},
                {key: 'Ensure all profile information is up to date'},
                {key: 'Call (XXX) xxx-xxxx with any questions'},
                ]}
                renderItem={({item}) => <Text style={{ fontSize: 18, marginLeft: 20, marginBottom: 10 }}>{`\u2022 ${item.key}`}</Text>}
            />
        <View style={styles.divider}/>
            <Text style={styles.container}>Other List 2:</Text>
            <FlatList
                data={[
                {key: 'xxx'},
                {key: 'xxx'},
                {key: 'xxx'},
                ]}
                renderItem={({item}) => <Text style={{ fontSize: 18, marginLeft: 20, marginBottom: 10 }}>{`\u2022 ${item.key}`}</Text>}
            />
        <View style={styles.divider}/>
        <Text style={styles.container}>Other List 3:</Text>
            <FlatList
                data={[
                    {key: 'xxx'},
                    {key: 'xxx'},
                    {key: 'xxx'},
                    ]}
                renderItem={({item}) => <Text style={{ fontSize: 18, marginLeft: 20, marginBottom: 10 }}>{`\u2022 ${item.key}`}</Text>}
            />
        </View>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30,
      marginLeft: 15,
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
   },
   divider : {
    marginRight: 15,
    marginLeft: 15,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#1059d5',
   }
})