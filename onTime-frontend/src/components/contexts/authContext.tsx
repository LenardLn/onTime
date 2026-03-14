import React, { createContext, useContext, useState } from "react";

type Profile = {
    email: string
    id: string
}

type AuthContext = {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    isAuthenticated: boolean
    setProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>,
    profile: Profile | undefined,
}

const AuthContext = createContext<AuthContext>({
    setIsAuthenticated: () => { },
    isAuthenticated: false,
    setProfile: () => { },
    profile: undefined,
});


export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profile, setProfile] = useState<Profile | undefined>(undefined);

    return (
        <AuthContext.Provider value={{ setIsAuthenticated, isAuthenticated, setProfile, profile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};