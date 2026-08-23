document.addEventListener('DOMContentLoaded', () => {

    function getStandardDate(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    const currentUserStr = localStorage.getItem('brainbox_current_user');
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }
    
    let currentUser = JSON.parse(currentUserStr);
    
    // --- LÓGICA DE CERRAR SESIÓN GLOBAL ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Es seguro que deseas salir de la sesión?")) {
                localStorage.removeItem('brainbox_current_user');
                window.location.href = '../index.html';
            }
        });
    }

    const greetingElement = document.getElementById('user-greeting');
    let firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Estudiante';
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    // --- SI ES USUARIO EXTERNO (INVITADO) ---
    if (currentUser.type === 'external') {
        if (greetingElement) greetingElement.textContent = `¡Hola, ${firstName}!`;
        
        // Escondemos todo lo relacionado al juego
        document.getElementById('dash-gamification-stats').style.display = 'none';
        document.getElementById('dash-challenge-card').style.display = 'none';
        document.getElementById('dash-bottom-nav').style.display = 'none';
        
        // Mostramos la caja explicativa
        document.getElementById('guest-greeting-box').style.display = 'block';
        return; // Detenemos la ejecución del resto del dashboard gamificado
    }

    // ==============================================================
    // A PARTIR DE AQUÍ SOLO SE EJECUTA SI ES USUARIO INTERNO
    // ==============================================================

    if (greetingElement) greetingElement.textContent = `¡Hola, ${firstName}! 👋`;

    let userXp = currentUser.xp || 0;

    function getLevelInfo(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce', min: 0, max: 100 };
        if (xp < 250) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata', min: 100, max: 250 };
        if (xp < 450) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro', min: 250, max: 450 };
        if (xp < 750) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda', min: 450, max: 750 };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante', min: 750, max: 1000 }; 
    }
    
    let rankData = getLevelInfo(userXp);
    currentUser.level = rankData.level;
    currentUser.rankClass = rankData.rankClass;
    localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));

    const avatarContainer = document.getElementById('user-avatar-container');
    if (avatarContainer) {
        avatarContainer.className = 'avatar-img'; 
        avatarContainer.classList.add(rankData.rankClass); 
        avatarContainer.innerHTML = '';
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        
        if (currentUser.profilePic) img.src = currentUser.profilePic;
        else img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        avatarContainer.appendChild(img);
    }

    const elLevel = document.querySelector('.level-title');
    const elSubtitle = document.querySelector('.level-subtitle');
    const elXp = document.querySelector('.xp-text');
    const elStreak = document.getElementById('dash-streak');
    const elProgressFill = document.querySelector('.progress-bar-fill');

    if (elLevel) elLevel.textContent = `Nivel ${rankData.level}`;
    if (elSubtitle) elSubtitle.textContent = `Liga ${rankData.rankName}`;
    if (elStreak) elStreak.textContent = `${currentUser.streak || 0} días`;
    
    if (elXp && elProgressFill) {
        if (rankData.level === 5) {
            elXp.textContent = `${userXp} XP (MAX)`;
            elProgressFill.style.width = `100%`;
        } else {
            let xpCurrentLevel = userXp - rankData.min;
            let xpNeededForNext = rankData.max - rankData.min;
            let percentage = (xpCurrentLevel / xpNeededForNext) * 100;
            elXp.textContent = `${userXp} / ${rankData.max} XP`;
            elProgressFill.style.width = `${percentage}%`;
        }
    }

    // --- PINTADO EXACTO DE LA SEMANA DE RACHA ---
    const daysRow = document.getElementById('dash-days-row');
    if (daysRow && currentUser.studyHistory) {
        const today = new Date();
        const dayItems = daysRow.querySelectorAll('.day-item');
        
        let currentDayOfWeek = today.getDay(); 
        let distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        
        let monday = new Date(today);
        monday.setDate(today.getDate() - distanceToMonday);

        dayItems.forEach((item, index) => {
            let iterDate = new Date(monday);
            iterDate.setDate(monday.getDate() + index);
            let iterDateStr = getStandardDate(iterDate);
            
            if (currentUser.studyHistory.includes(iterDateStr)) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    }
});