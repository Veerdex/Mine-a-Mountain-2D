// DEVELOPMENT TEMPLATE — this file is not loaded by index.html.
// Copy it, rename the planet and keys, then add its script tag directly after
// planet-packs.js. Planet block keys must remain stable after release.
(function () {
  const tiers = [
    { level: 1, width: 20, height: 9, label: "Landing Ridge", price: 0 },
    { level: 2, width: 31, height: 14, label: "Dust Mesa", price: 2500 },
    { level: 3, width: 46, height: 21, label: "Crater Wall", price: 18000 },
    { level: 4, width: 62, height: 30, label: "Iron Highlands", price: 200000 },
    { level: 5, width: 79, height: 40, label: "Ancient Caldera", price: 3500000 },
    { level: 6, width: 96, height: 50, label: "Olympian Rise", price: 90000000 },
    { level: 7, width: 113, height: 60, label: "Titan Escarpment", price: 2200000000 },
    { level: 8, width: 132, height: 70, label: "Red Colossus", price: 52000000000 },
    { level: 9, width: 151, height: 79, label: "Planetbreaker Rim", price: 1400000000000 },
    { level: 10, width: 169, height: 88, label: "Olympus Crown", price: 17000000000000 }
  ];

  window.MOUNTAIN_TYCOON_PLANET_PACKS.push({
    id: "planet-template",
    name: "Template Planet",
    description: "Replace this development example with a finished planet.",
    available: false,

    blocks: [
      {
        key: "surface-dust",
        name: "Template Dust",
        weight: 3,
        hardness: 1,
        value: 1,
        breakTime: 0.3,
        color: "#a65342",
        style: "material",
        motif: "dirt"
      },
      {
        key: "mantle-stone",
        name: "Template Stone",
        weight: 7,
        hardness: 2,
        value: 3,
        breakTime: 0.65,
        color: "#6e4f4b",
        style: "stone",
        motif: "stone"
      },
      {
        key: "deep-mantle",
        name: "Template Deepstone",
        weight: 20,
        hardness: 8,
        value: 15,
        breakTime: 1.4,
        color: "#3a2930",
        style: "deepstone",
        motif: "deepstone"
      },
      {
        key: "sky-iron",
        name: "Sky Iron",
        weight: 9,
        hardness: 4,
        value: 80,
        breakTime: 0.8,
        color: "#8fb2c2",
        style: "ore",
        motif: "ore",
        tier: 1,
        spawnRate: 7,
        clumpMin: 2,
        clumpMax: 7
      },
      {
        key: "storm-crystal",
        name: "Storm Crystal",
        weight: 4,
        hardness: 7,
        value: 900,
        breakTime: 1.1,
        color: "#83e8ff",
        style: "gem",
        motif: "crystal",
        tier: 2,
        spawnRate: 3,
        clumpMin: 1,
        clumpMax: 4,
        lightRadius: 5
      },
      {
        key: "charged-rock",
        name: "Charged Rock",
        weight: 0,
        hardness: 5,
        value: 0,
        breakTime: 0.7,
        color: "#f1d65a",
        style: "hazard",
        motif: "resonance",
        tier: 2,
        spawnRate: 0.6,
        clumpMin: 1,
        clumpMax: 3,
        hazard: true,
        collectible: false,
        deposit: false
      },
      {
        key: "coolant",
        name: "Alien Coolant",
        weight: 0,
        hardness: Infinity,
        value: 0,
        breakTime: Infinity,
        color: "#55e6c1",
        style: "liquid",
        motif: "water",
        renderAlpha: 0.7,
        tier: 1,
        spawnRate: 1,
        clumpMin: 10,
        clumpMax: 30,
        hazard: true,
        collectible: false,
        deposit: false
      }
    ],

    terrain: {
      surface: "planet-template.surface-dust",
      subsurface: "planet-template.surface-dust",
      underground: "planet-template.mantle-stone",
      deep: "planet-template.deep-mantle"
    },

    mountainTiers: tiers,

    content: {
      oreTypes: [
        "planet-template.sky-iron",
        "planet-template.storm-crystal"
      ],
      firstOreByTier: {
        2: "planet-template.storm-crystal"
      },
      hazards: [
        {
          id: "charged-rock",
          blockType: "planet-template.charged-rock",
          onMine: function (game) {
            game.setTile(game.x, game.y, game.resolveBlockType("earth.air"));
            game.explodeAt(game.x, game.y, 2.2, "Charged rock discharge");
            return true;
          }
        },
        {
          id: "coolant-contact",
          blockType: "planet-template.coolant"
        }
      ],
      liquids: [
        {
          id: "coolant",
          blockType: "planet-template.coolant",
          interval: 0.16,
          horizontalSearch: 5,
          frequencySetting: "waterFrequency",
          breaksPlacedObjects: true,
          onPlayerContact: function (game) {
            game.planetState.data.coolantSeconds =
              (Number(game.planetState.data.coolantSeconds) || 0) + game.dt;
          }
        }
      ],
      structures: [],
      oreBookRows: [
        ["planet-template.sky-iron"],
        ["planet-template.storm-crystal"]
      ]
    },

    equipmentShops: [
      {
        id: "environment-suits",
        label: "Environment Suits",
        description: "Planet-specific protective equipment belongs here.",
        width: 390,
        render: function () {
          return '<div class="detail-card"><h2>Environment Suits</h2><p>Add this planet’s suit upgrades here.</p></div>';
        }
      }
    ],

    events: [
      {
        id: "electrical-storm",
        interval: [120, 240],
        canTrigger: function (game) {
          return !!game.currentMountain;
        },
        trigger: function (game) {
          game.showToast("An electrical storm is building.");
          game.eventState.activeFor = 20;
        },
        update: function (game) {
          if (game.eventState.activeFor > 0) {
            game.eventState.activeFor = Math.max(
              0,
              game.eventState.activeFor - game.dt
            );
          }
        }
      }
    ],

    hooks: {
      modifyMountainHeights: function (game) {
        for (let x = 0; x < game.heights.length; x++) {
          game.heights[x] *= 0.92 + 0.08 * Math.sin(x * 0.21);
        }
      },
      afterMountainGeneration: function (game) {
        game.planetState.data.mountainsGenerated =
          (Number(game.planetState.data.mountainsGenerated) || 0) + 1;
      }
    }
  });
})();
