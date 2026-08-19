document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VERIFICAR AUTENTICACIÓN
    const currentUserStr = localStorage.getItem('brainbox_current_user');
    
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }

    // 2. MOSTRAR NOMBRE DEL USUARIO Y FOTO
    const currentUser = JSON.parse(currentUserStr);
    const greetingElement = document.getElementById('user-greeting');
    
    let firstName = currentUser.fullName.split(' ')[0];
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    if (greetingElement) {
        greetingElement.textContent = `¡Hola, ${firstName}! 👋`;
    }

    const avatarContainer = document.getElementById('user-avatar-container');
    
    if (avatarContainer) {
        avatarContainer.innerHTML = '';
        if (currentUser.profilePic) {
            const img = document.createElement('img');
            img.src = currentUser.profilePic;
            img.alt = "Foto de perfil";
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            
            avatarContainer.appendChild(img);
        }
    }

    // 3. LÓGICA DE CERRAR SESIÓN (Botón Rojo con Confirmación)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Aparece la ventana de confirmación del navegador
            const confirmarSalida = confirm("¿Estás seguro que deseas cerrar sesión?");
            
            if (confirmarSalida) {
                // Borramos al usuario actual de la memoria local
                localStorage.removeItem('brainbox_current_user');
                // Redirigimos al inicio
                window.location.href = '../index.html';
            }
        });
    }
});