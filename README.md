# Mountain Tycoon — Vercel + Supabase

This folder is ready to deploy as a static Vercel site. It includes:

- The full game in `index.html`
- Local autosaves every 45 seconds
- Email/password accounts through Supabase Auth
- Manual cloud Save and Load controls
- Cloud autosaves every 2 minutes while signed in
- A protected `player_saves` table using Row Level Security

## 1. Create the Supabase project

1. Create a Supabase project.
2. Open **SQL Editor**, paste `supabase-schema.sql`, and run it.
3. Open **Authentication → Providers → Email** and make sure Email is enabled.
4. For easy testing, you may temporarily disable email confirmation. For production, leave confirmation enabled.
5. Open **Project Settings → API** and copy:
   - Project URL
   - Publishable key (or legacy anon key)
6. Put both values in `supabase-config.js`. Never put the service-role key in this project.

## 2. Deploy to Vercel

### Dashboard / GitHub

1. Put this folder in a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Other**.
4. Leave Build Command empty and Output Directory empty.
5. Deploy.

### Vercel CLI

```bash
npm i -g vercel
cd mountain-tycoon-vercel-supabase
vercel --prod
```

## 3. Configure Supabase Auth URLs

After Vercel gives you the production URL:

1. Open Supabase **Authentication → URL Configuration**.
2. Set **Site URL** to your Vercel production URL.
3. Add the same URL under **Redirect URLs**.

## Save behavior

- Local progress loads automatically on the same browser/device.
- A signed-in player can explicitly choose **Save to Cloud** or **Load Cloud Save**.
- The game cloud-autosaves every two minutes while signed in.
- The database row is keyed by the authenticated user's UUID. RLS prevents one player from reading or changing another player's save.

## Important

The Supabase publishable/anon key is intentionally used in the browser. Security comes from the included Row Level Security policies. Never expose a Supabase `service_role` key.
