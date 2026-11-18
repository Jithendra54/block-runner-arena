-- Block Runner Arena schema: profiles, score history and admin audit.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_]{3,18}$'),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_url text,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.game_runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 10000000),
  distance integer not null check (distance >= 0 and distance <= 10000000),
  coins integer not null check (coins >= 0 and coins <= 100000),
  duration_ms integer not null check (duration_ms between 1000 and 7200000),
  suspicious boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists game_runs_player_score_idx on public.game_runs(player_id, score desc, created_at asc);
create index if not exists game_runs_recent_idx on public.game_runs(created_at desc);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id),
  action text not null,
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admins where user_id=auth.uid());
$$;

create or replace function public.submit_run(p_score int,p_distance int,p_coins int,p_duration_ms int)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  uid uuid := auth.uid();
  suspicious_run boolean;
begin
  if uid is null then raise exception 'Sign in required'; end if;
  if p_score < 0 or p_distance < 0 or p_coins < 0 or p_duration_ms not between 1000 and 7200000 then raise exception 'Invalid run'; end if;
  if p_score > 10000000 or p_distance > 10000000 or p_coins > 100000 then raise exception 'Run out of range'; end if;
  suspicious_run := p_distance > (p_duration_ms / 1000.0) * 40
    or p_coins > (p_duration_ms / 1000.0) * 15
    or p_score > p_distance + p_coins * 100;
  insert into public.game_runs(player_id,score,distance,coins,duration_ms,suspicious)
  values(uid,p_score,p_distance,p_coins,p_duration_ms,suspicious_run);
  return jsonb_build_object('accepted',not suspicious_run,'suspicious',suspicious_run);
end $$;

create or replace function public.leaderboard(limit_count int default 100)
returns table(rank bigint,player_id uuid,username text,avatar_url text,best_score int,achieved_at timestamptz)
language sql stable security definer set search_path=public as $$
  with best as (
    select p.id,p.username,p.avatar_url,max(g.score) as best_score,
      min(g.created_at) filter (where g.score = (
        select max(g2.score) from public.game_runs g2
        where g2.player_id=p.id and not g2.suspicious
      )) as achieved_at
    from public.profiles p
    join public.game_runs g on g.player_id=p.id
    where not p.suspended and not g.suspicious
    group by p.id
  ), ranked as (
    select row_number() over(order by best_score desc,achieved_at asc,username asc) as rank,*
    from best
  )
  select ranked.rank,ranked.id,ranked.username,ranked.avatar_url,ranked.best_score,ranked.achieved_at
  from ranked order by ranked.rank limit greatest(1,least(limit_count,500));
$$;

alter table public.profiles enable row level security;
alter table public.game_runs enable row level security;
alter table public.admins enable row level security;
alter table public.admin_actions enable row level security;

create policy profiles_public_read on public.profiles for select using (true);
create policy profiles_self_insert on public.profiles for insert with check (auth.uid()=id);
create policy profiles_self_update on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy runs_public_read on public.game_runs for select using (true);
create policy runs_no_direct_insert on public.game_runs for insert with check (false);
create policy runs_no_direct_update on public.game_runs for update using (false);
create policy runs_admin_delete on public.game_runs for delete using (public.is_admin());
create policy admins_self_read on public.admins for select using (user_id=auth.uid());
create policy actions_admin_read on public.admin_actions for select using (public.is_admin());

grant execute on function public.submit_run(int,int,int,int) to authenticated;
grant execute on function public.leaderboard(int) to anon,authenticated;
grant execute on function public.is_admin() to authenticated;

-- Add the owner's auth UUID after account registration, using the trusted SQL editor:
-- insert into public.admins(user_id) values ('YOUR_AUTH_USER_UUID');
