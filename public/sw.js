// Hero Frames Service Worker
// Version this when you update the hero frames
const HERO_FRAMES_VERSION = 1;
const HERO_FRAMES_CACHE = `hero-frames-v${HERO_FRAMES_VERSION}`;

// Only cache hero frames - nothing else
const HERO_FRAMES_PATTERN = /\/hero-frames\/frame_\d+\.webp$/;

self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Only delete old hero-frames caches, leave everything else alone
          if (cacheName.startsWith("hero-frames-v") && cacheName !== HERO_FRAMES_CACHE) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle hero frame requests
  if (!HERO_FRAMES_PATTERN.test(url.pathname)) {
    return;
  }

  event.respondWith(
    caches.open(HERO_FRAMES_CACHE).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached frame
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(event.request).then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse.ok) {
            // Clone the response before caching (response can only be used once)
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
