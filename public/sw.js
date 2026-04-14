const CACHE_NAME = 'tapcount-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/ui.js',
  '/src/counter.js',
  '/src/storage.js',
  '/src/settings.js',
  '/src/audio.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
