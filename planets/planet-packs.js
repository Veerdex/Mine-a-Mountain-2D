// Planet packs must be queued before the main game script starts.
// Add finished planet definitions to this array. The game validates and locks
// the registry before allocating its world and inventory arrays.
window.MOUNTAIN_TYCOON_PLANET_PACKS =
  window.MOUNTAIN_TYCOON_PLANET_PACKS || [];

// Example:
// window.MOUNTAIN_TYCOON_PLANET_PACKS.push(MY_PLANET_DEFINITION);
//
// Start by copying planet-template.js and then load that finished file from
// index.html before the main inline game script, or paste its definition here.
