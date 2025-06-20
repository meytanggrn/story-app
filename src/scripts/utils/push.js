const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Utility untuk konversi base64 ke Uint8Array (VAPID)
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

/**
 * Minta izin push notifikasi, lakukan subscribe, dan kirim ke backend
 * @returns {Promise<void>}
 */
export async function subscribeUserToPush() {
    try {
        // Pastikan service worker siap
        const reg = await navigator.serviceWorker.ready;

        // Minta izin notifikasi
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Izinkan notifikasi untuk menerima update!');
            return;
        }

        // Subscribe push
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // Ambil token user dari localStorage (wajib login, token dari endpoint /login Dicoding)
        const token = localStorage.getItem('story_token');
        if (!token) {
            alert('Kamu harus login dulu sebelum mengaktifkan notifikasi.');
            return;
        }

        // Kirim subscription ke backend Dicoding
        const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
            method: 'POST',
            body: JSON.stringify({
                endpoint: sub.endpoint,
                keys: {
                    p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
                    auth: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth'))))
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!res.ok) {
            const msg = await res.text();
            alert('Gagal mengaktifkan push notification: ' + msg);
            return;
        }

        alert('Push notification aktif!');
    } catch (err) {
        alert('Gagal mengaktifkan push notification: ' + err.message);
        console.error(err);
    }
}
