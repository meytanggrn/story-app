export default class Camera {
    constructor(containerId, onCapture) {
        this.container = document.getElementById(containerId);
        this.onCapture = onCapture;
        this.stream = null;
        this.video = null;
        this.canvas = null;
        this.captureButton = null;
        this.imgPreview = null;
        this.init();
    }

    async init() {
        this.container.innerHTML = `
      <video id="camera-video" autoplay playsinline width="320" height="240"></video>
      <button type="button" id="capture-btn">Ambil Foto</button>
      <canvas id="camera-canvas" style="display:none;"></canvas>
      <img id="preview-img" style="display:none;max-width:100%;margin-top:8px;"/>
    `;
        this.video = this.container.querySelector('#camera-video');
        this.canvas = this.container.querySelector('#camera-canvas');
        this.captureButton = this.container.querySelector('#capture-btn');
        this.imgPreview = this.container.querySelector('#preview-img');

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = this.stream;
        } catch (err) {
            this.container.innerHTML = `<p style="color:red;">Tidak bisa akses kamera: ${err.message}</p>`;
            return;
        }

        this.captureButton.onclick = () => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.canvas.getContext('2d').drawImage(this.video, 0, 0);
            this.canvas.toBlob(blob => {
                if (blob.size > 1024 * 1024) {
                    alert('Ukuran gambar harus < 1MB!');
                    return;
                }
                this.imgPreview.src = URL.createObjectURL(blob);
                this.imgPreview.style.display = 'block';
                this.onCapture(blob);
            }, 'image/jpeg', 0.9);
        };
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}
