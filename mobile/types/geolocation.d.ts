declare module '@react-native-community/geolocation' {
  export interface GeolocationResponse {
    coords: {
      latitude: number;
      longitude: number;
      speed: number | null;
    };
    timestamp: number;
  }

  interface GeolocationStatic {
    watchPosition: (
      success: (position: GeolocationResponse) => void,
      error?: (error: {message: string}) => void,
      options?: {
        enableHighAccuracy?: boolean;
        distanceFilter?: number;
        interval?: number;
        fastestInterval?: number;
        timeout?: number;
        maximumAge?: number;
      },
    ) => number;
    getCurrentPosition: (
      success: (position: GeolocationResponse) => void,
      error?: (error: {message: string}) => void,
      options?: {
        enableHighAccuracy?: boolean;
        timeout?: number;
        maximumAge?: number;
      },
    ) => void;
    clearWatch: (watchId: number) => void;
  }

  const Geolocation: GeolocationStatic;
  export default Geolocation;
}
