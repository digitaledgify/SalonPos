type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): VercelResponse; json(body: any): VercelResponse };
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();

const json = (res: VercelResponse, status: number, body: unknown) => {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!supabaseUrl || !serviceRoleKey || !superAdminEmail) {
    return json(res, 500, { error: 'Server onboarding is not configured.' });
  }

  const rawAuthHeader = req.headers.authorization;
  const authHeader = Array.isArray(rawAuthHeader) ? rawAuthHeader[0] : rawAuthHeader;
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!accessToken) return json(res, 401, { error: 'You must be signed in as Super Admin.' });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authUser, error: authError } = await admin.auth.getUser(accessToken);
  if (authError || !authUser.user) return json(res, 401, { error: 'Invalid or expired session.' });
  if ((authUser.user.email || '').trim().toLowerCase() !== superAdminEmail) {
    return json(res, 403, { error: 'Only the Super Admin can onboard a new salon.' });
  }

  const {
    salonName,
    salonCode,
    ownerName,
    email,
    phone = '',
    address = '',
    city = '',
    password,
    subscriptionPlan = 'Trial',
    subscriptionStatus = 'Trial',
    subscriptionStartDate = new Date().toISOString().slice(0, 10),
    subscriptionExpiryDate = null,
    subscriptionAmount = 0,
    nextRenewalDate = null,
  } = req.body || {};

  const cleanName = String(salonName || '').trim();
  const cleanCode = String(salonCode || '').trim().toUpperCase();
  const cleanOwner = String(ownerName || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');
  const cleanSubscriptionPlan = String(subscriptionPlan || 'Trial').trim().slice(0, 40) || 'Trial';
  const allowedSubscriptionStatuses = new Set(['Trial', 'Active', 'Expired', 'Cancelled']);
  const cleanSubscriptionStatus = String(subscriptionStatus || 'Trial');
  const cleanSubscriptionAmount = Number(subscriptionAmount);
  const cleanSubscriptionStartDate = subscriptionStartDate ? String(subscriptionStartDate) : null;
  const cleanSubscriptionExpiryDate = subscriptionExpiryDate ? String(subscriptionExpiryDate) : null;
  const cleanNextRenewalDate = nextRenewalDate ? String(nextRenewalDate) : null;

  if (!allowedSubscriptionStatuses.has(cleanSubscriptionStatus)) return json(res, 400, { error: 'Invalid subscription status.' });
  if (!Number.isFinite(cleanSubscriptionAmount) || cleanSubscriptionAmount < 0) return json(res, 400, { error: 'Subscription amount must be a non-negative number.' });
  for (const [label, value] of [['start', cleanSubscriptionStartDate], ['expiry', cleanSubscriptionExpiryDate], ['renewal', cleanNextRenewalDate]] as const) {
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return json(res, 400, { error: `Subscription ${label} date must be YYYY-MM-DD.` });
  }

  if (!cleanName || !cleanCode || !cleanOwner || !cleanEmail || cleanPassword.length < 6) {
    return json(res, 400, { error: 'Salon name, salon code, admin name, email and a password of at least 6 characters are required.' });
  }

  if (!/^[A-Z0-9_-]{3,20}$/.test(cleanCode)) {
    return json(res, 400, { error: 'Salon code must be 3–20 characters using letters, numbers, hyphens or underscores.' });
  }

  const { data: existingSalon } = await admin.from('salons').select('id').eq('code', cleanCode).maybeSingle();
  if (existingSalon) return json(res, 409, { error: 'That salon code is already in use.' });

  const { data: existingProfile } = await admin.from('profiles').select('id').eq('email', cleanEmail).maybeSingle();
  if (existingProfile) return json(res, 409, { error: 'That admin email is already assigned to a Salon POS user.' });

  const loginId = `${cleanCode}-ADM01`;

  const { data: existingLogin } = await admin.from('profiles').select('id').eq('login_id', loginId).maybeSingle();
  if (existingLogin) return json(res, 409, { error: 'The generated Admin User ID is already in use. Change the salon code.' });

  const { data: newAuth, error: createUserError } = await admin.auth.admin.createUser({
    email: cleanEmail,
    password: cleanPassword,
    email_confirm: true,
    user_metadata: { name: cleanOwner, salon_code: cleanCode },
  });

  if (createUserError || !newAuth.user) {
    return json(res, 400, { error: createUserError?.message || 'Could not create the Admin login.' });
  }

  const { data: salon, error: salonError } = await admin
    .from('salons')
    .insert({
      name: cleanName,
      code: cleanCode,
      address: String(address || '').trim(),
      city: String(city || '').trim(),
      phone: String(phone || '').trim(),
      email: cleanEmail,
      status: 'Active',
      subscription_plan: cleanSubscriptionPlan,
      subscription_status: cleanSubscriptionStatus,
      subscription_start_date: cleanSubscriptionStartDate,
      subscription_expiry_date: cleanSubscriptionExpiryDate,
      subscription_amount: cleanSubscriptionAmount,
      next_renewal_date: cleanNextRenewalDate,
    })
    .select('*')
    .single();

  if (salonError || !salon) {
    await admin.auth.admin.deleteUser(newAuth.user.id);
    return json(res, 400, { error: salonError?.message || 'Could not create the salon.' });
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: newAuth.user.id,
    salon_id: salon.id,
    name: cleanOwner,
    email: cleanEmail,
    login_id: loginId,
    role: 'Admin',
    designation: 'Salon Admin',
    phone: String(phone || '').trim(),
  });

  if (profileError) {
    await admin.from('salons').delete().eq('id', salon.id);
    await admin.auth.admin.deleteUser(newAuth.user.id);
    return json(res, 400, { error: profileError.message });
  }

  return json(res, 200, {
    success: true,
    salon: { id: salon.id, name: salon.name, code: salon.code },
    admin: { userId: loginId, email: cleanEmail, name: cleanOwner },
  });
}
