-- ============================================================
-- Salon POS — Multi-Tenant Auth Schema
-- Run this in Supabase: Project → SQL Editor → New Query → Run
-- ============================================================

-- 1. SALONS TABLE
-- One row per salon business that signs up for the product.
create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,              -- short human-friendly code, e.g. "GLAM01"
  address text default '',
  city text default '',
  phone text default '',
  email text default '',
  currency_symbol text default '₹',
  tax_rate_percent numeric default 18,
  created_at timestamptz default now()
);

-- 2. PROFILES TABLE
-- One row per login user. Linked 1:1 to Supabase's built-in auth.users table.
-- This is what ties a login to exactly one salon and one role.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  role text not null check (role in ('Admin', 'Reception', 'Stylist')),
  designation text default '',
  phone text default '',
  avatar_url text default '',
  created_at timestamptz default now()
);

-- Helpful index: quickly look up everyone in a salon
create index if not exists idx_profiles_salon_id on public.profiles(salon_id);

-- ============================================================
-- ROW LEVEL SECURITY (this is what stops Salon A seeing Salon B)
-- ============================================================

alter table public.salons enable row level security;
alter table public.profiles enable row level security;

-- A logged-in user can only see their OWN salon's row
create policy "Users can view their own salon"
  on public.salons for select
  using (
    id in (select salon_id from public.profiles where profiles.id = auth.uid())
  );

-- A logged-in user can only see profiles within their OWN salon
create policy "Users can view profiles in their own salon"
  on public.profiles for select
  using (
    salon_id in (select salon_id from public.profiles where profiles.id = auth.uid())
  );

-- Only Admins can insert new staff profiles into their own salon
create policy "Admins can add staff to their own salon"
  on public.profiles for insert
  with check (
    salon_id in (
      select salon_id from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'Admin'
    )
  );

-- Only Admins can update staff profiles within their own salon
create policy "Admins can update staff in their own salon"
  on public.profiles for update
  using (
    salon_id in (
      select salon_id from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'Admin'
    )
  );

-- ============================================================
-- NOTE FOR LATER: every future business table (customers,
-- appointments, transactions, inventory, employees, expenses...)
-- should follow this exact same pattern:
--   1. Add a `salon_id uuid references public.salons(id)` column
--   2. Enable RLS on the table
--   3. Add a policy: `using (salon_id in (select salon_id from
--      public.profiles where profiles.id = auth.uid()))`
-- This guarantees no salon can ever query another salon's data,
-- enforced at the database level — not just hidden in the UI.
-- ============================================================
