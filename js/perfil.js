document.addEventListener('DOMContentLoaded', () => {

    let currentUserStr = localStorage.getItem('brainbox_current_user');
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }
    
    let currentUser = JSON.parse(currentUserStr);

    // Evitar que usuarios externos entren al perfil burlando la URL
    if (currentUser.type === 'external') {
        window.location.href = 'dashboard.html';
        return;
    }

    function getLevelInfo(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce' };
        if (xp < 250) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata' };
        if (xp < 450) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro' };
        if (xp < 750) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda' };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante' }; 
    }
    let rankData = getLevelInfo(currentUser.xp || 0);

    const nameEl = document.getElementById('profile-name');
    const schoolEl = document.getElementById('profile-school');
    const pointsEl = document.getElementById('profile-points');
    const levelEl = document.getElementById('profile-level');
    
    if (nameEl) nameEl.textContent = currentUser.fullName;
    if (schoolEl) schoolEl.textContent = currentUser.school || "Unidad Educativa no especificada";
    if (pointsEl) pointsEl.textContent = currentUser.points || 0;
    if (levelEl) levelEl.textContent = `${rankData.level} (${rankData.rankName})`;

    // CARGAR AVATAR
    const avatarContainer = document.getElementById('profile-avatar-container');
    const avatarWrapper = document.getElementById('btn-change-avatar');

    function renderAvatar() {
        if (avatarWrapper) {
            avatarWrapper.className = 'avatar-wrapper'; 
            avatarWrapper.classList.add(rankData.rankClass); 
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

    // --- CARGAR EL TOP 3 DE INGENIERÍAS ---
    const topContainer = document.getElementById('top-careers-container');
    if (topContainer) {
        const tops = currentUser.topCareers || [];
        if (tops.length === 0) {
            topContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">Aún no has seleccionado tus carreras favoritas.</p>';
        } else {
            let htmlTops = '';
            // Paleta de colores para que se vean variadas
            const colors = ['rgba(108, 92, 231, 0.1)', 'rgba(0, 206, 201, 0.1)', 'rgba(214, 48, 49, 0.1)'];
            const borders = ['#6C5CE7', '#00CEC9', '#D63031'];
            
            tops.forEach((careerName, index) => {
                let badgeColor = colors[index % colors.length];
                let borderColor = borders[index % borders.length];
                
                htmlTops += `
                    <div style="background-color: ${badgeColor}; border-left: 5px solid ${borderColor}; padding: 12px 20px; border-radius: 12px; display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 1.5rem; color: ${borderColor}; font-weight: 800;">${index + 1}</div>
                        <div style="font-weight: 800; color: var(--text-main); font-size: 1.05rem;">${careerName}</div>
                    </div>
                `;
            });
            topContainer.innerHTML = htmlTops;
        }
    }

    // CAMBIAR FOTO
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

    // CÁLCULO DE PROGRESO
    let answered = currentUser.answeredQuestions || [];
    let mathTopics = new Set();
    let physTopics = new Set();
    let chemTopics = new Set();

    answered.forEach(qId => {
        let parts = qId.split('_q');
        if (parts.length > 0) {
            let topicId = parts[0]; 
            if (topicId.startsWith('math')) mathTopics.add(topicId);
            else if (topicId.startsWith('phys')) physTopics.add(topicId);
            else if (topicId.startsWith('chem')) chemTopics.add(topicId);
        }
    });

    const TOTAL_MATH = 33;
    const TOTAL_PHYS = 16;
    const TOTAL_CHEM = 21;

    let mathProgress = Math.min(Math.round((mathTopics.size / TOTAL_MATH) * 100), 100);
    let physProgress = Math.min(Math.round((physTopics.size / TOTAL_PHYS) * 100), 100);
    let chemProgress = Math.min(Math.round((chemTopics.size / TOTAL_CHEM) * 100), 100);

    const progressCards = document.querySelectorAll('.circular-chart');
    const targetProgresses = [mathProgress, physProgress, chemProgress];

    progressCards.forEach((card, index) => {
        let targetProgress = targetProgresses[index] || 0;
        let currentProgress = 0;
        let speed = 20; 

        if(targetProgress > 0) {
            let progressInterval = setInterval(() => {
                currentProgress++;
                card.style.setProperty('--p', currentProgress);
                card.querySelector('.progress-text').textContent = currentProgress + '%';
                if(currentProgress >= targetProgress) clearInterval(progressInterval);
            }, speed);
        } else {
            card.style.setProperty('--p', 0);
            card.querySelector('.progress-text').textContent = '0%';
        }
    });
});