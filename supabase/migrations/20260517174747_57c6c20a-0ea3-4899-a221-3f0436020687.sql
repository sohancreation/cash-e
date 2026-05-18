
revoke execute on function public.find_recipient(text)                         from anon, public;
revoke execute on function public.transfer_money(text, bigint, text)           from anon, public;
revoke execute on function public.debit_wallet(tx_kind, bigint, text, text, jsonb, integer) from anon, public;
revoke execute on function public.credit_wallet(tx_kind, bigint, text, text, jsonb)         from anon, public;
revoke execute on function public.award_xp(uuid, integer)                      from anon, public, authenticated;
revoke execute on function public.handle_new_user()                            from anon, public, authenticated;

grant execute on function public.find_recipient(text)                          to authenticated;
grant execute on function public.transfer_money(text, bigint, text)            to authenticated;
grant execute on function public.debit_wallet(tx_kind, bigint, text, text, jsonb, integer) to authenticated;
grant execute on function public.credit_wallet(tx_kind, bigint, text, text, jsonb)         to authenticated;
