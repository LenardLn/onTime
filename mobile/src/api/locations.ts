import {api} from './config';

export type LocationPayload = {
  bus_id: number;
  lat: number;
  lon: number;
  vel: number;
  tst: number;
};

export const postLocation = async (payload: LocationPayload): Promise<void> => {
  await api.post('/locations', payload);
};
