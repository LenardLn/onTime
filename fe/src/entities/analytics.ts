export type AnalyticsSummary = {
  routes: number;
  buses: number;
  records: number;
  total_distance_km: number;
  avg_speed: number;
  max_speed: number;
  median_speed: number;
  busiest_route: { line_name: string; records: number } | null;
  busiest_hour: { hour: number; records: number } | null;
  fastest_bus: { bus_id: number; bus_name: string; avg_speed: number } | null;
};

export type AnalyticsMetrics = {
  route_usage: { line_name: string; records: number }[];
  buses_per_route: { line_name: string; bus_count: number }[];
  route_activity_share: {
    line_name: string;
    records: number;
    percentage: number;
  }[];
  speed_by_route: { line_name: string; avg_speed: number }[];
  speed_by_hour: { hour: number; avg_speed: number }[];
  speed_by_period: { period: string; avg_speed: number }[];
  distance_by_route: { line_name: string; distance_km: number }[];
  top_buses_by_distance: { bus_name: string; distance_km: number }[];
  top_active_buses: { bus_id: number; bus_name: string; records: number }[];
  activity_by_hour: { hour: number; records: number }[];
  activity_by_weekday: { weekday: string; records: number }[];
  active_buses_by_hour: { hour: number; active_buses: number }[];
  eta_predictions: {
    bus_id: number;
    bus_name: string;
    line_id: number;
    nearest_station: string;
    speed: number;
    eta_minutes: number | null;
  }[];
};

export type AnalyticsMetricKey = keyof AnalyticsMetrics;

export type AnalyticsOverview = {
  summary: AnalyticsSummary;
  metrics: AnalyticsMetrics;
};
