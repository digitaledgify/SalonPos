type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any; query?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): VercelResponse; json(body: any): VercelResponse };
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();

const json = (res: VercelResponse, status: number, body: unknown) => {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
};

const getBearerToken = (req: VercelRequest) => {
  const raw = req.headers.authorization;
  const header = Array.isArray(raw) ? raw[0] : raw;
  return header?.startsWith('Bearer ') ? header.slice(7) : '';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!['GET', 'PATCH', 'POST'].includes(req.method || '')) return json(res, 405, { error: 'Method not allowed.' });
  if (!supabaseUrl || !serviceRoleKey || !superAdminEmail) {
    return json(res, 500, { error: 'Super Admin salon management is not configured on the server.' });
  }

  const accessToken = getBearerToken(req);
  if (!accessToken) return json(res, 401, { error: 'You must be signed in as Super Admin.' });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authUser, error: authError } = await admin.auth.getUser(accessToken);
  if (authError || !authUser.user) return json(res, 401, { error: 'Invalid or expired session.' });
  if ((authUser.user.email || '').trim().toLowerCase() !== superAdminEmail) {
    return json(res, 403, { error: 'Only the Super Admin can manage salons.' });
  }

  if (req.method === 'POST') {
    const action = String(req.body?.action || '').trim();
    const salonId = String(req.body?.salonId || '').trim();
    const newPassword = String(req.body?.newPassword || '');

    if (action !== 'reset-admin-password') return json(res, 400, { error: 'Unsupported action.' });
    if (!salonId) return json(res, 400, { error: 'Salon ID is required.' });
    if (newPassword.length < 6) return json(res, 400, { error: 'Password must be at least 6 characters.' });
    if (newPassword.length > 72) return json(res, 400, { error: 'Password must be 72 characters or fewer.' });

    const { data: salon, error: salonError } = await admin
      .from('salons')
      .select('id,name')
      .eq('id', salonId)
      .maybeSingle();
    if (salonError || !salon) return json(res, 404, { error: 'Salon not found.' });

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id,name,email,login_id,role,salon_id')
      .eq('salon_id', salonId)
      .eq('role', 'Admin')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (profileError || !profile) return json(res, 404, { error: 'No Admin account is linked to this salon.' });

    const { error: updateError } = await admin.auth.admin.updateUserById(profile.id, { password: newPassword });
    if (updateError) return json(res, 400, { error: updateError.message || 'Could not reset the Admin password.' });

    return json(res, 200, {
      success: true,
      salon: { id: salon.id, name: salon.name },
      admin: { userId: profile.login_id, email: profile.email, name: profile.name },
    });
  }

  if (req.method === 'GET') {
    const { data: salons, error: salonsError } = await admin
      .from('salons')
      .select('id,name,code,address,city,phone,email,currency_symbol,tax_rate_percent,status,subscription_plan,subscription_status,subscription_start_date,subscription_expiry_date,subscription_amount,next_renewal_date,created_at')
      .order('created_at', { ascending: false });

    if (salonsError) return json(res, 400, { error: salonsError.message });

    const salonIds = (salons || []).map((salon) => salon.id);
    let profiles: any[] = [];
    if (salonIds.length) {
      const { data, error: profilesError } = await admin
        .from('profiles')
        .select('id,salon_id,name,email,login_id,role,designation,phone,created_at')
        .in('salon_id', salonIds)
        .order('created_at', { ascending: true });
      if (profilesError) return json(res, 400, { error: profilesError.message });
      profiles = data || [];
    }

    const rows = (salons || []).map((salon) => ({
      ...salon,
      admin: profiles.find((profile) => profile.salon_id === salon.id && profile.role === 'Admin') || null,
    }));

    return json(res, 200, { salons: rows });
  }

  const salonId = String(req.body?.salonId || '').trim();
  if (!salonId) return json(res, 400, { error: 'Salon ID is required.' });

  const allowedStatuses = new Set(['Active', 'Suspended', 'Pending']);
  const updates: Record<string, unknown> = {};

  if (req.body?.name !== undefined) {
    const name = String(req.body.name).trim();
    if (!name) return json(res, 400, { error: 'Salon name cannot be empty.' });
    updates.name = name;
  }
  if (req.body?.address !== undefined) updates.address = String(req.body.address || '').trim();
  if (req.body?.city !== undefined) updates.city = String(req.body.city || '').trim();
  if (req.body?.phone !== undefined) updates.phone = String(req.body.phone || '').trim();
  if (req.body?.email !== undefined) updates.email = String(req.body.email || '').trim().toLowerCase();
  if (req.body?.currencySymbol !== undefined) updates.currency_symbol = String(req.body.currencySymbol || '₹').trim() || '₹';
  if (req.body?.taxRatePercent !== undefined) {
    const tax = Number(req.body.taxRatePercent);
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) return json(res, 400, { error: 'Tax rate must be between 0 and 100.' });
    updates.tax_rate_percent = tax;
  }
  if (req.body?.status !== undefined) {
    const status = String(req.body.status);
    if (!allowedStatuses.has(status)) return json(res, 400, { error: 'Invalid salon status.' });
    updates.status = status;
  }

  const allowedSubscriptionStatuses = new Set(['Trial', 'Active', 'Expired', 'Cancelled']);
  if (req.body?.subscriptionPlan !== undefined) {
    const plan = String(req.body.subscriptionPlan || '').trim();
    if (plan.length > 40) return json(res, 400, { error: 'Subscription plan must be 40 characters or fewer.' });
    updates.subscription_plan = plan || 'Trial';
  }
  if (req.body?.subscriptionStatus !== undefined) {
    const subscriptionStatus = String(req.body.subscriptionStatus || 'Trial');
    if (!allowedSubscriptionStatuses.has(subscriptionStatus)) return json(res, 400, { error: 'Invalid subscription status.' });
    updates.subscription_status = subscriptionStatus;
  }
  if (req.body?.subscriptionStartDate !== undefined) {
    const value = req.body.subscriptionStartDate ? String(req.body.subscriptionStartDate) : null;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return json(res, 400, { error: 'Subscription start date must be YYYY-MM-DD.' });
    updates.subscription_start_date = value;
  }
  if (req.body?.subscriptionExpiryDate !== undefined) {
    const value = req.body.subscriptionExpiryDate ? String(req.body.subscriptionExpiryDate) : null;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return json(res, 400, { error: 'Subscription expiry date must be YYYY-MM-DD.' });
    updates.subscription_expiry_date = value;
  }
  if (req.body?.nextRenewalDate !== undefined) {
    const value = req.body.nextRenewalDate ? String(req.body.nextRenewalDate) : null;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return json(res, 400, { error: 'Next renewal date must be YYYY-MM-DD.' });
    updates.next_renewal_date = value;
  }
  if (req.body?.subscriptionAmount !== undefined) {
    const amount = Number(req.body.subscriptionAmount);
    if (!Number.isFinite(amount) || amount < 0) return json(res, 400, { error: 'Subscription amount must be a non-negative number.' });
    updates.subscription_amount = amount;
  }

  if (!Object.keys(updates).length) return json(res, 400, { error: 'No changes were provided.' });

  const { data: salon, error } = await admin
    .from('salons')
    .update(updates)
    .eq('id', salonId)
    .select('id,name,code,address,city,phone,email,currency_symbol,tax_rate_percent,status,subscription_plan,subscription_status,subscription_start_date,subscription_expiry_date,subscription_amount,next_renewal_date,created_at')
    .single();

  if (error || !salon) return json(res, 400, { error: error?.message || 'Could not update the salon.' });

  return json(res, 200, { salon });
}
