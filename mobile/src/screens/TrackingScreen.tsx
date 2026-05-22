import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {DriverCredentials} from '../api/auth';
import {useLocationTracker} from '../hooks/useLocationTracker';
import {requestLocationPermission} from '../utils/permissions';

type Props = {
  credentials: DriverCredentials;
  onLogout: () => void;
};

export function TrackingScreen({credentials, onLogout}: Props) {
  const [status, setStatus] = useState('Requesting location permission…');
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [trackerError, setTrackerError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) {
        setPermissionGranted(true);
        setStatus('Waiting for GPS…');
      } else {
        setTrackerError('Location permission denied.');
        setStatus('Cannot track without location');
      }
    });
  }, []);

  useLocationTracker({
    driverName: credentials.driverName,
    busName: credentials.busName,
    enabled: permissionGranted,
    onError: message => {
      setTrackerError(message);
      setStatus('Error sending location');
    },
    onSent: () => {
      setTrackerError(null);
      setStatus('Tracking active');
      setLastSent(new Date().toLocaleTimeString());
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking</Text>
      <Text style={styles.driver}>{credentials.driverName}</Text>
      <Text style={styles.bus}>Bus: {credentials.busName}</Text>

      <View style={styles.card}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.status}>{status}</Text>
        {lastSent ? (
          <Text style={styles.meta}>Last update sent at {lastSent}</Text>
        ) : null}
        {trackerError ? (
          <Text style={styles.error}>{trackerError}</Text>
        ) : null}
        <Text style={styles.meta}>
          Location is sent when the bus moves at least 10 meters (lat, lon,
          time, speed).
        </Text>
      </View>

      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  driver: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  bus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 12,
    lineHeight: 18,
  },
  error: {
    fontSize: 13,
    color: '#f87171',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
});
