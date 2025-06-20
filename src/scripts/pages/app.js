import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import renderNavbar from '../../scripts/components/navbar';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();

    if (this.#content) {
      this.#content.style.viewTransitionName = 'navigation';
    }
    // === REGISTER SERVICE WORKER SEKALI SAJA ===
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('Service Worker registered!', reg);
          }).catch(err => {
            console.error('Service Worker failed:', err);
          });
      });
    }
  }

  get mainContentElement() {
    return this.#content;
  }

  #setupDrawer() {
    if (!this.#drawerButton || !this.#navigationDrawer) return;

    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    renderNavbar();
    const url = getActiveRoute();
    const PageClass = routes[url];

    if (!PageClass) {
      this.#content.innerHTML = `<h2>404 Not Found</h2>`;
      return;
    }

    const pageInstance = new PageClass();

    const renderContent = async () => {
      const html = await pageInstance.render();
      this.#content.innerHTML = html;

      if (typeof pageInstance.afterRender === 'function') {
        await pageInstance.afterRender();
      }
    };

    if (document.startViewTransition) {
      return document.startViewTransition(() => renderContent());
    } else {
      return renderContent();
    }

  }


}

export default App;
