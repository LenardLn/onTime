import { createContext, useContext, type ReactNode } from "react";

import useUserLocation, { type UserLocation } from "@/hooks/useUserLocation";

type UserLocationContextValue = {
  location: UserLocation | null;
  enabled: boolean;
  error: string | null;
  enable: () => void;
  toggle: () => void;
};

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

/**
 * Shares one geolocation tracker across the public layout so the header toggle
 * and the map (in the routed page) drive the same location state.
 */
export const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const value = useUserLocation();
  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocationContext = () => {
  const ctx = useContext(UserLocationContext);
  if (!ctx) {
    throw new Error(
      "useUserLocationContext must be used within a UserLocationProvider",
    );
  }
  return ctx;
};
