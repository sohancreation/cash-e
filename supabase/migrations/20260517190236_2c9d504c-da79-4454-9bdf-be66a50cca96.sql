
CREATE OR REPLACE FUNCTION public.daily_checkin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_user uuid := auth.uid();
  v_last date;
  v_streak int;
  v_bonus int;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;

  select last_active_date, streak into v_last, v_streak
    from public.profiles where id = v_user for update;

  if v_last = current_date then
    return jsonb_build_object('ok', false, 'reason', 'already_checked_in', 'streak', v_streak);
  end if;

  if v_last = current_date - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;

  v_bonus := 20 + (least(v_streak, 7) * 5);

  update public.profiles
     set streak = v_streak,
         last_active_date = current_date,
         updated_at = now()
   where id = v_user;

  perform public.award_xp(v_user, v_bonus);

  insert into public.notifications(user_id, title, body, icon)
  values (v_user,
          format('Daily check-in · day %s 🔥', v_streak),
          format('+%s XP added to your account', v_bonus),
          'trophy');

  return jsonb_build_object('ok', true, 'streak', v_streak, 'xp', v_bonus);
end $$;

CREATE OR REPLACE FUNCTION public.claim_mission(p_mission uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_user uuid := auth.uid();
  v_progress int;
  v_target int;
  v_completed boolean;
  v_xp int;
  v_cb bigint;
  v_title text;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;

  select progress, target, completed, reward_xp, reward_cashback_cents, title
    into v_progress, v_target, v_completed, v_xp, v_cb, v_title
    from public.missions where id = p_mission and user_id = v_user for update;

  if v_title is null then raise exception 'Mission not found'; end if;
  if v_completed then raise exception 'Already claimed'; end if;
  if v_progress < v_target then raise exception 'Mission not finished'; end if;

  update public.missions set completed = true where id = p_mission;

  if v_cb > 0 then
    update public.profiles set balance_cents = balance_cents + v_cb, updated_at = now() where id = v_user;
    insert into public.transactions(user_id, kind, amount_cents, counterparty, note)
    values (v_user, 'reward', v_cb, 'CASh-E Rewards', format('Mission reward: %s', v_title));
  end if;

  if v_xp > 0 then perform public.award_xp(v_user, v_xp); end if;

  insert into public.notifications(user_id, title, body, icon)
  values (v_user, format('Mission complete: %s 🏆', v_title),
          format('You earned %s XP%s', v_xp, case when v_cb > 0 then format(' and ৳%s cashback', (v_cb/100.0)::text) else '' end),
          'trophy');

  return jsonb_build_object('ok', true, 'xp', v_xp, 'cashback_cents', v_cb);
end $$;
