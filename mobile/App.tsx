import {useState} from 'react';
import {StatusBar} from 'react-native';
import {DriverCredentials} from './src/api/auth';
import {LoginScreen} from './src/screens/loginScreen';
import {TrackingScreen} from './src/screens/trackingScreen';

const App = () => {
  const [credentials, setCredentials] = useState<DriverCredentials | null>(null);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {credentials ? (
        <TrackingScreen
          credentials={credentials}
          onLogout={() => setCredentials(null)}
        />
      ) : (
        <LoginScreen onSuccess={setCredentials} />
      )}
    </>
  );
}

export default App;
