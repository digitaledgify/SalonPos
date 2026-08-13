// Supabase Edge Function: invite-staff
//
// Runs server-side, so it's the only safe place to use the service_role
// key. It:
//   1. Verifies the caller is a logged-in Admin (using their own JWT,
//      respecting Row Level Security — never trusting the client blindly)
//   2. Uses the service_role key to create the new auth user AND send
//      Supabase's built-in invite email (magic link to set a password)
//   3. Inserts their profile row, linked to the Admin's salon
//
// Deploy with:  supabase functions deploy invite-staff
// SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are
// automatically available as env vars inside every Edge Function —
// no manual secret setup needed for these three.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, role, designation } = await req.json();

    if (!name || !email || !role) {
      return json({ error: 'Missing required fields: name, email, role.' }, 400);
    }
    if (!['Admin', 'Reception', 'Stylist'].includes(role)) {
      return json({ error: 'Invalid role.' }, 400);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Missing Authorization header.' }, 401);
    }

    // Client scoped to the CALLER's own JWT — this respects Row Level
    // Security, so it can only ever see the caller's own profile/salon.
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user: callerUser },
      error: callerErr,
    } = await callerClient.auth.getUser();

    if (callerErr || !callerUser) {
      return json({ error: 'Invalid or expired session.' }, 401);
    }

    const { data: callerProfile, error: callerProfileErr } = await callerClient
      .from('profiles')
      .select('salon_id, role')
      .eq('id', callerUser.id)
      .single();

    if (callerProfileErr || !callerProfile) {
      return json({ error: 'Could not verify your salon.' }, 403);
    }

    if (callerProfile.role !== 'Admin') {
      return json({ error: 'Only an Admin can invite staff.' }, 403);
    }

    // Service-role client — bypasses RLS. Only used here, server-side,
    // and only after we've already verified the caller is a real Admin.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Creates the auth user AND sends Supabase's built-in invite email
    // (a magic link where the new staff member sets their own password).
    const { data: inviteData, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { data: { name, role } }
    );

    if (inviteErr || !inviteData.user) {
      return json({ error: inviteErr?.message || 'Could not send invite email.' }, 400);
    }

    const { error: insertErr } = await adminClient.from('profiles').insert({
      id: inviteData.user.id,
      salon_id: callerProfile.salon_id,
      name,
      role,
      designation: designation || role,
    });

    if (insertErr) {
      return json({ error: insertErr.message }, 400);
    }

    return json({ success: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unexpected error.' }, 500);
  }
});
