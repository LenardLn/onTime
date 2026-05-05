export const appPaths = {
  admin: "/admin",
  adminLines: "/admin/lines",
  adminLineDetails: (lineId: number | string) => `/admin/lines/${lineId}`,
  adminProfile: "/admin/profile",
  adminRegister: "/admin/register",
  adminDashboard: "/admin/dashboard",
  adminRoutes: "/admin/routes",
  adminRouteDetails: (id: number | string) => `/admin/routes/${id}`,
  adminStations: "/admin/stations",
  adminStationDetails: (stationId: number | string) =>
    `/admin/stations/${stationId}`,
} as const;

export type AppPaths = (typeof appPaths)[keyof typeof appPaths];
