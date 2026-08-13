-- Run this ONCE in Supabase SQL Editor for an existing project.
-- This removes public salon self-signup and prepares Super Admin onboarding.

alter table public.salons
  add column if not exists status text not null default 'Active';

alter table public.profiles
  add column if not exists email text not null default '';

alter table public.profiles
  add column if not exists login_id text;

create unique index if not exists idx_profiles_login_id
  on public.profiles(login_id)
  where login_id is not null;

drop function if exists public.create_salon_with_admin(text, text, text);

-- New salon creation is performed by the private /api/onboard-salon endpoint,
-- which uses the Supabase service-role key and checks SUPER_ADMIN_EMAIL.
-- Do not create a new public salon-creation RPC.
