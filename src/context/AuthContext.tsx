import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, supabaseInviteClient } from '../lib/supabaseClient';
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
  // Brand new salon owner signing up — creates the salon AND the first Admin profile
  signUpNewSalon: (params: {
    salonName: string;
    salonCode: string;
    adminName: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  // Admin creates a login for a Reception or Stylist staff member in their own salon
  inviteStaff: (params: {
    name: string;
    email: string;
    password: string;
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
    email,
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

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  };

  const signUpNewSalon: AuthContextType['signUpNewSalon'] = async ({
    salonName,
    salonCode,
    adminName,
    email,
    password,
  }) => {
    setAuthError(null);

    // 1. Create the salon record first
    const { data: newSalon, error: salonErr } = await supabase
      .from('salons')
      .insert({ name: salonName, code: salonCode })
      .select()
      .single();

    if (salonErr || !newSalon) {
      setAuthError(salonErr?.message || 'Could not create salon. The salon code may already be taken.');
      return false;
    }

    // 2. Create the auth user
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpErr || !signUpData.user) {
      setAuthError(signUpErr?.message || 'Could not create account.');
      return false;
    }

    // 3. Create the Admin profile, linked to both the new user and the new salon
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: signUpData.user.id,
      salon_id: newSalon.id,
      name: adminName,
      role: 'Admin',
      designation: 'Salon Owner / Admin',
    });

    if (profileErr) {
      setAuthError(profileErr.message);
      return false;
    }

    return true;
  };

  const inviteStaff: AuthContextType['inviteStaff'] = async ({ name, email, password, role, designation }) => {
    if (!profile || profile.role !== 'Admin') {
      return { success: false, error: 'Only an Admin can add staff.' };
    }

    // 1. Create the new login using the ISOLATED invite client, so this
    //    never touches the Admin's own active session.
    const { data: signUpData, error: signUpErr } = await supabaseInviteClient.auth.signUp({
      email,
      password,
    });

    if (signUpErr || !signUpData.user) {
      return { success: false, error: signUpErr?.message || 'Could not create staff login.' };
    }

    // 2. Insert their profile using the ADMIN's own authenticated client,
    //    so it satisfies the "Admins can add staff to their own salon" RLS policy.
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: signUpData.user.id,
      salon_id: profile.salonId,
      name,
      role,
      designation,
    });

    if (profileErr) {
      return { success: false, error: profileErr.message };
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
        signUpNewSalon,
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
