import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  approved: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null; needsApproval?: boolean; needsVerification?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Separate effect for profile fetching, only when user changes
  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then((prof) => {
        setProfile(prof);
        // Check approval after profile is loaded
        if (prof && prof.approved === false) {
          supabase.auth.signOut();
        }
      }).catch((error) => {
        setProfile(null);
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { error: error.message };
      }
      if (data.user && !data.session) {
        // User created but email not verified
        return { error: null, needsVerification: true };
      }
      if (data.user && data.session) {
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          name,
          email,
          role: 'student',
          approved: false,
        });
        if (insertError) {
          return { error: insertError.message };
        }
      }
      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign up.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Check if error is related to email verification
        if (error.message.toLowerCase().includes('email') || error.message.toLowerCase().includes('verify')) {
          return { error: 'Please check your email and verify your account before signing in.', needsVerification: true };
        }
        return { error: error.message };
      }
      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Please check your email and verify your account before signing in.', needsVerification: true };
      }
      // Profile will be fetched by the useEffect when user state updates
      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      // Silent sign out error
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
