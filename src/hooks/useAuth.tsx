
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  companyName: string;
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // THEN hydrate existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (_loggedIn: boolean) => {
    // Kept for backward compatibility; auth state is driven by Supabase now.
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const companyName = user?.user_metadata?.company_name || '';

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!session,
      username,
      companyName,
      user,
      session,
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
