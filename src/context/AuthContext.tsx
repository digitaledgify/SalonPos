import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../types';

export interface Profile {
  id: string;
  salonId: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  phone: string;
  avatarUrl: string;
}

export interface Salon {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  currencySymbol: string;
  taxRatePercent: number;
}

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  salon: Salon | null;
  loading: boolean;
  authError: string | null;
  // Existing salon staff logging in
  signIn: (email: string, password: string) => Promise<boolean>;
  // Admin creates a login for a Reception or Stylist staff member in their own salon
  inviteStaff: (params: {
    name: string;
    email: string;
    role: UserRole;
    designation: string;
  }) => Promise<{ success: boolean; error?: string }>;
  fetchSalonStaff: () => Promise<Profile[]>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileRow(row: any, email: string): Profile {
  return {
    id: row.id,
    salonId: row.salon_id,
    name: row.name,
    email: row.email || email,
    role: row.role,
    designation: row.designation ?? '',
    phone: row.phone ?? '',
    avatarUrl: row.avatar_url ?? '',
  };
}

function mapSalonRow(row: any): Salon {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    address: row.address ?? '',
    city: row.city ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    currencySymbol: row.currency_symbol ?? '₹',
    taxRatePercent: row.tax_rate_percent ?? 18,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadProfileAndSalon = async (userId: string, email: string) => {
    // The Super Admin is a platform-level account and intentionally has no
    // salon/profile row. Do not query public.profiles for this account.
    const configuredSuperAdmin = (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
    if (configuredSuperAdmin && email.trim().toLowerCase() === configuredSuperAdmin) {
      setProfile(null);
      setSalon(null);
      return;
    }

    const { data: profileRow, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profileRow) {
      setProfile(null);
      setSalon(null);
      return;
    }

    setProfile(mapProfileRow(profileRow, email));

    const { data: salonRow, error: salonErr } = await supabase
      .from('salons')
      .select('*')
      .eq('id', profileRow.salon_id)
      .single();

    if (!salonErr && salonRow) {
      setSalon(mapSalonRow(salonRow));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession?.user) {
        loadProfileAndSalon(activeSession.user.id, activeSession.user.email ?? '').finally(() =>
          setLoading(false)
        );
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadProfileAndSalon(newSession.user.id, newSession.user.email ?? '');
      } else {
        setProfile(null);
        setSalon(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (login: string, password: string): Promise<boolean> => {
    setAuthError(null);
    let email = login.trim().toLowerCase();

    if (!email.includes('@')) {
      try {
        const response = await fetch('/api/resolve-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: login.trim() }),
        });
        const data = await response.json();
        if (!response.ok || !data.email) {
          setAuthError(data.error || 'User ID not found.');
          return false;
        }
        email = data.email;
      } catch {
        setAuthError('Could not resolve the User ID. Please try your email address.');
        return false;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  };

  const inviteStaff: AuthContextType['inviteStaff'] = async ({ name, email, role, designation }) => {
    if (!profile || profile.role !== 'Admin') {
      return { success: false, error: 'Only an Admin can add staff.' };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      return { success: false, error: 'Your session expired — please sign in again.' };
    }

    const { data, error } = await supabase.functions.invoke('invite-staff', {
      body: { name, email, role, designation },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (error) {
      return { success: false, error: error.message || 'Could not send invite.' };
    }
    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { success: true };
  };

  const fetchSalonStaff = async (): Promise<Profile[]> => {
    if (!profile) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('salon_id', profile.salonId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data.map((row: any) => mapProfileRow(row, ''));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSalon(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        salon,
        loading,
        authError,
        signIn,
        inviteStaff,
        fetchSalonStaff,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
