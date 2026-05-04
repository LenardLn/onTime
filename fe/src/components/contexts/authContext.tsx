import React, { createContext, useContext, useState, useEffect } from "react";
import { me } from "@/apis/auth.api";
import type { Profile } from "@/entities/user";

type AuthContext = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile?: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  profile: undefined,
  setProfile: () => {},
  loading: true,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await me();
        setProfile(user);
        setIsAuthenticated(true);
      } catch {
        setProfile(undefined);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within provider");
  return context;
};
