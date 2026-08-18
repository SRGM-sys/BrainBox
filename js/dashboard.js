document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VERIFICAR AUTENTICACIÓN
    // Leemos el usuario actual de la memoria
    const currentUserStr = localStorage.getItem('brainbox_current_user');
    
    // Si no hay nadie logueado, lo devolvemos al index
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }

    // 2. MOSTRAR NOMBRE DEL USUARIO
    const currentUser = JSON.parse(currentUserStr);
    const greetingElement = document.getElementById('user-greeting');
    
    // Separamos el primer nombre y aseguramos que tenga mayúscula inicial
    let firstName = currentUser.fullName.split(' ')[0];
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    if (greetingElement) {
        greetingElement.textContent = `¡Hola, ${firstName}! 👋`;
    }

    // --- ACTUALIZAR LA FOTO DE PERFIL ---
    const avatarContainer = document.querySelector('.avatar-img');
    
    if (avatarContainer) {
        // Nos aseguramos de que el contenedor esté vacío inicialmente
        avatarContainer.innerHTML = '';

        // Si el usuario tiene una foto guardada en la base de datos local
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
        // Si no tiene foto (null o undefined), no hacemos nada.
        // El círculo se quedará con el color de fondo por defecto del CSS (#E2DDF8).
    }
    
    if (avatarImg) {
        if (currentUser.profilePic) {
            // Si el usuario subió foto, la mostramos
            avatarImg.src = currentUser.profilePic;
        } else {
            // Si no tiene foto, generamos un avatar bonito basado en su nombre
            avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        }
    }

    // 3. LÓGICA DE CERRAR SESIÓN (El botón de la puerta 🚪)
    const exitBtn = document.querySelector('.exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos la navegación por defecto
            
            // Borramos al usuario actual de la memoria (pero NO borramos la base de datos de usuarios)
            localStorage.removeItem('brainbox_current_user');
            
            // Redirigimos al inicio
            window.location.href = '../index.html';
        });
    }
});