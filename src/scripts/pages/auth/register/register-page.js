import RegisterPresenter from './register-presenter.js';
import { showLoading, closeLoading, showError, showSuccess } from '../../../utils/alert';
export default class RegisterPage {
    constructor() {
        this.presenter = new RegisterPresenter(this);
    }

    render() {
        return `
        <main class="auth-main">
        <h1>Daftar Akun</h1>

        <form id="register-form" class="auth-form">
            <div class="form-group">
            <label for="name">Nama</label>
            <input id="name" name="name" type="text" required />
            </div>

            <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
            </div>

            <div class="form-group">
            <label for="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                required
                minlength="6"
            />
            </div>

            <button type="submit">Daftar</button>
        </form>

        <p>Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
        <div id="register-message"></div>
        </main>
    `;
    }

    afterRender() {
        document.getElementById('register-form').onsubmit = e => {
            e.preventDefault();
            this.presenter.handleRegister({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            });
        };
    }

    showMessage(msg, isError = false) {
        const el = document.getElementById('register-message');
        el.style.color = isError ? 'red' : 'green';
        el.innerText = msg;
    }
}
