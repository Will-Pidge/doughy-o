// Service worker: keeps a copy of the app on the phone so it works with no internet.
const CACHE = 'doughy-o-v1';
const FILES = ['./', './index.html', './style.css', './app.js', './puzzles.json', './icon.svg', './doughy.svg', './manifest.json'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request))));
