import { subscribeUserToPush } from '../utils/push';

function renderNavbar() {
  const menu = document.getElementById('navbar-menu');
  const token = localStorage.getItem('story_token');

  if (token) {
    menu.innerHTML = `
      <li><a href="#/home">Beranda</a></li>
      <li><a href="#/new-story">Add Story</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#/offline">Offline</a></li>
      <li><a href="#" id="logout-link">Logout</a></li>
      <li><button id="notif-btn" style="margin-left:8px;">Aktifkan Notifikasi</button></li>
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
      notifBtn.onclick = subscribeUserToPush;
    }

  } else {
    menu.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}

export default renderNavbar;
