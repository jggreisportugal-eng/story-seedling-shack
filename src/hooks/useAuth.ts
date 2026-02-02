import { useState, useEffect, useCallback } from "react";
import { User, UserPreferences, Gender } from "@/types/user";

const USER_STORAGE_KEY = "storytelling_user";
const PREFERENCES_STORAGE_KEY = "storytelling_preferences";

const generateId = () => Math.random().toString(36).substring(2, 15);

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(
    (email: string, password: string, gender: Gender, birthDate: string): { success: boolean; error?: string } => {
      const age = calculateAge(birthDate);
      
      if (age < 18) {
        return { success: false, error: "Tem de ter pelo menos 18 anos para se registar." };
      }

      const newUser: User = {
        id: generateId(),
        email,
        gender,
        birthDate,
        createdAt: new Date().toISOString(),
        isAdult: age >= 18,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      // Store password hash simulation (in real app, never store plain passwords)
      localStorage.setItem(`${USER_STORAGE_KEY}_auth`, btoa(password));
      
      setUser(newUser);
      return { success: true };
    },
    []
  );

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedAuth = localStorage.getItem(`${USER_STORAGE_KEY}_auth`);

      if (!storedUser || !storedAuth) {
        return { success: false, error: "Conta não encontrada. Por favor, crie uma conta." };
      }

      const user = JSON.parse(storedUser) as User;
      const storedPassword = atob(storedAuth);

      if (user.email !== email) {
        return { success: false, error: "Email não encontrado." };
      }

      if (storedPassword !== password) {
        return { success: false, error: "Palavra-passe incorreta." };
      }

      // Recalculate adult status on login
      const age = calculateAge(user.birthDate);
      user.isAdult = age >= 18;
      
      setUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setPreferences(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(`${USER_STORAGE_KEY}_auth`);
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  }, []);

  const savePreferences = useCallback(
    (genres: string[]) => {
      if (!user) return;

      const newPrefs: UserPreferences = {
        userId: user.id,
        favoriteGenres: genres,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(newPrefs));
      setPreferences(newPrefs);
    },
    [user]
  );

  const updateLastRead = useCallback(
    (genreId: string) => {
      if (!user || !preferences) return;

      const updatedPrefs: UserPreferences = {
        ...preferences,
        lastRead: genreId,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updatedPrefs));
      setPreferences(updatedPrefs);
    },
    [user, preferences]
  );

  return {
    user,
    preferences,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    savePreferences,
    updateLastRead,
  };
};
