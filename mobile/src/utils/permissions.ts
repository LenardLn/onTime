import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    // iOS: trigger the "When In Use" authorization prompt. The actual fix
    // (getCurrentPosition) will surface an error if the user denies it.
    Geolocation.requestAuthorization();
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'OnTime needs access to your location to track the bus.',
      buttonPositive: 'OK',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
