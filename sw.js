// 網路優先：有網路時永遠載入最新版，離線時才用快取
const CACHE = 'aed-remote-v2';
const FILES = ['./', './index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)).catch(() => {}); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
