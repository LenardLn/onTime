import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {DriverCredentials} from './src/api/auth';
import {LoginScreen} from './src/screens/LoginScreen';
import {TrackingScreen} from './src/screens/TrackingScreen';

function App() {
  const [credentials, setCredentials] = useState<DriverCredentials | null>(
    null,
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {credentials ? (
        <TrackingScreen
          credentials={credentials}
          onLogout={() => setCredentials(null)}
        />
      ) : (
        <LoginScreen onSuccess={setCredentials} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

export default App;
