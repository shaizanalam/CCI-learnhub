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
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      console.log('Profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      console.log('User changed, fetching profile');
      fetchProfile(user.id).then((prof) => {
        console.log('Profile loaded:', prof);
        setProfile(prof);
        // Check approval after profile is loaded
        if (prof && prof.approved === false) {
          console.log('User not approved, signing out');
          supabase.auth.signOut();
        }
      }).catch((error) => {
        console.error('Error loading profile:', error);
        setProfile(null);
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Signing up:', email);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message };
      }
      if (data.user && !data.session) {
        // User created but email not verified
        console.log('User created, email verification needed');
        return { error: null, needsVerification: true };
      }
      if (data.user && data.session) {
        console.log('Inserting user profile');
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          name,
          email,
          role: 'student',
          approved: false,
        });
        if (insertError) {
          console.error('Insert error:', insertError);
          return { error: insertError.message };
        }
        console.log('User profile inserted');
      }
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: 'An unexpected error occurred during sign up.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Signing in:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        // Check if error is related to email verification
        if (error.message.toLowerCase().includes('email') || error.message.toLowerCase().includes('verify')) {
          return { error: 'Please check your email and verify your account before signing in.', needsVerification: true };
        }
        return { error: error.message };
      }
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email not confirmed');
        return { error: 'Please check your email and verify your account before signing in.', needsVerification: true };
      }
      console.log('Sign in successful, user:', data.user?.id);
      // Profile will be fetched by the useEffect when user state updates
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: 'An unexpected error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
