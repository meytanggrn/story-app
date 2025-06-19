export function showLoading(text = 'Memuat...') {
    Swal.fire({
        title: text,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

export function closeLoading() {
    Swal.close();
}

export function showSuccess(msg = 'Berhasil!') {
    Swal.fire({
        icon: 'success',
        title: msg,
        timer: 1200,
        showConfirmButton: false,
    });
}

export function showError(msg = 'Terjadi kesalahan!') {
    Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: msg,
        timer: 2000,
        showConfirmButton: false,
    });
}
