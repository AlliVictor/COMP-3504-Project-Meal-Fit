const cacheName = 'my-pwa-cache-v1';
const assetsToCache = [
    '/index.html',
    '/styles/main.css',
    '/scripts/script.js',
    '/scripts/manifest.json',
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
    );
});

// Fetch from Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.filter(name => name !== cacheName).map(name => caches.delete(name))
            )
        )
    );
});