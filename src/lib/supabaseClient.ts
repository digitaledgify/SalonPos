import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// A SEPARATE client instance, used only for creating new staff accounts.
// Supabase's signUp() call normally replaces the CURRENT session with the
// newly created user's session — which would silently log the Admin out
// mid-invite. Using a second client with persistSession/autoRefreshToken
// disabled means the new-user session it creates stays isolated in memory
// on this client only, and never touches the Admin's real session.
export const supabaseInviteClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
