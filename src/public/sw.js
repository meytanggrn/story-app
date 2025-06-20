self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notifikasi Baru!';
    const options = {
        body: data.body || 'Ada update baru dari aplikasi.',
        icon: '/icons/icon-192.png',
        data: data, // simpan data tambahan (misal id)
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    // Misal data mengandung ID story, buka halaman detail
    if (event.notification.data && event.notification.data.id) {
        event.waitUntil(
            clients.openWindow('/#/detail/' + event.notification.data.id)
        );
    } else {
        event.waitUntil(clients.openWindow('/'));
    }
});

const CACHE_NAME = 'storyapp-shell-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192.jpg',
    '/icons/icon-512.png',
    '/src/scripts/app.js',      // JS utama (ganti sesuai struktur)
    '/src/styles/styles.css',      // CSS utama (ganti sesuai struktur)
    // Tambahkan lagi jika perlu
];


// Install: cache shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((c) => c !== CACHE_NAME)
                    .map((c) => caches.delete(c))
            )
        )
    );
    self.clients.claim();
});

// Fetch: cache-first utk shell, network-first utk dynamic/data
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Untuk navigasi (klik link, reload, dll) => balas selalu index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/index.html').then((res) => res || fetch(event.request))
        );
        return;
    }

    const url = new URL(event.request.url);

    // Shell static: cache-first
    if (urlsToCache.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then(
                (res) => res || fetch(event.request)
            )
        );
        return;
    }

    // Dynamic/data/API: network-first, fallback ke cache
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/')) {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    // Simpan respons baru
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, resClone);
                    });
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Fallback: cache-first
    event.respondWith(
        caches.match(event.request).then(
            (res) => res || fetch(event.request)
        )
    );
});

