document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAR AUTENTICACIÓN
    let currentUserStr = localStorage.getItem('brainbox_current_user');
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }
    let currentUser = JSON.parse(currentUserStr);

    // 2. MOTOR DE LIGAS
    function getLevelInfo(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce' };
        if (xp < 200) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata' };
        if (xp < 300) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro' };
        if (xp < 500) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda' };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante' }; 
    }
    let rankData = getLevelInfo(currentUser.xp || 0);

    // 3. CARGAR DATOS EN EL DOM
    const nameEl = document.getElementById('profile-name');
    const schoolEl = document.getElementById('profile-school');
    const pointsEl = document.getElementById('profile-points');
    const levelEl = document.getElementById('profile-level');
    
    if (nameEl) nameEl.textContent = currentUser.fullName;
    // Si la escuela está guardada en la base de datos, la muestra
    if (schoolEl) schoolEl.textContent = currentUser.school || "Unidad Educativa no especificada";
    if (pointsEl) pointsEl.textContent = currentUser.points || 0;
    
    // Nivel y Liga fusionados
    if (levelEl) levelEl.textContent = `${rankData.level} (${rankData.rankName})`;

    // 4. CARGAR AVATAR CON MARCO
    const avatarContainer = document.getElementById('profile-avatar-container');
    const avatarWrapper = document.getElementById('btn-change-avatar');

    function renderAvatar() {
        if (avatarWrapper) {
            avatarWrapper.className = 'avatar-wrapper'; // Limpiamos
            avatarWrapper.classList.add(rankData.rankClass); // Agregamos la liga
        }

        avatarContainer.innerHTML = '';
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        if (currentUser.profilePic) {
            img.src = currentUser.profilePic;
        } else {
            let firstName = currentUser.fullName.split(' ')[0];
            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        }
        avatarContainer.appendChild(img);
    }
    renderAvatar();

    // 5. CAMBIAR FOTO
    const btnChangeAvatar = document.getElementById('btn-change-avatar');
    const inputFile = document.getElementById('input-update-pic');
    
    if (btnChangeAvatar && inputFile) {
        btnChangeAvatar.addEventListener('click', () => inputFile.click());
        inputFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentUser.profilePic = e.target.result;
                    updateUserStorage(currentUser);
                    renderAvatar();
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    function updateUserStorage(updatedUser) {
        localStorage.setItem('brainbox_current_user', JSON.stringify(updatedUser));
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === updatedUser.email);
        if (index !== -1) {
            users[index].profilePic = updatedUser.profilePic;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }
    }

    // 6. ANIMACIÓN DE GRÁFICOS
    const progressCards = document.querySelectorAll('.circular-chart');
    progressCards.forEach(card => {
        let targetProgress = parseInt(card.style.getPropertyValue('--p')) || 0;
        let currentProgress = 0;
        let speed = 20;
        if(targetProgress > 0) {
            let progressInterval = setInterval(() => {
                currentProgress++;
                card.style.setProperty('--p', currentProgress);
                card.querySelector('.progress-text').textContent = currentProgress + '%';
                if(currentProgress >= targetProgress) clearInterval(progressInterval);
            }, speed);
        }
    });
});