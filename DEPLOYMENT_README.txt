MOUNTAIN TYCOON — VERSION 20 DEPLOYMENT PACKAGE
================================================

PACKAGE CONTENTS
----------------
index.html
  Complete playable game, three-world-slot implementation, and planet registry.

manifest.webmanifest
  PWA identity, description, colors, orientation, and icon paths.

service-worker.js
  Offline app shell and cache replacement logic.

supabase-config.js
  Public browser configuration for the Supabase Project URL and publishable
  key. Never place a service_role key here.

supabase-schema.sql
  Private account save storage, three-slot save-format documentation, Row
  Level Security policies, and the public lifetime-money leaderboard.

planets/
  Preloaded planet-pack queue and a development template for future planets.

PLANET_DEVELOPMENT.md
  Stable block-key rules, planet definition fields, lifecycle hooks, generic
  liquids, custom hazards/events, generation overrides, and shop extensions.

audio/
  Game music, ambience, mining, movement, interface, hazard, and reward audio.

icons/
  Browser, Apple touch, standard PWA, and maskable PWA icons.

WORLD SLOT SYSTEM
-----------------
- Every local browser and signed-in account can hold up to three worlds.
- Empty slots can be used to create Normal or Sandbox worlds.
- Every world has its own name, seed, difficulty, settings, generated terrain,
  planet, inventory, progression, structures, planet state, and play time.
- Normal-world settings become permanent when creation is confirmed.
- Sandbox-world settings can be reopened and edited.
- Deleting a slot removes only that world.
- A legacy single-world save is imported into slot 1 automatically.
- Local autosaving applies to the active slot.
- Signed-in cloud saving writes the entire three-slot collection atomically.

CLOUD SAVE FORMAT
-----------------
The player_saves table keeps one private row per authenticated account.
The save_data JSONB column contains:

  format: mountain-tycoon-world-slots
  version: 1
  updatedAt: ISO timestamp
  slots: three world entries or null values

This design does not need one database row per slot. Row Level Security makes
the full collection readable and writable only by its owner.

SCHEMA UPDATE
-------------
Run the complete supabase-schema.sql in Supabase Dashboard > SQL Editor.

The script is safe to rerun:
- Existing player saves are not erased.
- Existing player_saves and leaderboard_entries tables are retained.
- The player_saves default is updated to a valid empty three-slot collection.
- Save-format and version comments are attached to the database schema.
- Policies and the leaderboard trigger are recreated in their current form.
- Legacy single-world JSON remains accepted and is migrated by the game.

Do not add a JSON shape constraint that rejects legacy saves. The client must
be allowed to read an older row before it can migrate it.

ACCOUNT SETUP
-------------
1. Enable the Email provider in Supabase Authentication.
2. Turn Confirm email OFF.
3. Mountain Tycoon uses usernames in the interface and creates private
   internal email addresses for Supabase Auth.
4. Put the Project URL and publishable key in supabase-config.js.
5. Never use a service_role key in a browser deployment.

DEPLOYMENT
----------
1. Upload the complete contents of this folder to one public site root.
2. Keep index.html, the manifest, service worker, configuration, audio, and
   icon paths together.
3. Serve the site over HTTPS.
4. Make index.html the root page.
5. Hard-refresh or fully reopen an installed PWA after deployment.

Do not deploy an incomplete outer extraction folder. Version 20 has a single
flat project root and is ready to upload as-is.

FILES THAT DO NOT REQUIRE DATABASE CHANGES
------------------------------------------
World settings, generated structures, inventories, opened containers, terrain,
fluids, and collected rewards remain inside save_data JSONB. New gameplay
fields normally do not require database columns.

The visual-lab HTML files are separate development previews and are not part of
this production package.
