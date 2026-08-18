document.addEventListener('DOMContentLoaded', () => {
    const btnComenzar = document.getElementById('btn-comenzar');
    const modalAuth = document.getElementById('modal-auth');
    const btnCloseModal = document.querySelector('.close-btn');

    // Abrir Modal
    btnComenzar.addEventListener('click', () => {
        modalAuth.classList.add('active');
    });

    // Cerrar Modal al hacer clic en la X
    btnCloseModal.addEventListener('click', () => {
        modalAuth.classList.remove('active');
    });

    // Cerrar Modal al hacer clic fuera del cuadro blanco
    modalAuth.addEventListener('click', (e) => {
        if (e.target === modalAuth) {
            modalAuth.classList.remove('active');
        }
    });
});