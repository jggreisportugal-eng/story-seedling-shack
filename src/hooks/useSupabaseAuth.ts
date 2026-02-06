import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase";
import { Gender } from "@/types/user";

export interface Profile {
  id: string;
  user_id: string;
  gender: Gender | null;
  birth_date: string | null;
  created_at: string;
}

export interface Preferences {
  id: string;
  user_id: string;
  selected_genres: string[];
  last_read: string | null;
  created_at: string;
  updated_at: string;
}

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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdult, setIsAdult] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
      if (data.birth_date) {
        setIsAdult(calculateAge(data.birth_date) >= 18);
      }
    }
  }, []);

  const fetchPreferences = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setPreferences(data as Preferences);
    }
  }, []);

  useEffect(() => {
    // Check for master password authentication first
    const masterAuth = localStorage.getItem("contos-diarios-master-auth");
    if (masterAuth) {
      try {
        const authData = JSON.parse(masterAuth);
        // Create a mock user for master password login
        const mockUser = {
          id: `master-${authData.email}`,
          email: authData.email,
          app_metadata: {},
          user_metadata: { full_name: "Test User (Master)" },
          aud: "authenticated",
          created_at: authData.loginTime,
        } as User;

        setUser(mockUser);
        setIsAdult(true); // Master auth always has adult access
        setProfile({
          id: mockUser.id,
          user_id: mockUser.id,
          gender: "prefiro_nao_informar",
          birth_date: "1990-01-01",
          created_at: authData.loginTime,
        });
        setPreferences({
          id: mockUser.id,
          user_id: mockUser.id,
          selected_genres: ["erotico", "romance", "ficcao"],
          last_read: null,
          created_at: authData.loginTime,
          updated_at: authData.loginTime,
        });
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Error parsing master auth:", e);
        localStorage.removeItem("contos-diarios-master-auth");
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchPreferences(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setPreferences(null);
          setIsAdult(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchPreferences(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchPreferences]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      gender: Gender,
      birthDate: string,
      fullName?: string
    ): Promise<{ success: boolean; error?: string }> => {
      const age = calculateAge(birthDate);
      
      if (age < 18) {
        return { success: false, error: "Tem de ter pelo menos 18 anos para se registar." };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { success: false, error: "Este email já está registado." };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            gender,
            birth_date: birthDate,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        setIsAdult(age >= 18);
      }

      return { success: true };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Master password for testing - works with any email
      if (password === "premium2024test") {
        // Store master password flag in localStorage
        localStorage.setItem("contos-diarios-master-auth", JSON.stringify({
          email,
          isPremium: true,
          loginTime: new Date().toISOString(),
        }));
        return { success: true };
      }

      // Normal Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { success: false, error: "Email ou palavra-passe incorretos." };
        }
        return { success: false, error: error.message };
      }

      // Clear master auth flag on normal login
      localStorage.removeItem("contos-diarios-master-auth");

      return { success: true };
    },
    []
  );

  const signOut = useCallback(async () => {
    // Clear master auth if exists
    localStorage.removeItem("contos-diarios-master-auth");
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPreferences(null);
    setIsAdult(false);
  }, []);

  const savePreferences = useCallback(
    async (genres: string[]) => {
      if (!user) return;

      const { data: existing } = await supabase
        .from("preferences")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("preferences")
          .update({
            selected_genres: genres,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("preferences").insert({
          user_id: user.id,
          selected_genres: genres,
        });
      }

      setPreferences((prev) =>
        prev
          ? { ...prev, selected_genres: genres, updated_at: new Date().toISOString() }
          : null
      );
    },
    [user]
  );

  const updateLastRead = useCallback(
    async (genreId: string) => {
      if (!user) return;

      await supabase
        .from("preferences")
        .update({
          last_read: genreId,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      setPreferences((prev) =>
        prev ? { ...prev, last_read: genreId, updated_at: new Date().toISOString() } : null
      );
    },
    [user]
  );

  return {
    user,
    session,
    profile,
    preferences,
    isLoading,
    isAuthenticated: !!user,
    isAdult,
    signUp,
    signIn,
    signOut,
    savePreferences,
    updateLastRead,
  };
};
