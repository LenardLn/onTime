import {api} from './config';

export type LocationPayload = {
  lat: number;
  lon: number;
  tst: number;
  vel: number;
  topic: string;
};

export async function postLocation(payload: LocationPayload): Promise<void> {
  await api.post('/locations', payload);
}

export function buildTopic(driverName: string, busName: string): string {
  const driver = encodeURIComponent(driverName.trim());
  const bus = encodeURIComponent(busName.trim());
  return `owntracks/${driver}/${bus}`;
}
