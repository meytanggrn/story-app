

export default class MapPicker {
    constructor(containerId, onPick) {
        this.containerId = containerId;
        this.onPick = onPick;
        this.map = null;
        this.marker = null;
        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        container.style.height = '250px';

        this.map = L.map(this.containerId).setView([-6.2, 106.8], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.setUserLocation();

        this.map.on('click', (e) => {
            this.setMarker(e.latlng);
            if (this.onPick) this.onPick(e.latlng);
        });
    }

    setUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLatLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.map.setView(userLatLng, 15);
                    this.setMarker(userLatLng);
                    if (this.onPick) this.onPick(userLatLng);
                },
                (error) => {
                    console.warn('Gagal mendapatkan lokasi pengguna:', error.message);
                }
            );
        }
    }

    setMarker(latlng) {
        if (this.marker) {
            this.marker.setLatLng(latlng);
        } else {
            this.marker = L.marker(latlng, { draggable: true }).addTo(this.map).bindPopup('Lokasi Anda').openPopup();

            this.marker.on('dragend', () => {
                const newLatLng = this.marker.getLatLng();
                if (this.onPick) this.onPick(newLatLng);
            });
        }
    }
}
