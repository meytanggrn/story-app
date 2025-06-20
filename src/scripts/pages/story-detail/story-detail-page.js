import StoryDetailPresenter from './story-detail-presenter.js';
import { playFadeTransition } from '../../utils/transitionHelper.js';
import { saveStory, getAllStories } from '../../utils/db.js'; // pastikan path sesuai struktur project

export default class StoryDetailPage {
  constructor() {
    this.presenter = new StoryDetailPresenter(this);
    this.story = null;
  }

  getIdFromUrl() {
    const hash = window.location.hash;
    const match = hash.match(/\/story-detail\/([^/]+)/);
    return match ? match[1] : null;
  }

  async render() {
    return `
      <main id="main-content" tabindex="-1" class="detail-main fade-in">
        <section id="detail-section">
          <div id="detail-loading">Memuat detail...</div>
          <button id="save-offline-btn" disabled>Memuat...</button>
        </section>
      </main>
    `;
  }

  async afterRender() {
    const id = this.getIdFromUrl();
    if (!id) {
      this.showError('ID story tidak valid.');
      return;
    }
    // Saat pertama render, disable tombol offline
    const saveBtn = document.getElementById('save-offline-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Memuat...';

    // Load story dari API
    this.presenter.loadDetail(id);

    // Cek jika sudah tersimpan di offline, baru aktifkan tombol
    const offlineStories = await getAllStories();
    const isAlreadySaved = offlineStories.some(s => String(s.id) === String(id));
    if (isAlreadySaved) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Sudah Tersimpan Offline';
      saveBtn.classList.add('saved-offline');
    } else {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Offline';
      saveBtn.classList.remove('saved-offline');
      // Tunggu storyObj tersedia setelah presenter.loadDetail selesai
      saveBtn.onclick = async () => {
        if (!this.story) {
          alert('Story belum siap disimpan.');
          return;
        }
        await saveStory(this.story);
        alert('Story tersimpan offline!');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Sudah Tersimpan Offline';
        saveBtn.classList.add('saved-offline');
      };
    }
  }

  showStoryDetail(story) {
    this.story = story; // Pastikan property story diisi untuk saveStory

    const locString = story.lat && story.lon
      ? `<div style="margin-top:.5em;">
            Latitude: <b>${story.lat}</b> &nbsp; 
            Longitude: <b>${story.lon}</b>
         </div>`
      : '';

    document.getElementById('detail-section').innerHTML = `
      <button id="btn-back" class="btn-back" aria-label="Kembali ke daftar story">&larr; Kembali</button>
      <article class="story-detail-card fade-in">
        <h2 tabindex="0">${story.name}</h2>
        <div class="detail-meta">
          <span><i class="fa fa-calendar"></i> ${new Date(story.createdAt).toLocaleDateString()}</span>
          <span><i class="fa fa-user"></i> Ditambahkan oleh: <b>${story.name}</b></span>
        </div>
        <div class="detail-location">
          ${story.city ? `<span><i class="fa fa-map-marker"></i> ${story.city}</span>` : ''}
          ${locString}
        </div>
        <div class="detail-image" style="margin:1em 0;">
          ${story.photoUrl
            ? `<img src="${story.photoUrl}" alt="Foto cerita ${story.name}" style="max-width:100%;border-radius:18px;"/>`
            : '<div class="story-placeholder" style="height:240px;"></div>'}
        </div>
        <div class="detail-description">
          <h3>Deskripsi</h3>
          <p>${story.description || '-'}</p>
        </div>
        ${story.lat && story.lon ? `
          <div class="detail-map-section">
            <h3>Peta Lokasi</h3>
            <div id="detail-map" style="width:100%;height:250px;border-radius:12px;overflow:hidden"></div>
          </div>
        ` : ''}
        <button id="save-offline-btn">Simpan Offline</button>
      </article>
    `;

    // Aktifkan kembali event handler simpan offline pada tombol baru
    this.afterRenderOfflineBtn();

    const backBtn = document.getElementById('btn-back');
    if (backBtn) {
      backBtn.onclick = () => {
        const main = document.querySelector('main');
        playFadeTransition(main, () => {
          window.location.hash = '/home';
        });
      };
    }

    if (story.lat && story.lon) {
      setTimeout(() => {
        if (typeof L === 'undefined') return;
        const map = L.map('detail-map').setView([story.lat, story.lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([story.lat, story.lon]).addTo(map).bindPopup('Lokasi Story').openPopup();
        setTimeout(() => map.invalidateSize(), 200);
      }, 100);
    }
  }

  // Fungsi terpisah agar tombol simpan tetap aktif setelah showStoryDetail render ulang
  async afterRenderOfflineBtn() {
    const id = this.getIdFromUrl();
    const saveBtn = document.getElementById('save-offline-btn');
    const offlineStories = await getAllStories();
    const isAlreadySaved = offlineStories.some(s => String(s.id) === String(id));
    if (isAlreadySaved) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Sudah Tersimpan Offline';
      saveBtn.classList.add('saved-offline');
    } else {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Simpan Offline';
      saveBtn.classList.remove('saved-offline');
      saveBtn.onclick = async () => {
        if (!this.story) {
          alert('Story belum siap disimpan.');
          return;
        }
        await saveStory(this.story);
        alert('Story tersimpan offline!');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Sudah Tersimpan Offline';
        saveBtn.classList.add('saved-offline');
      };
    }
  }

  showError(msg) {
    document.getElementById('detail-section').innerHTML =
      `<div class="error" style="color:red;margin:1em 0;">${msg}</div>`;
  }
}
