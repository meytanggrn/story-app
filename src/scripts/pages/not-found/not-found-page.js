export default class NotFoundPage {
    async render() {
        return `
      <main id="main-content" tabindex="-1" style="padding: 32px; text-align:center;">
        <h2 style="font-size:2.2em;color:#ef4444;">404 - Halaman Tidak Ditemukan</h2>
        <a href="#/home" style="color:#2563eb;font-weight:bold;">Kembali ke Beranda</a>
        </p>
        <img src="/icons/icon-512.png" alt="404 Not Found" width="180" style="margin-top:2em;opacity:.7;" />
      </main>
    `;
    }
    async afterRender() { }
}
