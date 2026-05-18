
-- ============ ENUMS ============
create type public.tx_kind as enum (
  'send','receive','bill','recharge','cashin','cashout',
  'savings','bundle','ott','bazaar','reward','postpay','signup_bonus'
);

create type public.persona_kind as enum ('student','farmer','merchant','gig','general');
create type public.tier_kind as enum ('silver','gold','platinum');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  name text not null default 'CASh-E User',
  avatar_seed text not null default 'AR',
  persona persona_kind not null default 'student',
  balance_cents bigint not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  tier tier_kind not null default 'silver',
  streak integer not null default 1,
  last_active_date date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ TRANSACTIONS ============
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind tx_kind not null,
  amount_cents bigint not null, -- positive credit, negative debit
  counterparty text,
  note text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index transactions_user_created_idx on public.transactions(user_id, created_at desc);

-- ============ SAVINGS GOALS ============
create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '🎯',
  target_cents bigint not null,
  saved_cents bigint not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

-- ============ CONTACTS ============
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  is_priyo boolean not null default false,
  created_at timestamptz not null default now()
);
create index contacts_user_idx on public.contacts(user_id);

-- ============ SUBSCRIPTIONS ============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, -- 'ott' | 'send_bundle' | 'recharge_bundle' | 'super_pack'
  plan_id text not null,
  plan_name text not null,
  price_cents bigint not null,
  status text not null default 'active',
  bundle_quota integer,
  expires_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions(user_id, status);

-- ============ MISSIONS ============
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  reward_xp integer not null default 50,
  reward_cashback_cents bigint not null default 0,
  progress integer not null default 0,
  target integer not null default 1,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ NOTIFICATIONS ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  icon text default 'sparkles',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ AI MESSAGES ============
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
create index ai_messages_user_idx on public.ai_messages(user_id, created_at);

-- ============ RLS ============
alter table public.profiles      enable row level security;
alter table public.transactions  enable row level security;
alter table public.savings_goals enable row level security;
alter table public.contacts      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.missions      enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_messages   enable row level security;

-- Own-row policies
create policy "own profile read"   on public.profiles     for select using (id = auth.uid());
create policy "own profile update" on public.profiles     for update using (id = auth.uid());

create policy "own tx read"        on public.transactions for select using (user_id = auth.uid());
create policy "own tx insert"      on public.transactions for insert with check (user_id = auth.uid());

create policy "own savings rw"     on public.savings_goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own contacts rw"    on public.contacts      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own subs rw"        on public.subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own missions rw"    on public.missions      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own notif rw"       on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own ai rw"          on public.ai_messages   for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Limited cross-user read for transfers: allow looking up a profile by phone (return only id+name+avatar)
create or replace function public.find_recipient(p_phone text)
returns table(id uuid, name text, avatar_seed text)
language sql security definer set search_path=public
as $$
  select id, name, avatar_seed from public.profiles where phone = p_phone limit 1
$$;

-- ============ AWARD XP / TIER ============
create or replace function public.award_xp(p_user uuid, p_xp integer)
returns void
language plpgsql security definer set search_path=public
as $$
declare
  v_new_xp integer;
  v_new_tier tier_kind;
  v_new_level integer;
begin
  update public.profiles
     set xp = xp + p_xp,
         updated_at = now()
   where id = p_user
   returning xp into v_new_xp;

  v_new_level := greatest(1, (v_new_xp / 100) + 1);
  v_new_tier := case
    when v_new_xp >= 2000 then 'platinum'::tier_kind
    when v_new_xp >= 800  then 'gold'::tier_kind
    else 'silver'::tier_kind
  end;
  update public.profiles
     set level = v_new_level, tier = v_new_tier
   where id = p_user;
end $$;

