const TOKEN_KEY = 'story_token';
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }
export function isLoggedIn() { return !!getToken(); }
export function renderNavbar() {
    const navList = document.getElementById('nav-list');
    if (!navList) return;

    if (isLoggedIn()) {
        navList.innerHTML = `
        <li><a href="#/home">Beranda</a></li>
        <li><a href="#/new-story">Add Story</a></li>
        <li><a href="#/about">About</a></li>
        <li><button id="logout-btn" style="margin-left:1em;">Logout</button></li>
    `;
    } else {
        navList.innerHTML = `
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
    `;
    }
}