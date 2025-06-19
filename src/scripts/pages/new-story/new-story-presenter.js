import { addStory } from '../../data/api';
import { showLoading, showError,showSuccess } from '../../utils/alert';

export default class NewStoryPresenter {
    constructor(view) {
        this.view = view;
    }

    async saveStory({ description, photo, lat, lon }) {

        try {
            await addStory({ description, photo, lat, lon });
            showSuccess('Cerita Berhasil ditambahkan!');
            setTimeout(() => window.location.hash = '/home', 1200);
        } catch (err) {
            showError('Gagal menambahkan cerita!');
        }
    }
}
