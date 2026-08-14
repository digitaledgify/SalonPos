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
  status text not null default 'Active' check (status in ('Active', 'Suspended', 'Pending')),
  subscription_plan text not null default 'Trial',
  subscription_status text not null default 'Trial' check (subscription_status in ('Trial', 'Active', 'Expired', 'Cancelled')),
  subscription_start_date date default current_date,
  subscription_expiry_date date,
  subscription_amount numeric(12,2) not null default 0,
  next_renewal_date date,
  created_at timestamptz default now()
);

-- 2. PROFILES TABLE
-- One row per login user. Linked 1:1 to Supabase's built-in auth.users table.
-- This is what ties a login to exactly one salon and one role.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  email text not null default '',
  login_id text unique,
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
-- SUPER ADMIN CONTROLLED ONBOARDING
-- New salons are created by the private server endpoint only.
-- The old public self-signup RPC is intentionally removed/revoked.
-- Existing salon Admins cannot create another salon.
-- ============================================================

alter table public.salons add column if not exists status text not null default 'Active';
alter table public.profiles add column if not exists email text not null default '';
alter table public.profiles add column if not exists login_id text;

create unique index if not exists idx_profiles_login_id on public.profiles(login_id) where login_id is not null;

drop function if exists public.create_salon_with_admin(text, text, text);

-- Salon creation is deliberately NOT granted to authenticated users.

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

-- ============================================================
-- CUSTOMERS TABLE
-- Customer profiles have a lot of nested data (loyalty, notes,
-- photos, visit history) — stored as JSONB in `data` for
-- flexibility, with a few columns pulled out for fast search.
-- ============================================================
create table if not exists public.customers (
  id text primary key,
  salon_id uuid not null references public.salons(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text default '',
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_customers_salon_id on public.customers(salon_id);

alter table public.customers enable row level security;

create policy "Users can view customers in their own salon"
  on public.customers for select
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can insert customers in their own salon"
  on public.customers for insert
  with check (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can update customers in their own salon"
  on public.customers for update
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can delete customers in their own salon"
  on public.customers for delete
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

-- ============================================================
-- APPOINTMENTS TABLE
-- Simple flat structure, so a proper relational table (not JSONB)
-- ============================================================
create table if not exists public.appointments (
  id text primary key,
  salon_id uuid not null references public.salons(id) on delete cascade,
  time text not null,
  customer_name text not null,
  customer_phone text default '',
  stylist_name text default '',
  service text default '',
  amount numeric default 0,
  status text not null default 'Booked',
  notes text default '',
  created_at timestamptz default now()
);

create index if not exists idx_appointments_salon_id on public.appointments(salon_id);

alter table public.appointments enable row level security;

create policy "Users can view appointments in their own salon"
  on public.appointments for select
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can insert appointments in their own salon"
  on public.appointments for insert
  with check (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can update appointments in their own salon"
  on public.appointments for update
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can delete appointments in their own salon"
  on public.appointments for delete
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

-- ============================================================
-- TRANSACTIONS TABLE (Billing / Invoices)
-- ============================================================
create table if not exists public.transactions (
  id text primary key,
  salon_id uuid not null references public.salons(id) on delete cascade,
  invoice_no text not null,
  customer_name text not null,
  customer_phone text default '',
  stylist_name text default '',
  services text[] default '{}',
  amount numeric not null default 0,
  payment_method text default 'Cash',
  status text not null default 'Paid',
  time text default '',
  date text default '',
  created_at timestamptz default now()
);

create index if not exists idx_transactions_salon_id on public.transactions(salon_id);

alter table public.transactions enable row level security;

create policy "Users can view transactions in their own salon"
  on public.transactions for select
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can insert transactions in their own salon"
  on public.transactions for insert
  with check (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can update transactions in their own salon"
  on public.transactions for update
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can delete transactions in their own salon"
  on public.transactions for delete
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

-- ============================================================
-- EMPLOYEES TABLE
-- Nested fields (shifts, commission tiers, emergency contact)
-- stored as JSONB, same pattern as customers.
-- ============================================================
create table if not exists public.employees (
  id text primary key,
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  role_title text default '',
  department text default '',
  status text default 'Active',
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_employees_salon_id on public.employees(salon_id);

alter table public.employees enable row level security;

create policy "Users can view employees in their own salon"
  on public.employees for select
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can insert employees in their own salon"
  on public.employees for insert
  with check (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can update employees in their own salon"
  on public.employees for update
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can delete employees in their own salon"
  on public.employees for delete
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

-- ============================================================
-- ROLES TABLE (job-title templates used by Employees > Roles tab)
-- ============================================================
create table if not exists public.employee_roles (
  id text primary key,
  salon_id uuid not null references public.salons(id) on delete cascade,
  title text not null,
  department text default '',
  description text default '',
  default_commission_rate numeric default 0,
  permissions text[] default '{}',
  color text default '#6A3F4D',
  created_at timestamptz default now()
);

create index if not exists idx_employee_roles_salon_id on public.employee_roles(salon_id);

alter table public.employee_roles enable row level security;

create policy "Users can view roles in their own salon"
  on public.employee_roles for select
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can insert roles in their own salon"
  on public.employee_roles for insert
  with check (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can update roles in their own salon"
  on public.employee_roles for update
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can delete roles in their own salon"
  on public.employee_roles for delete
  using (salon_id in (select salon_id from public.profiles where profiles.id = auth.uid()));
