# Mountain Tycoon — Vercel + Supabase

Version 19 is a complete static deployment package for Mountain Tycoon.

## Included

- Full game in index.html
- Three independent world slots per account
- World name, seed, difficulty preset, game mode, and custom world settings
- Permanent settings for Normal worlds
- Editable settings and infinite resources in Sandbox worlds
- Automatic migration of a legacy single-world save into slot 1
- Local autosaves for the active world
- Manual cloud Save and Load controls
- Cloud autosaves while signed in
- Private cloud saves protected by Supabase Row Level Security
- Public lifetime-money leaderboard
- Installable offline PWA

## Supabase setup

1. Create or open a Supabase project.
2. Open SQL Editor, paste the complete supabase-schema.sql file, and run it.
3. Open Authentication > Providers > Email and enable Email.
4. Turn Confirm email OFF. Mountain Tycoon converts usernames into private internal email addresses, so players cannot receive confirmation messages.
5. Open Project Settings > API and copy the Project URL and publishable key.
6. Put those values in supabase-config.js.

Never place a service_role key in browser files.

## Save format

Each account has one row in public.player_saves. Its private save_data JSONB
value contains the complete three-slot collection:

- format: mountain-tycoon-world-slots
- version: 1
- updatedAt: collection timestamp
- slots: exactly three world entries or null values

Saving the collection in one row makes creating, deleting, and updating slots
atomic. The included schema remains compatible with old single-world rows. The
game recognizes those rows and migrates the old world into slot 1 when loaded.

## World rules

- Normal: settings are locked after world creation.
- Sandbox: settings can be changed later and normal progression restrictions
  are disabled.
- Each slot has its own seed, settings, progression, generated mountain, and
  play time.
- Logging out clears the active runtime world and returns to the account menu.
- Loading another account requires logging out first.

## Deploy to Vercel

1. Upload this complete folder to a Git repository or Vercel project.
2. Select Other for the framework preset.
3. Leave the build command and output directory empty.
4. Deploy over HTTPS.
5. Set the Supabase Site URL and Redirect URLs to the production address.

The publishable Supabase key is safe to use in the browser when the included
Row Level Security policies are enabled.
