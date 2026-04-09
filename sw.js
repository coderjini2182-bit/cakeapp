const CACHE_NAME = 'cake-maker-v14';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './img/cakes/2D/strawberry.png','./img/cakes/2D/choco.png','./img/cakes/2D/choco2.png','./img/cakes/2D/strawberry_roll.png',
  './img/cakes/2D/rainbow.png','./img/cakes/2D/carrot.png','./img/cakes/2D/strawberry2.png',
  './img/cakes/2D/whippedcream2.png','./img/cakes/2D/cheesecake.png','./img/cakes/2D/cookie.png','./img/cakes/2D/mandarin.png',
  './img/cakes/2D/tiramisu.png',
  './img/cakes/real/strawberry2.png','./img/cakes/real/whippedcream.png',
  './img/candles/red.png','./img/candles/orange.png','./img/candles/yellow.png','./img/candles/green.png',
  './img/candles/skyblue.png','./img/candles/pink.png','./img/candles/purple.png',
  './img/candles/Apricot.png','./img/candles/black.png','./img/candles/emerald.png',
  './img/candles/light_purple.png','./img/candles/white.png',
  './img/backgrounds/christmas1.png','./img/backgrounds/christmas2.png',
  './img/backgrounds/bg_skyblue.png','./img/backgrounds/bg_pink.png',
  './img/backgrounds/bg_lightyellow.png','./img/backgrounds/bg_lavender.png','./img/backgrounds/bg_mint.png',
  './img/backgrounds/party1.png','./img/backgrounds/party2.png',
  './img/backgrounds/part3.png','./img/backgrounds/part4.png',
  './img/toppings/cherry.svg',
  './bgm/delon_boomkin-happy-birthday-music-box-426283.mp3',
  './bgm/scottishperson-sound-effect-longer-happy-birthday-music-box-361278.mp3',
  './bgm/shidenbeatsmusic-happy-birthday-to-you-bossa-nova-style-arrangement-21399.mp3',
  './bgm/twisterium-happy-birthday-482411.mp3'
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
      fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
