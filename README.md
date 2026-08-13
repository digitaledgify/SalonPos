<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e2049640-ee75-4b95-987e-c7f5960477ca

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Super Admin Salon Onboarding

The app no longer exposes public salon signup. New salons are created only by the dedicated Super Admin account.

### One-time Supabase setup
1. Create a dedicated Super Admin user in **Supabase → Authentication → Users** with your chosen email/password.
2. Run `supabase/2026-08-13-super-admin-onboarding.sql` in **Supabase → SQL Editor**.
3. Do not put the Supabase service-role key in any `VITE_` variable or frontend code.

### Environment variables
Frontend/local `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPER_ADMIN_EMAIL`

Vercel/server environment variables:
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase **service_role/secret** key
- `SUPER_ADMIN_EMAIL` — same email as the dedicated Super Admin account

Redeploy after changing Vercel environment variables.

### Onboarding flow
1. Sign in with the Super Admin account.
2. The app opens the Super Admin onboarding dashboard.
3. Enter the salon and first Admin details.
4. Click **Verify & Create Salon**.
5. The server creates the salon and its Admin auth account.
6. The screen shows the generated Admin User ID (`SALONCODE-ADM01`) and password so you can give them to the salon Admin.

Salon Admins can sign in with either the generated User ID or their email plus password. They cannot access the Super Admin onboarding API because the server checks the authenticated Super Admin email.
