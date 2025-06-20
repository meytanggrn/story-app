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
