const CACHE_NAME = 'fortune-cookie-v1';
const urlsToCache = [
  '/src/index.html',
  '/src/script.js',
  '/src/style.css',
  '/src/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});