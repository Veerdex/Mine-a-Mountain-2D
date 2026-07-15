# Mountain Tycoon Planet Expansion Guide

Version 20 keeps Earth behavior intact while moving planet-sensitive content
behind a registry. A world now permanently stores its planetId, and a missing
planet pack is reported instead of silently loading that save as Earth.

## Adding a planet

1. Copy planets/planet-template.js.
2. Give the file and planet a permanent lowercase ID.
3. Keep every released block key permanent. Saves still use numeric block IDs
   internally, while stable keys make definitions readable and resolvable.
4. Add the new script tag immediately after planets/planet-packs.js and before
   the main inline game script in index.html.
5. Set available to true when the planet is playable.
6. Add the new planet script to APP_SHELL in service-worker.js.

Planet packs must load before the main game. The registry locks before the
world and inventory arrays are allocated.

Registration is transactional. If a pack contains an invalid or duplicate
block reference, all blocks tentatively added by that pack are rolled back so
later planets keep stable numeric IDs. Runtime callbacks are also isolated: a
failing event, shop, liquid, hazard, drawing hook, or generator is reported in
the console without stopping Earth's game loop. A failed custom mountain
generator falls back to the standard generator.

## Planet definition areas

- blocks: appended block, ore, hazard, liquid, and item definitions.
- terrain: stable block keys for surface, subsurface, underground, and deep.
- mountainTiers: labels, dimensions, prices, and any planet-specific metadata.
- content.oreTypes: resources allowed in this planet's ore generation.
- content.firstOreByTier: optional deep preview ore for the following tier.
- content.hazards: generated hazards and their mine/contact/update handlers.
- content.liquids: core or generic flowing liquids and contact behavior.
- content.structures: structure definitions; custom definitions may provide a
  build function.
- content.oreBookRows: collection-book rows for this planet.
- equipmentShops: extra physical zones appended inside the Equipment Shop.
- events: saved interval events with canTrigger, trigger, and update handlers.
- hooks: lifecycle, generation, update, and drawing extension points.

## Block capacity and compatibility

The live world grid is now Uint16 instead of Uint8. Existing Earth IDs remain
unchanged, while all installed planets can use up to 65,535 total block types.
New definitions are appended; never reorder or remove released block entries.

## Built-in generation hooks

- onWorldActivated
- beforeBaseWorld
- afterBaseWorld
- beforeMountainGeneration
- modifyMountainHeights
- afterMountainTerrain
- beforeDeposits
- afterDeposits
- afterMountainGeneration
- generateMountain
- update
- drawBackground
- drawWorldBeforeTerrain
- drawWorldAfterPlayer

Returning anything except false from generateMountain marks the custom
generator as complete. Its context also contains generateDefault so a planet
can run Earth-compatible generation first and then modify the result.

## Custom block artwork

A block may reuse a built-in 16-bit motif through its motif field. It may also
provide paint16Bit, which receives a 16×16 canvas context, deterministic random
function, color helpers, and the block definition.

Useful optional block fields include:

- lightRadius
- specialVisual
- renderAlpha
- hazard
- collectible
- deposit
- tier, spawnRate, clumpMin, and clumpMax

## Generic liquids

A non-core liquid automatically receives an active-cell queue and volume-
preserving gravity/side-flow behavior. Configure interval, horizontalSearch,
breaksPlacedObjects, overlayPlayer, onPlayerContact, or provide a custom update
function. Active cells are rebuilt from the saved world when loading.

## Planet Equipment Shop extensions

Every equipmentShops entry receives a physical zone, sign, generic modal, and
save-aware runtime context. render may return HTML or a DOM node. onOpen and
onClose can attach and remove interactions. The context provides getCash,
spendCash, grantItem, inventoryCount, and persistent planet saveData.

## Runtime context

Hooks and handlers receive the active planet, planetState, raw world grid,
block registry, player, camera, mountain, settings, tile helpers, block-key
resolver, toast/death/explosion helpers, and task-specific values.

Planet-specific persistent state belongs in planetState.data or the applicable
eventState. It is included in local and cloud saves automatically.

## Database

No new Supabase table is needed. planetId and planetState live inside each
private world entry in player_saves.save_data JSONB. The existing Row Level
Security policies continue to protect the complete three-slot collection.
