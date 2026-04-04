const CACHE_NAME = 'cake-maker-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './img/cakes/strawberry.png','./img/cakes/choco.png','./img/cakes/vanilla.png','./img/cakes/blueberry.png',
  './img/cakes/greentea.png','./img/cakes/redvelvet.png','./img/cakes/oreo.png','./img/cakes/carrot.png',
  './img/candles/stripe.png','./img/candles/gold.png','./img/candles/mint.png','./img/candles/pink.png',
  './img/candles/purple.png','./img/candles/rainbow.png','./img/candles/sky.png','./img/candles/coral.png','./img/candles/neon.png',
  './img/backgrounds/pink.jpg','./img/backgrounds/sky.jpg','./img/backgrounds/lavender.jpg','./img/backgrounds/gold.jpg',
  './img/backgrounds/mint.jpg','./img/backgrounds/party.jpg','./img/backgrounds/cloud.jpg','./img/backgrounds/rainbow.jpg',
  './img/backgrounds/cherry.jpg','./img/backgrounds/space.jpg','./img/backgrounds/aurora.jpg','./img/backgrounds/sunset.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // For navigation requests, always serve index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(r => r || fetch(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
