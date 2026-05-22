import {api} from './config';

export type DriverCredentials = {
  driverName: string;
  password: string;
  busName: string;
};

export async function loginDriver(
  driverName: string,
  password: string,
): Promise<void> {
  const response = await api.post('/login', {
    email: driverName.trim(),
    password,
  });
  if (response.status !== 200) {
    throw new Error('Login failed');
  }
}
