import HomePresenter from './home-presenter.js';
import { clearToken } from '../../utils/auth.js';
import { playFadeTransition } from '../../utils/transitionHelper.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <main class="fade-in">
        <h1>Home Page</h1>
        <a href="#/new-story" class="btn-add-story">+ Tambah Cerita Baru</a>
        <div id="home-message"></div>
        <section class="story-grid" id="story-grid"></section>
      </main>
    `;
  }

  async afterRender() {
    this.presenter.loadStories();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        clearToken();
        window.location.hash = '/login';
        window.location.reload();
      };
    }

    const toggleBtn = document.getElementById('navbar-toggle');
    const navLinks = document.getElementById('navbar-links');
    if (toggleBtn && navLinks) {
      toggleBtn.onclick = function () {
        navLinks.classList.toggle('show');
      };
      document.addEventListener('click', function (event) {
        if (!navLinks.contains(event.target) && !toggleBtn.contains(event.target)) {
          navLinks.classList.remove('show');
        }
      });
    }
  }

  // showLoading() {
  //   document.getElementById('home-message').innerText = 'Memuat cerita...';
  //   document.getElementById('story-grid').innerHTML = '';
  // }

  showNoData() {
    document.getElementById('home-message').innerText = 'Tidak ada cerita ditemukan.';
  }

  showStories(stories) {
    const container = document.getElementById('story-grid');
    document.getElementById('home-message').innerText = '';

    container.innerHTML = stories.map(story => `
      <div class="story-card fade-in">
        <div class="story-image">
          ${story.photoUrl
            ? `<img src="${story.photoUrl}" alt="Foto cerita ${story.name}" loading="lazy" />`
            : `<div class="story-placeholder"></div>`
          }
        </div>
        <div class="story-content">
          <h2>${story.name}</h2>
          <p>${story.description || '-'}</p>
          <p class="story-date">
            <strong>Tanggal:</strong> ${new Date(story.createdAt).toLocaleDateString()}
          </p>
          <button class="btn-detail-story" data-id="${story.id}">Selengkapnya</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-detail-story').forEach(btn => {
      btn.onclick = (e) => {
        const id = btn.getAttribute('data-id');
        const main = document.querySelector('main');
        playFadeTransition(main, () => {
          window.location.hash = `/story-detail/${id}`;
        });
      };
    });
  }

  showError(msg) {
    document.getElementById('home-message').innerHTML =
      `<span style="color:red;">Gagal memuat cerita: ${msg}</span>`;
  }
}
