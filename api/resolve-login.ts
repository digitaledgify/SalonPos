type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): VercelResponse; json(body: any): VercelResponse };
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!supabaseUrl || !serviceRoleKey) return res.status(500).json({ error: 'Server login lookup is not configured.' });

  const login = String(req.body?.login || '').trim();
  if (!login) return res.status(400).json({ error: 'Enter your email or User ID.' });
  if (login.includes('@')) return res.status(200).json({ email: login.toLowerCase() });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await admin.from('profiles').select('email').eq('login_id', login.toUpperCase()).maybeSingle();
  if (error || !data?.email) return res.status(401).json({ error: 'User ID not found.' });
  return res.status(200).json({ email: data.email });
}
