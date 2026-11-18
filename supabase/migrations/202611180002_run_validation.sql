-- Keep server-side speed validation aligned with the runner's max game speed (37.2m/s).
create or replace function public.submit_run(p_score int,p_distance int,p_coins int,p_duration_ms int)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  uid uuid := auth.uid();
  suspicious_run boolean;
begin
  if uid is null then raise exception 'Sign in required'; end if;
  if p_score < 0 or p_distance < 0 or p_coins < 0 or p_duration_ms not between 1000 and 7200000 then raise exception 'Invalid run'; end if;
  if p_score > 10000000 or p_distance > 10000000 or p_coins > 100000 then raise exception 'Run out of range'; end if;
  if (select count(*) from public.game_runs r where r.player_id=uid and r.created_at>now()-interval '10 minutes') >= 12 then
    raise exception 'Run submission rate limit exceeded';
  end if;
  suspicious_run := p_distance > (p_duration_ms / 1000.0) * 40
    or p_coins > (p_duration_ms / 1000.0) * 15
    or p_score > p_distance + p_coins * 100;
  insert into public.game_runs(player_id,score,distance,coins,duration_ms,suspicious)
  values(uid,p_score,p_distance,p_coins,p_duration_ms,suspicious_run);
  return jsonb_build_object('accepted',not suspicious_run,'suspicious',suspicious_run);
end $$;
