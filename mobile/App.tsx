import {useState} from 'react';
import {StatusBar} from 'react-native';
import {DriverCredentials} from './src/api/auth';
import {setAuthToken} from './src/api/config';
import {LoginScreen} from './src/screens/loginScreen';
import {TrackingScreen} from './src/screens/trackingScreen';

const App = () => {
  const [credentials, setCredentials] = useState<DriverCredentials | null>(null);

  const handleLogout = () => {
    setAuthToken(null);
    setCredentials(null);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {credentials ? (
        <TrackingScreen credentials={credentials} onLogout={handleLogout} />
      ) : (
        <LoginScreen onSuccess={setCredentials} />
      )}
    </>
  );
}

export default App;
