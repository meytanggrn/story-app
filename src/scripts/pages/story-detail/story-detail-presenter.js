// src/pages/story-detail/story-detail-presenter.js
import { getStoryDetail } from '../../data/api.js';
import { showLoading, closeLoading, showError } from '../../utils/alert.js';

export default class StoryDetailPresenter {
    constructor(view) {
        this.view = view;
    }

    async loadDetail(id) {
        showLoading('Memuat detail...');
        try {
            const data = await getStoryDetail(id);
            closeLoading();
            this.view.showStoryDetail(data.story);
        } catch (err) {
            closeLoading();
            this.view.showError(err.message);
            showError(err.message);
        }
    }
}
