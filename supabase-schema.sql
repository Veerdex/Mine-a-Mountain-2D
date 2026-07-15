-- Run this entire file in Supabase Dashboard -> SQL Editor.

-- ============================================================
-- Private player saves and three-world collections
--
-- save_data format version 1:
-- {
--   "format": "mountain-tycoon-world-slots",
--   "version": 1,
--   "updatedAt": "<ISO timestamp>",
--   "slots": [<world or null>, <world or null>, <world or null>]
-- }
--
-- Each world entry may contain a permanent planetId and its saveData contains
-- planetState for planet-specific events, machines, hazards, and progression.
-- Older rows may contain one legacy Earth world instead. Do not add a JSON
-- shape constraint that would reject them; the game migrates them into slot 1.
-- ============================================================

create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default
    '{"format":"mountain-tycoon-world-slots","version":1,"slots":[null,null,null]}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

-- Apply the current defaults to projects created with an older schema.
-- Existing rows and legacy save JSON are intentionally left unchanged.
alter table public.player_saves
  alter column save_data set default
    '{"format":"mountain-tycoon-world-slots","version":1,"slots":[null,null,null]}'::jsonb,
  alter column version set default 1;

comment on table public.player_saves is
  'One private save row per account. save_data contains all three world slots.';

comment on column public.player_saves.save_data is
  'Versioned Mountain Tycoon world-slot collection. Worlds include planetId and planetState; legacy single-world JSON remains valid for client migration.';

comment on column public.player_saves.version is
  'Server-side world-collection format version. Current version is 1.';

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
-- The complete three-world collection remains private in player_saves.
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
