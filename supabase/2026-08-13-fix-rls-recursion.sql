-- Fix RLS infinite recursion caused by policies on public.profiles
-- querying public.profiles from inside public.profiles policies.
-- Run this ONCE in Supabase SQL Editor.

create or replace function public.get_my_salon_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select salon_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

revoke all on function public.get_my_salon_id() from public;
revoke all on function public.get_my_role() from public;
grant execute on function public.get_my_salon_id() to authenticated;
grant execute on function public.get_my_role() to authenticated;

-- SALONS
drop policy if exists "Users can view their own salon" on public.salons;
create policy "Users can view their own salon"
  on public.salons for select
  using (id = public.get_my_salon_id());

-- PROFILES
drop policy if exists "Users can view profiles in their own salon" on public.profiles;
create policy "Users can view profiles in their own salon"
  on public.profiles for select
  using (salon_id = public.get_my_salon_id());

drop policy if exists "Admins can add staff to their own salon" on public.profiles;
create policy "Admins can add staff to their own salon"
  on public.profiles for insert
  with check (
    salon_id = public.get_my_salon_id()
    and public.get_my_role() = 'Admin'
  );

drop policy if exists "Admins can update staff in their own salon" on public.profiles;
create policy "Admins can update staff in their own salon"
  on public.profiles for update
  using (
    salon_id = public.get_my_salon_id()
    and public.get_my_role() = 'Admin'
  )
  with check (
    salon_id = public.get_my_salon_id()
    and public.get_my_role() = 'Admin'
  );

-- CUSTOMERS
drop policy if exists "Users can view customers in their own salon" on public.customers;
create policy "Users can view customers in their own salon"
  on public.customers for select using (salon_id = public.get_my_salon_id());
drop policy if exists "Users can insert customers in their own salon" on public.customers;
create policy "Users can insert customers in their own salon"
  on public.customers for insert with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can update customers in their own salon" on public.customers;
create policy "Users can update customers in their own salon"
  on public.customers for update using (salon_id = public.get_my_salon_id()) with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can delete customers in their own salon" on public.customers;
create policy "Users can delete customers in their own salon"
  on public.customers for delete using (salon_id = public.get_my_salon_id());

-- APPOINTMENTS
drop policy if exists "Users can view appointments in their own salon" on public.appointments;
create policy "Users can view appointments in their own salon"
  on public.appointments for select using (salon_id = public.get_my_salon_id());
drop policy if exists "Users can insert appointments in their own salon" on public.appointments;
create policy "Users can insert appointments in their own salon"
  on public.appointments for insert with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can update appointments in their own salon" on public.appointments;
create policy "Users can update appointments in their own salon"
  on public.appointments for update using (salon_id = public.get_my_salon_id()) with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can delete appointments in their own salon" on public.appointments;
create policy "Users can delete appointments in their own salon"
  on public.appointments for delete using (salon_id = public.get_my_salon_id());

-- TRANSACTIONS
drop policy if exists "Users can view transactions in their own salon" on public.transactions;
create policy "Users can view transactions in their own salon"
  on public.transactions for select using (salon_id = public.get_my_salon_id());
drop policy if exists "Users can insert transactions in their own salon" on public.transactions;
create policy "Users can insert transactions in their own salon"
  on public.transactions for insert with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can update transactions in their own salon" on public.transactions;
create policy "Users can update transactions in their own salon"
  on public.transactions for update using (salon_id = public.get_my_salon_id()) with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can delete transactions in their own salon" on public.transactions;
create policy "Users can delete transactions in their own salon"
  on public.transactions for delete using (salon_id = public.get_my_salon_id());

-- EMPLOYEES
drop policy if exists "Users can view employees in their own salon" on public.employees;
create policy "Users can view employees in their own salon"
  on public.employees for select using (salon_id = public.get_my_salon_id());
drop policy if exists "Users can insert employees in their own salon" on public.employees;
create policy "Users can insert employees in their own salon"
  on public.employees for insert with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can update employees in their own salon" on public.employees;
create policy "Users can update employees in their own salon"
  on public.employees for update using (salon_id = public.get_my_salon_id()) with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can delete employees in their own salon" on public.employees;
create policy "Users can delete employees in their own salon"
  on public.employees for delete using (salon_id = public.get_my_salon_id());

-- EMPLOYEE ROLES
drop policy if exists "Users can view roles in their own salon" on public.employee_roles;
create policy "Users can view roles in their own salon"
  on public.employee_roles for select using (salon_id = public.get_my_salon_id());
drop policy if exists "Users can insert roles in their own salon" on public.employee_roles;
create policy "Users can insert roles in their own salon"
  on public.employee_roles for insert with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can update roles in their own salon" on public.employee_roles;
create policy "Users can update roles in their own salon"
  on public.employee_roles for update using (salon_id = public.get_my_salon_id()) with check (salon_id = public.get_my_salon_id());
drop policy if exists "Users can delete roles in their own salon" on public.employee_roles;
create policy "Users can delete roles in their own salon"
  on public.employee_roles for delete using (salon_id = public.get_my_salon_id());
