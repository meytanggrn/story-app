
import { getStories } from '../../data/api';
import { showLoading, closeLoading, showError } from '../../utils/alert';
export default class HomePresenter {
    constructor(view) {
        this.view = view;
    }

    async loadStories() {
        showLoading('Memuat cerita...');
        try {
            const result = await getStories({ size: 16 });
            closeLoading();
            const stories = result.listStory || [];
            if (!stories.length) {
                this.view.showNoData();
            } else {
                this.view.showStories(stories.slice(0, 16));
            }
        } catch (err) {
            closeLoading();
            this.view.showError(err.message);
            showError(err.message);
        }
    }
}
