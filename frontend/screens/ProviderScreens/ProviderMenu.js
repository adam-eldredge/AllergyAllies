import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper';
import AuthContext from '../../AuthContext';


const ProviderMenu = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={{ backgroundColor: '#fcfcfc', flex: 1, marginLeft: 30 }}>
      <TouchableOpacity
        style={{
          marginTop: 50,
          marginBottom: 10,
          backgroundColor: '#dc6c82',
          height: 30,
          width: 100,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => signOut()}
      >
        <Text style={{ color: 'white', size: 5, marginRight: -10, marginLeft: 12, fontWeight: 500 }}>Sign out</Text>
        <IconButton icon="exit-to-app" iconColor="white" size={14} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.providerDashboardItem, backgroundColor: '#7fd0c3', marginTop: 15 }}
        onPress={() => navigateToScreen('Portal')}
      >
        <Text style={styles.providerDashboardText}>Home</Text>
        <IconButton icon="home" iconColor="white" size={37} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.providerDashboardItem, backgroundColor: '#71a1f3' }}
        onPress={() => navigateToScreen('ViewPatients')}
      >
        <Text style={styles.providerDashboardText}>My Patients</Text>
        <IconButton icon="account-heart" iconColor="white" size={37} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.providerDashboardItem, backgroundColor: '#937fd0' }}
        onPress={() => navigateToScreen('PracticeSurvey')}
      >
        <Text style={{...styles.providerDashboardText, fontSize: 12}}>View/Edit</Text>
        <Text style={{...styles.providerDashboardText, fontSize: 12, marginTop: 10, marginBottom: -15}}>Practice Info</Text>
        <IconButton icon="pencil" iconColor="white" size={37} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.providerDashboardItem, backgroundColor: '#7fd0a1' }}
        onPress={() => navigateToScreen('Reports')}
      >
        <Text style={styles.providerDashboardText}>Reports</Text>
        <IconButton icon="file-chart" iconColor="white" size={37} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.providerDashboardItem, backgroundColor: '#6e85f4'}}
        onPress={() => navigation.navigate('AllAlerts') }>
        <Text style={styles.providerDashboardText}>Alerts</Text>
        <IconButton icon="bell-ring" iconColor="white" size={37} />
      </TouchableOpacity>
    </View>
  );
};

export default ProviderMenu;

const styles = StyleSheet.create({
    providerDashboardItem:{
        borderRadius: 8,
        height: 100,
        width: 100,
        marginBottom: 10,
        alignItems: 'center',
     },
     providerDashboardText:{
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: -10,
     },
})