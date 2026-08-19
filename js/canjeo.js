document.addEventListener('DOMContentLoaded', () => {

    // 1. BASE DE DATOS DE PREMIOS (Con los nombres de tus futuras imágenes)
    const rewards = [
        { id: 1, name: "+1 punto en la lección", cost: 30, img: "../assets/img/premio-leccion.png" },
        { id: 2, name: "+1 punto en la tarea", cost: 25, img: "../assets/img/premio-tarea.png" },
        { id: 3, name: "Empanada del Bar", cost: 5, img: "../assets/img/premio-empanada.png" },
        { id: 4, name: "Agua embotellada", cost: 3, img: "../assets/img/premio-agua.png" },
        { id: 5, name: "Jugo", cost: 5, img: "../assets/img/premio-jugo.png" }
    ];

    // 2. OBTENER EL USUARIO ACTUAL
    let currentUserStr = localStorage.getItem('brainbox_current_user');
    if (!currentUserStr) {
        window.location.href = '../index.html';
        return;
    }
    
    let currentUser = JSON.parse(currentUserStr);

    // 3. INICIALIZAR PUNTOS (Regalo de bienvenida)
    // Si es la primera vez que entra y no tiene la variable "points", le regalamos 10.
    if (currentUser.points === undefined) {
        currentUser.points = 10;
        updateUserStorage(currentUser);
    }

    // Mostrar puntos en la pantalla
    const pointsDisplay = document.getElementById('user-points-display');
    
    function renderPoints() {
        pointsDisplay.textContent = currentUser.points;
    }
    renderPoints();

    // 4. RENDERIZAR LAS TARJETAS DINÁMICAMENTE
    const rewardsContainer = document.getElementById('rewards-container');

    function renderRewards() {
        rewardsContainer.innerHTML = ''; // Limpiamos por si se re-renderiza

        rewards.forEach(reward => {
            const card = document.createElement('div');
            card.className = 'reward-card';

            card.innerHTML = `
                <!-- Espacio libre para tu imagen -->
                <img src="${reward.img}" alt="${reward.name}" class="reward-img" onerror="this.src='https://placehold.co/400x300/F8F9FC/6C5CE7?text=Foto+Faltante'">
                
                <div class="reward-footer">
                    <h3 class="reward-title">${reward.name}</h3>
                    <!-- Botón de canjeo -->
                    <button class="btn-redeem" onclick="redeemItem(${reward.id})">
                        ${reward.cost} pts
                    </button>
                </div>
            `;
            rewardsContainer.appendChild(card);
        });
    }
    renderRewards();

    // 5. LÓGICA DE CANJEO (MATEMÁTICA)
    window.redeemItem = function(rewardId) {
        // Buscamos cuál premio eligió
        const item = rewards.find(r => r.id === rewardId);

        // Verificamos si le alcanzan los puntos
        if (currentUser.points >= item.cost) {
            // Confirmación de seguridad
            const confirmar = confirm(`¿Quieres canjear ${item.cost} puntos por: ${item.name}?`);
            
            if(confirmar) {
                // Restamos los puntos
                currentUser.points -= item.cost;
                
                // Actualizamos la base de datos
                updateUserStorage(currentUser);
                
                // Actualizamos el contador en pantalla
                renderPoints();
                
                // Mensaje de éxito
                alert(`¡Canjeado con éxito! 🎉 Disfruta tu: ${item.name}`);
            }
        } else {
            // No le alcanza
            alert(`Oops 😅 No tienes suficientes puntos. Te faltan ${item.cost - currentUser.points} pts. ¡Sigue aprendiendo!`);
        }
    };

    // 6. FUNCIÓN INTERNA PARA ACTUALIZAR LOCALSTORAGE
    function updateUserStorage(updatedUser) {
        // Actualizamos al usuario que tiene la sesión abierta
        localStorage.setItem('brainbox_current_user', JSON.stringify(updatedUser));

        // Y también lo actualizamos en la base de datos general de usuarios
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === updatedUser.email);
        if (index !== -1) {
            users[index].points = updatedUser.points;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }
    }

});