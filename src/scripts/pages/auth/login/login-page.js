import LoginPresenter from './login-presenter.js';

export default class LoginPage {
    constructor() {
        this.presenter = new LoginPresenter(this);
    }

    render() {
        return `
<section class="login-section slide-in">
  <div class="login-container">
    <h1>Masuk Akun</h1>
    <form id="login-form">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required>
      <button type="submit">Login</button>
    </form>
    <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
    <div id="login-message"></div>
  </div>
</section>

    `;
    }

    afterRender() {
        document.getElementById('login-form').onsubmit = e => {
            e.preventDefault();
            this.presenter.handleLogin({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            });
        };
    }

    showMessage(msg, isError = false) {
        const el = document.getElementById('login-message');
        el.style.color = isError ? 'red' : 'green';
        el.innerText = msg;
    }
}
