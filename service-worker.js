const CACHE_NAME = "mountain-tycoon-pwa-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
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

  // Do not interfere with Supabase or other external APIs.
  if (url.origin !== self.location.origin) return;

  // Configuration must always come from the network. An old cached placeholder
  // would otherwise keep the app stuck in "SETUP NEEDED" after deployment.
  if (url.pathname.endsWith("/supabase-config.js")) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
    );
    return;
  }

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
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            (await caches.match("./index.html")) ||
            (await caches.match("./"))
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (
          !response ||
          !response.ok ||
          response.type !== "basic"
        ) {
          return response;
        }

        const copy = response.clone();
        caches
          .open(CACHE_NAME)
          .then(cache => cache.put(request, copy));

        return response;
      });
    })
  );
});
