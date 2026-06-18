export type LiveBus = {
  bus_id: number;
  bus_name: string;
  line_id: number;
  lat: number;
  lon: number;
  vel: number;
  time: string;
};

export type ClosestBus = {
  bus_id: number;
  bus_name: string;
  lat: number;
  lon: number;
  distance_m: number;
  eta_seconds: number;
  heading_known: boolean;
};

export type ClosestBusResponse = {
  bus: ClosestBus | null;
};
