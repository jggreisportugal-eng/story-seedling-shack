import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, UserPreferences, Gender } from "@/types/user";

interface AuthContextType {
  user: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, gender: Gender, birthDate: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  savePreferences: (genres: string[]) => void;
  updateLastRead: (genreId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
