-- Run this entire file in Supabase Dashboard -> SQL Editor.

-- ============================================================
-- Private player saves
-- ============================================================

create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.player_saves enable row level security;

drop policy if exists "Players can read their own save" on public.player_saves;
create policy "Players can read their own save"
on public.player_saves for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Players can create their own save" on public.player_saves;
create policy "Players can create their own save"
on public.player_saves for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Players can update their own save" on public.player_saves;
create policy "Players can update their own save"
on public.player_saves for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Players can delete their own save" on public.player_saves;
create policy "Players can delete their own save"
on public.player_saves for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete
on public.player_saves
to authenticated;

-- ============================================================
-- Public lifetime-money leaderboard
-- Only the username and lifetime total are public.
-- Full save data remains private in player_saves.
-- ============================================================

create table if not exists public.leaderboard_entries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  total_collected_money numeric(30, 0) not null default 0,
  updated_at timestamptz not null default now(),
  constraint leaderboard_username_length
    check (char_length(username) between 1 and 20),
  constraint leaderboard_username_characters
    check (username ~ '^[A-Za-z0-9_]+$'),
  constraint leaderboard_money_nonnegative
    check (total_collected_money >= 0)
);

create index if not exists leaderboard_entries_money_idx
on public.leaderboard_entries
(total_collected_money desc, updated_at asc);

alter table public.leaderboard_entries enable row level security;

drop policy if exists "Anyone can read leaderboard" on public.leaderboard_entries;
create policy "Anyone can read leaderboard"
on public.leaderboard_entries for select
to anon, authenticated
using (true);

drop policy if exists "Players can create own leaderboard entry"
on public.leaderboard_entries;
create policy "Players can create own leaderboard entry"
on public.leaderboard_entries for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Players can update own leaderboard entry"
on public.leaderboard_entries;
create policy "Players can update own leaderboard entry"
on public.leaderboard_entries for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select on public.leaderboard_entries to anon, authenticated;
grant insert, update on public.leaderboard_entries to authenticated;

-- Prevent a player or older save from lowering the account's lifetime total.
create or replace function public.prevent_leaderboard_total_decrease()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    new.total_collected_money :=
      greatest(old.total_collected_money, new.total_collected_money);
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leaderboard_total_never_decreases
on public.leaderboard_entries;

create trigger leaderboard_total_never_decreases
before update on public.leaderboard_entries
for each row
execute function public.prevent_leaderboard_total_decrease();
