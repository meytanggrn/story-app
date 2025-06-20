import { getAllStories, deleteStory } from '../../utils/db.js';

export default class OfflinePage {
  async render() {
    return `
      <main id="main-content" tabindex="-1">
        <section>
          <h2>Story Tersimpan Offline</h2>
          <div id="offline-grid" class="story-grid"></div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    const grid = document.getElementById('offline-grid');
    const stories = await getAllStories();

    if (!stories.length) {
      grid.innerHTML = '<div><em>Belum ada story offline.</em></div>';
      return;
    }

    grid.innerHTML = stories.map(story => `
      <div class="story-card">
        <div class="story-image">
          ${story.photoUrl
            ? `<img src="${story.photoUrl}" alt="Foto story ${story.name}"/>`
            : `<div class="story-placeholder"></div>`}
        </div>
        <div class="story-content">
          <h2>${story.name || '-'}</h2>
          <p>${story.description || ''}</p>
          <div class="story-date">
            ${story.createdAt ? (new Date(story.createdAt).toLocaleDateString()) : ''}
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <a href="#/story-detail/${story.id}" class="btn-detail-story">Detail</a>
            <button class="delete-offline-btn" data-id="${story.id}" style="margin-left:0;">Hapus</button>
          </div>
        </div>
      </div>
    `).join('');

    // Listener hapus
    grid.querySelectorAll('.delete-offline-btn').forEach(btn => {
      btn.onclick = async () => {
        if (confirm('Hapus story offline ini?')) {
          await deleteStory(btn.dataset.id);
          btn.closest('.story-card').remove();
        }
      };
    });
  }
}
