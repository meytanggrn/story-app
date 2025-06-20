import { getAllStories, deleteStory } from '../../utils/db';

class OfflinePage {
    async render() {
        const stories = await getAllStories();
        return `
      <ul>
        ${stories.map(s => `
          <li>
            <b>${s.name}</b>
            <p>${s.description}</p>
            <button data-id="${s.id}" class="hapus-story">Hapus</button>
          </li>
        `).join('')}
      </ul>
    `;
    }

    async afterRender() {
        document.querySelectorAll('.hapus-story').forEach(btn => {
            btn.onclick = async () => {
                await deleteStory(btn.dataset.id);
                alert('Story dihapus dari offline.');
                location.reload();
            }
        });
    }
}
