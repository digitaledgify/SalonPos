-- Salon POS — Super Admin subscription fields
-- Run once in Supabase SQL Editor.

alter table public.salons
  add column if not exists subscription_plan text not null default 'Trial',
  add column if not exists subscription_status text not null default 'Trial',
  add column if not exists subscription_start_date date default current_date,
  add column if not exists subscription_expiry_date date,
  add column if not exists subscription_amount numeric(12,2) not null default 0,
  add column if not exists next_renewal_date date;

update public.salons
set subscription_plan = coalesce(nullif(subscription_plan, ''), 'Trial'),
    subscription_status = case
      when subscription_status in ('Trial', 'Active', 'Expired', 'Cancelled') then subscription_status
      else 'Trial'
    end,
    subscription_amount = coalesce(subscription_amount, 0),
    subscription_start_date = coalesce(subscription_start_date, created_at::date, current_date)
where subscription_plan is null
   or subscription_plan = ''
   or subscription_status not in ('Trial', 'Active', 'Expired', 'Cancelled')
   or subscription_amount is null
   or subscription_start_date is null;

alter table public.salons
  drop constraint if exists salons_subscription_status_check;

alter table public.salons
  add constraint salons_subscription_status_check
  check (subscription_status in ('Trial', 'Active', 'Expired', 'Cancelled'));

alter table public.salons
  drop constraint if exists salons_subscription_amount_check;

alter table public.salons
  add constraint salons_subscription_amount_check
  check (subscription_amount >= 0);
