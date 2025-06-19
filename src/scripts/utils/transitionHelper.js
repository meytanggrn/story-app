export async function playFadeTransition(element, renderContent) {
    if (!element) return;

    // Tambahkan efek keluar
    element.classList.remove('fade-in');
    element.classList.add('fade-out');

    await new Promise((resolve) => setTimeout(resolve, 300));

    await renderContent();

    // Tambahkan efek masuk
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
}

export async function playSlideTransition(element, renderContent) {
    if (!element) return;

    element.classList.remove('slide-in');
    element.classList.add('slide-out');

    await new Promise(resolve => setTimeout(resolve, 400)); // wait for slide-out

    await renderContent(); // e.g., window.location.hash = '/home'

    element.classList.remove('slide-out');
    element.classList.add('slide-in');
}
