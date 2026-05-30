import {api} from './config';

export type Bus = {
  id: number;
  name: string;
  line_id: number;
};

export type DriverCredentials = {
  driverName: string;
  password: string;
  busName: string;
  busId: number;
  lineId: number;
};

type LoginResponse = {
  status: string;
  bus: Bus;
};

export const loginDriver = async (
  driverName: string,
  password: string,
  busName: string,
): Promise<Bus> => {
  const response = await api.post<LoginResponse>('/login', {
    email: driverName.trim(),
    password,
    bus_name: busName.trim(),
  });
  if (response.status !== 200 || !response.data?.bus) {
    throw new Error('Login failed');
  }
  return response.data.bus;
}
