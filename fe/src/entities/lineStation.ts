export type LineStation = {
  id: number;
  line_id: number;
  station_id: number;
  order_index: number;
  line_name?: string | null;
  station_name?: string | null;
};

export type LineStationList = {
  line_stations: LineStation[];
};

export type CreateLineStationPayload = {
  station_id: number;
  line_id: number;
  order_index?: number;
};