-- ============ TRANSFER ============
create or replace function public.transfer_money(
  p_to_phone text,
  p_amount_cents bigint,
  p_note text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  v_from uuid := auth.uid();
  v_to uuid;
  v_to_name text;
  v_from_name text;
  v_bal bigint;
begin
  if v_from is null then raise exception 'Not authenticated'; end if;
  if p_amount_cents <= 0 then raise exception 'Amount must be positive'; end if;

  select id, name into v_to, v_to_name from public.profiles where phone = p_to_phone;
  if v_to is null then raise exception 'Recipient not found on CASh-E'; end if;
  if v_to = v_from then raise exception 'Cannot send to yourself'; end if;

  select balance_cents, name into v_bal, v_from_name from public.profiles where id = v_from for update;
  if v_bal < p_amount_cents then raise exception 'Insufficient balance'; end if;

  update public.profiles set balance_cents = balance_cents - p_amount_cents, updated_at = now() where id = v_from;
  update public.profiles set balance_cents = balance_cents + p_amount_cents, updated_at = now() where id = v_to;

  insert into public.transactions(user_id, kind, amount_cents, counterparty, note)
  values (v_from, 'send',    -p_amount_cents, v_to_name,   p_note),
         (v_to,   'receive',  p_amount_cents, v_from_name, p_note);

  insert into public.notifications(user_id, title, body, icon)
  values (v_to, 'Money received', format('৳%s from %s', (p_amount_cents/100.0)::text, coalesce(v_from_name,'CASh-E user')), 'send');

  perform public.award_xp(v_from, 15);

  return jsonb_build_object('ok', true, 'new_balance', v_bal - p_amount_cents);
end $$;

-- ============ DEBIT (bills/recharge/bundle/ott/bazaar/savings) ============
create or replace function public.debit_wallet(
  p_kind tx_kind,
  p_amount_cents bigint,
  p_counterparty text,
  p_note text default null,
  p_meta jsonb default '{}'::jsonb,
  p_award_xp integer default 10
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  v_user uuid := auth.uid();
  v_bal bigint;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  if p_amount_cents <= 0 then raise exception 'Amount must be positive'; end if;

  select balance_cents into v_bal from public.profiles where id = v_user for update;
  if v_bal < p_amount_cents then raise exception 'Insufficient balance'; end if;

  update public.profiles set balance_cents = balance_cents - p_amount_cents, updated_at = now() where id = v_user;
  insert into public.transactions(user_id, kind, amount_cents, counterparty, note, meta)
  values (v_user, p_kind, -p_amount_cents, p_counterparty, p_note, p_meta);

  if p_award_xp > 0 then perform public.award_xp(v_user, p_award_xp); end if;

  return jsonb_build_object('ok', true, 'new_balance', v_bal - p_amount_cents);
end $$;

-- ============ CREDIT (cash-in / rewards) ============
create or replace function public.credit_wallet(
  p_kind tx_kind,
  p_amount_cents bigint,
  p_counterparty text,
  p_note text default null,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  if p_amount_cents <= 0 then raise exception 'Amount must be positive'; end if;

  update public.profiles set balance_cents = balance_cents + p_amount_cents, updated_at = now() where id = v_user;
  insert into public.transactions(user_id, kind, amount_cents, counterparty, note, meta)
  values (v_user, p_kind, p_amount_cents, p_counterparty, p_note, p_meta);

  return jsonb_build_object('ok', true);
end $$;

-- ============ SIGNUP TRIGGER ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path=public
as $$
declare
  v_phone text;
  v_name text;
  v_seed text;
begin
  v_phone := coalesce(new.raw_user_meta_data->>'phone', new.email);
  v_name  := coalesce(new.raw_user_meta_data->>'name', 'CASh-E User');
  v_seed  := upper(substring(regexp_replace(v_name, '[^A-Za-z]', '', 'g'), 1, 2));
  if length(v_seed) < 2 then v_seed := 'CE'; end if;

  insert into public.profiles(id, phone, name, avatar_seed, balance_cents, xp, tier)
  values (new.id, v_phone, v_name, v_seed, 2000000, 100, 'silver');

  insert into public.transactions(user_id, kind, amount_cents, counterparty, note)
  values (new.id, 'signup_bonus', 2000000, 'CASh-E', 'Welcome to CASh-E! ৳ 20,000 starting bonus');

  insert into public.savings_goals(user_id, name, emoji, target_cents, saved_cents, due_date)
  values (new.id, 'Eid Savings', '🌙', 1500000, 840000, current_date + interval '42 days');

  insert into public.contacts(user_id, name, phone, is_priyo) values
    (new.id, 'Rahim Uddin',   '01711000001', true),
    (new.id, 'Salma Akter',   '01711000002', true),
    (new.id, 'Khulna Bazaar', '01711000003', false);

  insert into public.missions(user_id, code, title, description, reward_xp, reward_cashback_cents, target) values
    (new.id, 'first_send',   'Send your first money',   'Send ৳ 50 or more to anyone',                    100, 5000,  1),
    (new.id, 'pay_3_bills',  'Pay 3 bills this week',   'Pay any 3 utility or recharge bills',            150, 5000,  3),
    (new.id, 'save_1000',    'Save ৳ 1,000 in Sanchay', 'Add to any savings goal',                        120, 0,     1),
    (new.id, '7_day_streak', '7-day login streak',      'Open the app 7 days in a row',                   200, 10000, 7);

  insert into public.notifications(user_id, title, body, icon) values
    (new.id, 'Welcome to CASh-E 🎉', 'Your ৳ 20,000 starter balance is ready. Try sending money to a friend!', 'sparkles');

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
