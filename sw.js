const CACHE = "nina-game-v1";
const FILES = [
  "./",
  "./index.html",
  "./cozinha.html",
  "./quarto.html",
  "./banheiro.html",
  "./loja.html",
  "./jogo.html",
  "./assets/css/style.css",
  "./assets/js/game.js",
  "./assets/icons/icon.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
