const CACHE_NAME = "car-health-lab-v1";

const urlsToCache = [
  "index.html",
  "manifest.webmanifest",
  "offline.html",

  // Views（フォルダなし）
  "home.html",
  "oil.html",
  "graph.html",

  // CSS
  "header.css",
  "style.css",
  "oil.css",
  "graph.css",

  // JS
  "app.js",
  "oil.js",
  "graph.js",

  // Icons
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

