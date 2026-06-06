import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {loginDriver, DriverCredentials} from '../api/auth';

type Props = {
  onSuccess: (credentials: DriverCredentials) => void;
};

export const LoginScreen = ({onSuccess}: Props) => {
  const [driverName, setDriverName] = useState('');
  const [password, setPassword] = useState('');
  const [busName, setBusName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const trimmedDriver = driverName.trim();
    const trimmedBus = busName.trim();

    if (!trimmedDriver || !password || !trimmedBus) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const {bus, token} = await loginDriver(trimmedDriver, password, trimmedBus);
      onSuccess({
        driverName: trimmedDriver,
        busName: trimmedBus,
        busId: bus.id,
        lineId: bus.line_id,
        token,
      });
    } catch {
      setError('Invalid credentials or unknown bus. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>OnTime Driver</Text>
      <Text style={styles.subtitle}>Sign in to start tracking</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Bus Driver Name</Text>
        <TextInput
          style={styles.input}
          value={driverName}
          onChangeText={setDriverName}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="driver@example.com"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bus Name</Text>
        <TextInput
          style={styles.input}
          value={busName}
          onChangeText={setBusName}
          autoCapitalize="words"
          placeholder="Bus 42"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Start tracking</Text>
        )}
      </Pressable>

      <Text style={styles.hint}>
        Driver name must match the email registered in the admin system.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 32,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
  },
  error: {
    color: '#f87171',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
