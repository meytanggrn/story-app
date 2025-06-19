import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  const skipLink = document.querySelector('.skip-link');

  if (skipLink) {
    skipLink.addEventListener('click', async (event) => {
      event.preventDefault();
      skipLink.blur();

      // Pastikan halaman selesai dirender (kalau ada perubahan hash)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const mainContent = app.mainContentElement;
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus({ preventScroll: true });
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
