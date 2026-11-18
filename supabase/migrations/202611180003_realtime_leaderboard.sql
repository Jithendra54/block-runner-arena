-- Publish game score inserts so Supabase Realtime can refresh the rankings.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname='supabase_realtime'
         and schemaname='public'
         and tablename='game_runs'
     ) then
    alter publication supabase_realtime add table public.game_runs;
  end if;
end $$;
