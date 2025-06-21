import { subscribeUserToPush } from '../utils/push';

function renderNavbar() {
  const menu = document.getElementById('navbar-menu');
  const token = localStorage.getItem('story_token');

  if (token) {
    menu.innerHTML = `
      <li><a href="#/home">Beranda</a></li>
      <li><a href="#/new-story">Add Story</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#/offline">Cerita Tersimpan</a></li>
      <li>
          <button id="notif-btn" style="margin-left:8px;display:flex;align-items:center;gap:6px;">
            <svg id="notif-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.918 18 13V10c0-3.07-1.63-5.64-5-5.95V3a1 1 0 00-2 0v1.05C7.63 4.36 6 6.92 6 10v3c0 .918-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0h-6"/>
            </svg>
            <span id="notif-text">Aktifkan Notifikasi</span>
          </button>
      </li>
      <li><a href="#" id="logout-link">Logout</a></li>
    `;

    // Listener Logout
    const logoutBtn = document.getElementById('logout-link');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('story_token');
        location.href = '#/login';
        renderNavbar();
      });
    }

    // Listener Notif
    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn) {
      notifBtn.onclick = () => {
        console.log('Tombol notifikasi diklik!');
        subscribeUserToPush();
      };
    }

  } else {
    menu.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}

export default renderNavbar;
