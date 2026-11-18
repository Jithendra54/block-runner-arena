-- Remove the former VIP chat feature and add a concise public player bio.
alter table if exists public.profiles
  add column if not exists bio text not null default '';

do $$
begin
  if to_regclass('public.profiles') is not null
     and not exists (
       select 1 from pg_constraint
       where conrelid = 'public.profiles'::regclass
         and conname = 'profiles_bio_length_check'
     ) then
    alter table public.profiles
      add constraint profiles_bio_length_check check (char_length(bio) <= 160);
  end if;
end $$;

drop function if exists public.vip_send(uuid,text);
drop function if exists public.is_current_vip(uuid);
drop table if exists public.user_reports cascade;
drop table if exists public.vip_messages cascade;
drop table if exists public.vip_conversations cascade;
