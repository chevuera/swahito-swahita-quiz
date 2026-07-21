const CACHE_NAME = "swahito-quiz-v3";
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "questions.js",
  "app.js",
  "manifest.webmanifest",
  "icon.svg",
  "assets/swahita-poster.png",
  "assets/swahito-graffiti.jpg",
  "assets/witlof-with-love.jpg",
  "assets/che-my-baby.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request)
    ))
  );
});
