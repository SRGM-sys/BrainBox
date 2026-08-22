document.addEventListener('DOMContentLoaded', () => {

    // 1. VERIFICAR AUTENTICACIÓN
    const currentUserStr = localStorage.getItem('brainbox_current_user');
    
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }

    // 2. OBTENER USUARIO
    let currentUser = JSON.parse(currentUserStr);
    let userXp = currentUser.xp || 0;

    // 3. MOTOR DE LIGAS (Calculador de nivel y progreso)
    function getLevelInfo(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce', min: 0, max: 100 };
        if (xp < 200) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata', min: 100, max: 200 };
        if (xp < 300) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro', min: 200, max: 300 };
        if (xp < 500) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda', min: 300, max: 500 };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante', min: 500, max: 500 }; 
    }

    let rankData = getLevelInfo(userXp);

    // Guardamos su nivel y rango por si no lo tenía actualizado
    currentUser.level = rankData.level;
    currentUser.rankClass = rankData.rankClass;
    localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));

    // 4. MOSTRAR DATOS EN EL HEADER
    const greetingElement = document.getElementById('user-greeting');
    let firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Estudiante';
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    if (greetingElement) {
        greetingElement.textContent = `¡Hola, ${firstName}! 👋`;
    }

    // Cargar Avatar y Marco de Liga
    const avatarContainer = document.getElementById('user-avatar-container');
    if (avatarContainer) {
        avatarContainer.className = 'avatar-img'; // Reset de clases
        avatarContainer.classList.add(rankData.rankClass); // Añade el borde de color

        avatarContainer.innerHTML = '';
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        
        if (currentUser.profilePic) {
            img.src = currentUser.profilePic;
        } else {
            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        }
        avatarContainer.appendChild(img);
    }

    // 5. ACTUALIZAR ESTADÍSTICAS VISUALES (Barra de progreso inteligente)
    const elLevel = document.querySelector('.level-title');
    const elSubtitle = document.querySelector('.level-subtitle');
    const elXp = document.querySelector('.xp-text');
    const elStreak = document.querySelector('.streak-days');
    const elProgressFill = document.querySelector('.progress-bar-fill');

    if (elLevel) elLevel.textContent = `Nivel ${rankData.level}`;
    if (elSubtitle) elSubtitle.textContent = `Liga ${rankData.rankName}`;
    if (elStreak) elStreak.textContent = `${currentUser.streak || 0} días`;

    if (elXp && elProgressFill) {
        if (rankData.level === 5) {
            elXp.textContent = `${userXp} XP (MAX)`;
            elProgressFill.style.width = `100%`;
        } else {
            // Cuánto XP lleva en este nivel vs Cuánto necesita
            let xpCurrentLevel = userXp - rankData.min;
            let xpNeededForNext = rankData.max - rankData.min;
            let percentage = (xpCurrentLevel / xpNeededForNext) * 100;

            elXp.textContent = `${userXp} / ${rankData.max} XP`;
            elProgressFill.style.width = `${percentage}%`;
        }
    }

    // 6. CERRAR SESIÓN
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
                localStorage.removeItem('brainbox_current_user');
                window.location.href = '../index.html';
            }
        });
    }
});