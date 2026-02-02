import React, { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth, Profile, Preferences } from "@/hooks/useSupabaseAuth";
import { User, Session } from "@supabase/supabase-js";
import { Gender } from "@/types/user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  preferences: Preferences | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdult: boolean;
  signUp: (email: string, password: string, gender: Gender, birthDate: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  savePreferences: (genres: string[]) => Promise<void>;
  updateLastRead: (genreId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSupabaseAuth();

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
