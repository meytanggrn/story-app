import NewStoryPresenter from './new-story-presenter.js';
import MapPicker from '../../utils/map.js';
import { showLoading } from '../../utils/alert.js';
import { playSlideTransition } from '../../utils/transitionHelper.js';


export default class NewStoryPage {
    constructor() {
        this.presenter = new NewStoryPresenter(this);
        this.photoBlob = null;
        this.lat = null;
        this.lon = null;
        this.isCameraOpen = false;
    }

    async render() {
        return `
      <main class="new-story-main slide-in">
      <button id="btn-back" class="btn-back" aria-label="Kembali ke daftar story">&larr; Kembali</button>
        <form id="new-story-form" class="new-story-form" autocomplete="off">
          <h2>Tambah Cerita</h2>
          <hr class="form-divider" />
          <label for="camera"><b>Unggah Foto atau Ambil dari Kamera</b></label>
          <input type="file" id="photo-input" name="photo" accept="image/*" aria-label="Pilih foto" />
          <button type="button" id="camera-btn" class="camera-btn">
            <span>📷</span> Buka Kamera
          </button>
          <div id="camera-container" class="camera-preview" style="display:none;"></div>
          <img id="img-preview" alt="Preview Foto" style="max-width:100%;display:none;margin-top:12px;"/>

          <label for="description"><b>Deskripsi Cerita</b></label>
          <textarea id="description" name="description" placeholder="Tulis deskripsi cerita di sini..." required></textarea>

          <label for="location"><b>Pilih Lokasi</b></label>
          <div id="map-container" class="map-container"></div>

          <button type="submit" class="submit-btn">Tambah Cerita</button>
        </form>
        <div id="add-story-msg"></div>
      </main>
    `;
    }

    async afterRender() {
        const photoInput = document.getElementById('photo-input');
        const cameraBtn = document.getElementById('camera-btn');
        const cameraContainer = document.getElementById('camera-container');
        const imgPreview = document.getElementById('img-preview');
        const backBtn = document.getElementById('btn-back');
        if (backBtn) {
        backBtn.onclick = () => {
            const main = document.querySelector('main');
            playSlideTransition(main, () => {
            window.location.hash = '/home';
            });
        };
        }


        // File upload
        photoInput.onchange = () => {
            const file = photoInput.files[0];
            if (file) {
                if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
                    this.showError('Foto harus gambar < 1MB!');
                    photoInput.value = '';
                    return;
                }
                this.photoBlob = file;
                imgPreview.src = URL.createObjectURL(file);
                imgPreview.style.display = 'block';
                cameraContainer.style.display = 'none';
                this.isCameraOpen = false;
            }
        };

        // Kamera (webcam)
        cameraBtn.onclick = async (e) => {
            e.preventDefault();
            if (this.isCameraOpen) return;
            this.isCameraOpen = true;
            cameraContainer.style.display = 'block';
            cameraContainer.innerHTML = `
        <video id="video" width="320" height="240" autoplay></video>
        <button type="button" id="capture-btn">Ambil Foto</button>
        <button aria-label type="button" id="close-camera-btn">Tutup Kamera</button>
      `;
            imgPreview.style.display = 'none';
            photoInput.value = '';

            const video = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            document.getElementById('capture-btn').onclick = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob.size > 1024 * 1024) {
                        this.showError('Ukuran gambar harus < 1MB!');
                        return;
                    }
                    this.photoBlob = blob;
                    imgPreview.src = URL.createObjectURL(blob);
                    imgPreview.style.display = 'block';
                    cameraContainer.style.display = 'none';
                    stream.getTracks().forEach(track => track.stop());
                    this.isCameraOpen = false;
                }, 'image/jpeg', 0.9);
            };

            document.getElementById('close-camera-btn').onclick = () => {
                stream.getTracks().forEach(track => track.stop());
                cameraContainer.style.display = 'none';
                this.isCameraOpen = false;
            };
        };

        // MAP Picker
        new MapPicker('map-container', (latlng) => {
            this.lat = latlng.lat;
            this.lon = latlng.lng;
        });

        // Form submit
        document.getElementById('new-story-form').onsubmit = (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value.trim();
            if (!this.photoBlob) {
                this.showError('Pilih atau ambil foto terlebih dahulu!');
                return;
            }
            if (!description) {
                this.showError('Deskripsi harus diisi!');
                return;
            }
            showLoading("Menyimpan cerita...")
            this.presenter.saveStory({
                description,
                photo: this.photoBlob,
                lat: this.lat,
                lon: this.lon
            });
        };
        
    }

}
