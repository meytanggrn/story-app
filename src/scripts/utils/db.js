import { openDB } from 'idb';

// Inisialisasi DB dan store
export const dbPromise = openDB('story-app-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('stories')) {
            db.createObjectStore('stories', { keyPath: 'id' }); // keyPath: 'id' (misal id API)
        }
    }
});

// Simpan story (bisa 1 data/array, bisa dipakai saat online)
export async function saveStory(story) {
    const db = await dbPromise;
    await db.put('stories', story);
}

// Tampilkan semua story yang tersimpan (untuk halaman offline/favorit)
export async function getAllStories() {
    const db = await dbPromise;
    return db.getAll('stories');
}

// Hapus story by id
export async function deleteStory(id) {
    const db = await dbPromise;
    await db.delete('stories', id);
}
