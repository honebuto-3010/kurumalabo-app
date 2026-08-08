// ===============================
// キャッシュ名
// ===============================
const CACHE_NAME = "car-health-lab-v1";

// ===============================
// キャッシュするファイル一覧
// ===============================
const urlsToCache = [
  "/",
  "index.html",
  "manifest.webmanifest",

  "offline.html",   // ← これが必須！

  // Views
  "views/home.html",
  "views/oil.html",
  "views/graph.html",

  // CSS
  "css/header.css",
  "css/style.css",
  "css/oil.css",
  "css/graph.css",

  // JS
  "js/app.js",
  "js/oil.js",
  "js/graph.js",

  // Icons
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// ===============================
// インストール（初回読み込み時）
// ===============================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ===============================
// 有効化（古いキャッシュの削除）
// ===============================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// ===============================
// fetch（オフライン対応）
// ===============================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあれば返す
      if (response) return response;

      // ネットワークへ（失敗したら offline.html）
      return fetch(event.request).catch(() => {
        return caches.match("/offline.html");
      });
    })
  );
});
