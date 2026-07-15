MOUNTAIN TYCOON VERSION 20 — QUICK START
========================================

1. Run supabase-schema.sql in the Supabase SQL Editor.
2. Enable the Email authentication provider and turn Confirm email OFF.
3. Keep the existing Project URL and publishable key in supabase-config.js.
4. Upload this complete folder to the site root.
5. Deploy over HTTPS and hard-refresh once.

Version 20 includes three worlds per account and a planet expansion registry.
Earth remains the default and all existing Earth saves remain compatible.
The database stores the complete
three-slot collection in one private player_saves.save_data JSONB value. Old
single-world saves migrate into slot 1 automatically.

Read PLANET_DEVELOPMENT.md before adding a planet. Do not deploy only
index.html and service-worker.js; deploy the complete v20
package, including the updated schema and documentation.
