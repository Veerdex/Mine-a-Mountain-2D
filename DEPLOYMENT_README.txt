MOUNTAIN TYCOON — CURRENT DEPLOYMENT FILES
==========================================

CONTENTS
--------
index.html
  Latest playable main-game build:
  Depth Overhaul + treasure consumables + contracts + collection book +
  restored per-tier ore density + weighted, depth-aware structure generation +
  Tier 1 Underground Houses + Tier 2 Miner Supply Rooms +
  Tier 3 Underground Workshops + Tier 4 Abandoned Mineshafts +
  Tier 5 Rail Stations + Tier 6 Ancient Shrines + Tier 7 Crystal Chambers +
  Tier 8 Underground Laboratories + Tier 9 Sealed Vaults +
  Tier 10 Forgotten Temples + complete 16-bit terrain block artwork +
  seamless 16-bit sky, mountain, cloud, and forest background artwork +
  visible structure-loot orb drops.

16-BIT BLOCK ART
----------------
All 42 mineable terrain, ore, material, and hazard block types now use the
approved 16x16 pixel-art designs, including Deepstone and the later-added Tier
7-10 materials. Each design has three deterministic coordinate-based texture
variations. Sprites are cached at their native 16x16 size and enlarged to the
game's 28px tile grid with nearest-neighbor rendering for crisp pixels.

16-BIT WORLD BACKGROUND
-----------------------
The surface background now uses crisp pixel-art sky bands, mountains, and two
layers of evergreen trees. Every landscape layer tiles according to the live
viewport width, so ultrawide displays remain fully covered without stretched
edges or empty gaps. Five distinct pixel-art cloud variants move continuously
at different speeds, wrap to the current viewport, and render behind all
mountains, trees, terrain, structures, shops, drops, effects, and the player.
Mountain layers now move downward with vertical camera motion during jumps.
Their opaque bases extend continuously into the layer below and to the terrain,
eliminating sky-colored gaps. Both forest layers use slower horizontal parallax.
Vertical mountain parallax is calculated directly from the camera every frame,
with no grounded-state dependency. Forest movement is reduced by another 50%.

16-BIT SHOPS
-------------
Mountain, Equipment, and Sell storefronts now use cached pixel-art building
sprites with stepped roofs, masonry foundations, timber or metal courses,
pixel windows, doors, signs, and shop-specific display details. The Equipment
Shop interior now has tiled brick walls, timber beams, iron ceiling brackets,
plank flooring, paneled counters, a reinforced exit, and dedicated 16-bit
displays for pickaxes, backpacks, flashlights, the animated refinery machine,
and the contract board. Upgrade-card previews for pickaxes, backpacks, and
flashlights use the same square-pixel style. Forest parallax is 25% faster than
the previous package while retaining the deliberately slow background motion.

FORGOTTEN TEMPLE
----------------
Tier 10 Forgotten Temples have permanently open monumental entrances and no
access item. Three Ancient Ward Statues take 3 seconds each to destroy. Once
all three are gone, the Royal Reliquary becomes mineable and takes 10 seconds
to open. During that process, the temple shakes and sheds increasingly dense
dust. Every Temple contains 6-8 unique ordinary sell-only relics and one
guaranteed Crown of the First Mountain. The Crown receives 65-75% of the exact
structure value, and all Temple rewards always total that generated value.

SEALED VAULT
------------
Tier 9 Sealed Vaults use permanently open two-tile armored entrances. There
is no Vault Keycard, clearance item, or access chain. Every Vault contains
5-7 unique ordinary sell-only reserve rewards and one guaranteed Sealed Gold
Bar. The Gold Bar receives 60-70% of the exact structure value and is released
by dismantling the central Bullion Pedestal for 8 seconds. Its paired red
beacons flash progressively faster during that process. All Vault rewards
always total the exact generated structure value.

UNDERGROUND LABORATORY
----------------------
Tier 8 Laboratories have permanently open three-tile side entrances and use
no Clearance Chips, keycards, or other access chain. Every Laboratory contains
4-6 ordinary sell-only research rewards and one guaranteed Experimental Power
Cell. The Power Cell receives 55-65% of the structure value and drops after the
central containment unit is dismantled for 7 seconds. All Laboratory rewards
always total the exact generated structure value.

CRYSTAL CHAMBER
---------------
Tier 7 Crystal Chambers contain two Resonance Nodes that take 3 seconds each
to mine. Destroying both permanently exposes the central Crystal Cradle, which
takes 6 seconds to mine. Every chamber contains a guaranteed Crystal Core plus
3-5 ordinary sell-only crystal rewards. The Core receives 50-60% of the value,
and all chamber rewards always total the exact generated structure value.

ANCIENT SHRINE
--------------
Break both ritual seals (2 seconds each) to unlock the central altar
(5 seconds). Sellable shrine rewards always add up to the structure value.
The altar also has a 50% chance to drop one of three Greater Potions. Each
Greater Potion has triple the corresponding standard potion's effect for the
normal five-minute duration.

Structure rewards now launch and settle like mined block drops. Ordinary
rewards use glowing orbs, while rewards with dedicated artwork keep it.
Legacy structure-container loot links are repaired when opened.

manifest.webmanifest
  PWA name, colors, display mode, orientation and icon paths.

service-worker.js
  Offline app shell and cache update logic. The cache name has been bumped
  for this package so browsers discard the previous deployment cache.

supabase-config.js
  Browser-safe Supabase configuration template. Replace the placeholders
  with your project URL and publishable/anon key.
  NEVER use a service_role key in a browser file.

supabase-schema.sql
  Current database schema for private JSONB saves and the public lifetime
  money leaderboard, including row-level-security policies.

icons/
  Favicon, Apple touch icon, standard PWA icons and maskable PWA icons.

DEPLOYMENT
----------
1. Replace the placeholders in supabase-config.js.
2. Upload index.html, manifest.webmanifest, service-worker.js,
   supabase-config.js and the icons folder to the same public root.
3. Deploy using HTTPS. Service workers and installation require HTTPS,
   except during localhost development.
4. Hard-refresh once after deployment if an older version is still visible.

SUPABASE
--------
- For a brand-new Supabase project, run supabase-schema.sql once in:
  Supabase Dashboard -> SQL Editor.
- If player_saves and leaderboard_entries already exist with the included
  policies and trigger, no migration is required.
- The structure system does not add database columns or tables. Structures,
  their opened containers and their collected loot are stored in save_data.
- Game progress is stored inside player_saves.save_data JSONB, so most new
  gameplay fields do not require a database migration.

IMPORTANT
---------
This package's index.html is the current playable source. The visual-lab files
remain separate development previews.
