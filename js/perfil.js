document.addEventListener('DOMContentLoaded', () => {

    // 1. VERIFICAR AUTENTICACIÓN
    let currentUserStr = localStorage.getItem('brainbox_current_user');
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }
    
    let currentUser = JSON.parse(currentUserStr);

    // 2. CARGAR DATOS EN EL DOM
    const nameEl = document.getElementById('profile-name');
    const schoolEl = document.getElementById('profile-school'); // Elemento de la escuela
    const pointsEl = document.getElementById('profile-points');
    const levelEl = document.getElementById('profile-level');
    
    // Nombres y Escuela
    if (nameEl) nameEl.textContent = currentUser.fullName;
    if (schoolEl) schoolEl.textContent = currentUser.school || "Unidad Educativa no especificada";
    
    // Cargar puntos y nivel dinámicamente
    if (pointsEl) pointsEl.textContent = currentUser.points !== undefined ? currentUser.points : 0;
    if (levelEl) levelEl.textContent = currentUser.level !== undefined ? currentUser.level : 1;
    
    // Capitalizar nombres
    if (nameEl) nameEl.textContent = currentUser.fullName;
    
    // Si tienes un input de colegio en el registro a futuro, se usaría aquí.
    // Por ahora usamos el default del HTML.
    
    // Cargar puntos (Si no existe, es 0)
    if (pointsEl) pointsEl.textContent = currentUser.points !== undefined ? currentUser.points : 0;
    
    // Cargar nivel (Por defecto 1)
    if (levelEl) levelEl.textContent = currentUser.level || 1;

    // Cargar Avatar
    const avatarContainer = document.getElementById('profile-avatar-container');
    function renderAvatar() {
        avatarContainer.innerHTML = '';
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        if (currentUser.profilePic) {
            img.src = currentUser.profilePic;
        } else {
            // Generar avatar por defecto si no tiene foto
            let firstName = currentUser.fullName.split(' ')[0];
            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        }
        avatarContainer.appendChild(img);
    }
    renderAvatar();

    // 3. ACTUALIZAR ESTADÍSTICAS DEL DASHBOARD
    const elLevel = document.getElementById('dash-level');
    const elXp = document.getElementById('dash-xp');
    const elStreak = document.getElementById('dash-streak');
    const elProgressFill = document.getElementById('dash-progress-fill');

    if (elLevel) elLevel.textContent = `Nivel ${currentUser.level || 1}`;
    if (elXp) elXp.textContent = `${currentUser.xp || 0} / 500`;
    if (elStreak) elStreak.textContent = `${currentUser.streak || 0} días`;
    
    if (elProgressFill) {
        let xpPercentage = ((currentUser.xp || 0) / 500) * 100;
        elProgressFill.style.width = `${xpPercentage}%`;
    }


    // 4. CAMBIAR FOTO DE PERFIL
    const btnChangeAvatar = document.getElementById('btn-change-avatar');
    const inputFile = document.getElementById('input-update-pic');

    if (btnChangeAvatar && inputFile) {
        // Al dar clic al círculo, simula el clic en el input oculto
        btnChangeAvatar.addEventListener('click', () => {
            inputFile.click();
        });

        // Al seleccionar la nueva imagen
        inputFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const nuevaFotoBase64 = e.target.result;
                    
                    // Actualizamos el objeto local
                    currentUser.profilePic = nuevaFotoBase64;
                    
                    // Actualizamos las bases de datos en LocalStorage
                    updateUserStorage(currentUser);
                    
                    // Renderizamos la nueva foto en pantalla
                    renderAvatar();
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // Función interna para sincronizar el LocalStorage
    function updateUserStorage(updatedUser) {
        localStorage.setItem('brainbox_current_user', JSON.stringify(updatedUser));
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === updatedUser.email);
        if (index !== -1) {
            users[index].profilePic = updatedUser.profilePic;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }
    }

    // 5. ANIMACIÓN INICIAL DE LOS GRÁFICOS CIRCULARES (Opcional, pero se ve genial)
    // Actualmente están en 0%, pero si luego suben, esta lógica los animará.
    const progressCards = document.querySelectorAll('.circular-chart');
    progressCards.forEach(card => {
        // Obtenemos el porcentaje deseado desde la variable del HTML (actualmente 0)
        let targetProgress = parseInt(card.style.getPropertyValue('--p')) || 0;
        
        // Simulación de carga (solo visual)
        let currentProgress = 0;
        let speed = 20; // milisegundos

        if(targetProgress > 0) {
            let progressInterval = setInterval(() => {
                currentProgress++;
                card.style.setProperty('--p', currentProgress);
                card.querySelector('.progress-text').textContent = currentProgress + '%';

                if(currentProgress >= targetProgress) {
                    clearInterval(progressInterval);
                }
            }, speed);
        }
    });

});