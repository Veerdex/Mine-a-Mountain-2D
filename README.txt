SUPABASE CONFIG CACHE FIX

Replace only these two files in the deployed PWA:
- index.html
- service-worker.js

Do not replace or delete your existing supabase-config.js.

This update:
- Changes the service-worker cache to mountain-tycoon-pwa-v3
- Stops caching supabase-config.js
- Adds a one-time ?v=3 cache bust to the config script
- Accepts a trailing slash on the Project URL
- Accepts publishableKey, anonKey, or key field names
- Shows the exact setup/load problem in the Account menu

After deploying:
1. Fully close and reopen the installed PWA, or hard refresh the browser page.
2. If an old installed copy remains, clear the site's storage/service worker
   once, then reopen it.
