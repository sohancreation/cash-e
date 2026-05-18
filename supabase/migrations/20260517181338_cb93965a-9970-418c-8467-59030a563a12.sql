CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  values (new.id, v_phone, v_name, v_seed, 10000, 100, 'silver');

  insert into public.transactions(user_id, kind, amount_cents, counterparty, note)
  values (new.id, 'signup_bonus', 10000, 'CASh-E', 'Welcome to CASh-E! ৳ 100 starting bonus');

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
    (new.id, 'Welcome to CASh-E 🎉', 'Your ৳ 100 starter balance is ready. Try sending money to a friend!', 'sparkles');

  return new;
end $function$;