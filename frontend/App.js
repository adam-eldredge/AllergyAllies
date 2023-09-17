import { StyleSheet, Text, View } from 'react-native';
import LogIn from './components/LogIn.js';
import Portal from './components/Portal.js';
import Alerts from './components/Alerts.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Alerts />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
