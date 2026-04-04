const CACHE_NAME = 'cake-maker-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './img/cakes/strawberry.png','./img/cakes/choco.png','./img/cakes/strawberry_roll.png',
  './img/cakes/rainbow.png','./img/cakes/carrot.png','./img/cakes/dubai.png','./img/cakes/mango.png',
  './img/candles/red.png','./img/candles/orange.png','./img/candles/yellow.png','./img/candles/green.png',
  './img/candles/skyblue.png','./img/candles/pink.png','./img/candles/purple.png',
  './img/candles/Apricot.png','./img/candles/black.png','./img/candles/emerald.png',
  './img/candles/light_purple.png','./img/candles/white.png',
  './img/backgrounds/christmas1.png','./img/backgrounds/christmas2.png',
  './img/backgrounds/bg_skyblue.png','./img/backgrounds/bg_pink.png',
  './img/backgrounds/bg_lightyellow.png','./img/backgrounds/bg_lavender.png','./img/backgrounds/bg_mint.png',
  './img/toppings/cherry.svg'
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
