const CACHE_NAME = 'tapcount-v1.0.9';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// During installation, cache the essential shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first strategy for HTML, cache-first for other assets
self.addEventListener('fetch', (event) => {
  const isHtml = event.request.mode === 'navigate' || 
                 event.request.url.endsWith('/') || 
                 event.request.url.endsWith('index.html');

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (event.request.url.startsWith(self.location.origin)) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
