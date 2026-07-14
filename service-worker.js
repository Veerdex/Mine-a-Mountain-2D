const CACHE_NAME = "mountain-tycoon-pwa-v36-audio-fix";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./supabase-config.js",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./audio/Coin.mp3",
  "./audio/Confirmation.mp3",
  "./audio/Force_Field_1.mp3",
  "./audio/Force_Field_2.mp3",
  "./audio/Force_Field_3.mp3",
  "./audio/Force_Field_4.mp3",
  "./audio/Force_Field_5.mp3",
  "./audio/Generator.mp3",
  "./audio/Glass_Metal_Pickaxe_Hit_1.mp3",
  "./audio/Glass_Metal_Pickaxe_Hit_2.mp3",
  "./audio/Laser_1.mp3",
  "./audio/Laser_2.mp3",
  "./audio/Laser_3.mp3",
  "./audio/Laser_4.mp3",
  "./audio/Light_Metal_Pickaxe_Hit.mp3",
  "./audio/Metal_Pickaxe_Hit.mp3",
  "./audio/Powerful_Laser.mp3",
  "./audio/SciFi_Activation.mp3",
  "./audio/Select.mp3",
  "./audio/Step_On_Grass.mp3",
  "./audio/Step_On_Snow.mp3",
  "./audio/Step_On_Stone.mp3",
  "./audio/Step_On_Wood.mp3",
  "./audio/Switch.mp3",
  "./audio/Toggle.mp3",
  "./audio/Treasure_Chest_Opened.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Do not intercept Supabase or any other external request.
  if (url.origin !== self.location.origin) return;

  // Network-first navigation so deployed updates appear immediately,
  // with the cached game as an offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches
              .open(CACHE_NAME)
              .then(cache => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ||
          (await caches.match("./index.html")) ||
          (await caches.match("./"))
        )
    );
    return;
  }

  // Cache-first static assets.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (!response || !response.ok || response.type !== "basic") {
          return response;
        }

        // Don't cache partial responses (206) — audio range requests
        if (response.status === 206) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
