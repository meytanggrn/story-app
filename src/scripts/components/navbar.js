function renderNavbar() {
    const menu = document.getElementById('navbar-menu');
    const token = localStorage.getItem('story_token');

    if (token) {
        menu.innerHTML = `
      <li><a href="#/home">Beranda</a></li>
      <li><a href="#/new-story">Add Story</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#" id="logout-link">Logout</a></li>
    `;

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('story_token');
            location.href = '#/login';
            renderNavbar(); 
        });
    } else {
        menu.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
    }
}

export default renderNavbar;
