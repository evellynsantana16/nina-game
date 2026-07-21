// Service Worker de limpeza.
// Ele não intercepta requisições. Serve apenas para substituir
// a versão antiga que causava erro com os redirecionamentos da Vercel.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      self.registration.unregister(),
      caches.keys().then(names =>
        Promise.all(
          names
            .filter(name => name.startsWith("nina-game-"))
            .map(name => caches.delete(name))
        )
      ),
      self.clients.claim()
    ])
  );
});
