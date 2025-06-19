import * as StoryAPI from '../../../data/api';
import { showLoading, closeLoading, showError, showSuccess } from '../../../utils/alert';
export default class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    async handleRegister({ name, email, password }) {
        showLoading("Mendaftarkan");
        try {
            const result = await StoryAPI.register({ name, email, password });
            if (result.error) {
                this.view.showMessage(result.message, true);
            } else {
                showSuccess("Registrasi sukses! Silahkan Login");
                window.location.hash = '/login';
            }
        } catch (err) {
            this.view.showMessage('Gagal register: ' + err.message, true);
        }
    }
}
