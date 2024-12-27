const CACHE_NAME = "media-cache-v1";

// Install event: You can cache any static assets here if necessary
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll([]); // Add any static assets here if necessary
    })
  );
});

// Fetch event: Serve cached media or fetch and cache media dynamically
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only cache media requests (image or video files)
  if (
    event.request.destination === "image" ||
    event.request.destination === "video"
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If there's a cached response, return it
        return (
          cachedResponse ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              // Cache the media (image/video) for future use
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
    );
  }
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
