import * as StoryAPI from '../../../data/api';
import { setToken } from '../../../utils/auth';
import { showLoading, closeLoading, showError, showSuccess } from '../../../utils/alert';

export default class LoginPresenter {
    constructor(view) {
        this.view = view;
    }

    async handleLogin({ email, password }) {
        this.view.showMessage("mendaftarkan")
        try {
            const result = await StoryAPI.login({ email, password });
            if (result.error) {
                this.view.showMessage(result.message, true);
            } else {
                setToken(result.loginResult.token);
                showSuccess("Login berhasil!");
                setTimeout(() => {
                    window.location.hash = '/home';
                }, 1500); 
            }
        } catch (err) {
            this.view.showMessage('Gagal login: ' + err.message, true);
        }
    }
}
