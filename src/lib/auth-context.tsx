import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
  phone: string | null;
  country: string | null;
};

export type ProfileFields = Partial<Omit<Profile, "user_id">>;

export async function upsertProfile(userId: string, fields: ProfileFields) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...fields }, { onConflict: "user_id" })
    .select("user_id, first_name, last_name, email, company_name, phone, country")
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const provisioning = useRef(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email, company_name, phone, country")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProfile(data as Profile);
      } else if (!provisioning.current) {
        provisioning.current = true;
        try {
          const created = await upsertProfile(userId, { email: user?.email ?? null });
          setProfile(created);
        } finally {
          provisioning.current = false;
        }
      }
    } catch (err) {
      console.error("[auth] failed to load profile", err);
    } finally {
      setProfileLoading(false);
    }
  }, [userId, user?.email]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      user,
      isAuthenticated: !!session,
      userId,
      profile,
      profileLoading,
      refreshProfile: loadProfile,
      signOut,
    }),
    [loading, session, user, userId, profile, profileLoading, loadProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}