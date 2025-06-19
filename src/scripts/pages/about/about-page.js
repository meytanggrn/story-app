export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <p>Story App adalah aplikasi berbagi cerita yang memungkinkan pengguna untuk menulis, membagikan, dan menemukan kisah-kisah inspiratif dari berbagai pengalaman hidup. Kami percaya bahwa setiap cerita 
        memiliki kekuatan untuk menginspirasi dan menghubungkan manusia satu sama lain.</p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
