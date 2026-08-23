window.showView = function(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {

    // --- MANEJO DE FOTO DE PERFIL ---
    const fileInput = document.getElementById('reg-profile-pic');
    const picContainer = document.getElementById('profile-pic-container');
    const picIcon = document.getElementById('profile-pic-icon');
    let base64Image = null;

    if (fileInput && picContainer) {
        picContainer.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (picIcon) picIcon.style.display = 'none';
                    base64Image = e.target.result;
                    
                    let imgPreview = document.getElementById('img-preview');
                    if (!imgPreview) {
                        imgPreview = document.createElement('img');
                        imgPreview.id = 'img-preview';
                        imgPreview.style.width = '100%';
                        imgPreview.style.height = '100%';
                        imgPreview.style.objectFit = 'cover';
                        picContainer.appendChild(imgPreview);
                    }
                    imgPreview.src = base64Image;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // --- VARIABLES GLOBALES DEL REGISTRO ---
    let tempUser = {};

    // CATÁLOGO COMPLETO DE CARRERAS (24 en total)
    const allCareersData = [
        "Acuicultura", "Ciencia de Datos e IA", "Computación", "Electrónica y Automat.",
        "Estadística", "Geología", "Ing. Agrícola y Biológica", "Ing. Civil",
        "Ing. de Minas", "Ing. Eléctrica", "Ing. en Alimentos", "Ing. en Materiales",
        "Ing. en Petróleos", "Ing. Industrial", "Ing. Mecánica", "Ing. Naval",
        "Ing. Química", "Logística y Transporte", "Matemática Aplicada", "Mecatrónica",
        "Nutrición y Dietética", "Oceanografía", "Telecomunicaciones", "Telemática"
    ];

    let availableCareers = [...allCareersData]; // Clonamos el arreglo
    let selectedCareers = []; // Aquí guardaremos el Top 3

    // --- PASO 1: REGISTRO (DATOS PERSONALES) ---
    const formRegStep1 = document.getElementById('form-register-step1');
    if (formRegStep1) {
        formRegStep1.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('reg-fullname').value;
            const schoolName = document.getElementById('reg-school').value;
            const email = document.getElementById('reg-email').value;
            const pass1 = document.getElementById('reg-pass1').value;
            const pass2 = document.getElementById('reg-pass2').value;
            
            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden. ¡Revisa bien!');
                return;
            }

            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
            if (users.find(u => u.email === email)) {
                alert('Este correo ya está registrado. Ve a iniciar sesión.');
                return;
            }

            tempUser = {
                fullName: fullName,
                school: schoolName,
                email: email,
                password: pass1,
                profilePic: base64Image,
                type: 'internal',
                level: 1, points: 0, xp: 0, streak: 0,
                topCareers: []
            };

            showView('view-top-careers');
            renderCareersUI(); // Dibujamos las carreras por primera vez
        });
    }

    // --- RENDERIZADO DEL TOP 3 Y DRAG & DROP ---
    const availableContainer = document.getElementById('available-careers-list');
    const selectedContainer = document.getElementById('selected-careers-list');
    const btnFinish = document.getElementById('btn-finish-register');
    const searchInput = document.getElementById('career-search');

    // 1. Dibujar el UI
    function renderCareersUI(filterText = '') {
        // Renderizar Disponibles (Filtradas)
        availableContainer.innerHTML = '';
        const filtered = availableCareers.filter(c => c.toLowerCase().includes(filterText.toLowerCase()));
        
        filtered.forEach(career => {
            const pill = document.createElement('div');
            pill.className = 'career-pill';
            pill.innerHTML = `${career}`;
            pill.onclick = () => addCareer(career);
            availableContainer.appendChild(pill);
        });

        // Actualizar contador
        document.getElementById('available-counter').textContent = availableCareers.length;

        // Renderizar Seleccionadas (Top 3)
        selectedContainer.innerHTML = '';
        if (selectedCareers.length === 0) {
            selectedContainer.innerHTML = '<p style="text-align:center; color:#B2BEC3; font-size:0.9rem; padding: 20px;">No has seleccionado ninguna carrera.</p>';
        } else {
            selectedCareers.forEach((career, index) => {
                const rect = document.createElement('div');
                rect.className = 'career-rect';
                rect.draggable = true; // HACERLO ARRASTRABLE
                rect.dataset.index = index; // Guardar su posición original

                // Asignar clase de medalla según la posición
                let rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : 'rank-3');

                rect.innerHTML = `
                    <span class="rank-badge ${rankClass}">${index + 1}</span>
                    <span class="career-name">≡ ${career}</span>
                    <button type="button" class="remove-btn" onclick="removeCareer('${career}')">❌</button>
                `;

                // Eventos de Drag & Drop
                rect.addEventListener('dragstart', handleDragStart);
                rect.addEventListener('dragover', handleDragOver);
                rect.addEventListener('dragenter', handleDragEnter);
                rect.addEventListener('dragleave', handleDragLeave);
                rect.addEventListener('drop', handleDrop);
                rect.addEventListener('dragend', handleDragEnd);

                selectedContainer.appendChild(rect);
            });
        }

        // Habilitar botón solo si hay 3 seleccionadas
        btnFinish.disabled = selectedCareers.length !== 3;
        btnFinish.textContent = selectedCareers.length === 3 ? "Finalizar Registro" : `Faltan ${3 - selectedCareers.length} carreras`;
    }

    // 2. Lógica de Agregar y Quitar
    window.addCareer = function(career) {
        if (selectedCareers.length >= 3) {
            alert("Solo puedes tener un TOP 3. Elimina una para agregar otra.");
            return;
        }
        // Quitar de disponibles y pasar a seleccionadas
        availableCareers = availableCareers.filter(c => c !== career);
        selectedCareers.push(career);
        searchInput.value = ''; // Limpiar buscador
        renderCareersUI();
    };

    window.removeCareer = function(career) {
        // Quitar de seleccionadas y regresar a disponibles
        selectedCareers = selectedCareers.filter(c => c !== career);
        availableCareers.push(career);
        availableCareers.sort(); // Mantener orden alfabético
        renderCareersUI();
    };

    // 3. Lógica del Drag & Drop (HTML5)
    let dragStartIndex = null;

    function handleDragStart(e) {
        dragStartIndex = +this.dataset.index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault(); // Necesario para permitir el drop
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        e.stopPropagation();
        const dragEndIndex = +this.dataset.index;

        if (dragStartIndex !== dragEndIndex && dragStartIndex !== null) {
            // Intercambiar las posiciones en el arreglo
            const temp = selectedCareers[dragStartIndex];
            selectedCareers[dragStartIndex] = selectedCareers[dragEndIndex];
            selectedCareers[dragEndIndex] = temp;
            
            // Volver a dibujar para que los números (1,2,3) se actualicen solos
            renderCareersUI();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        document.querySelectorAll('.career-rect').forEach(rect => rect.classList.remove('over'));
    }

    // 4. Barra de Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderCareersUI(e.target.value);
        });
    }

    // --- PASO 2: FINALIZAR REGISTRO ---
    if (btnFinish) {
        btnFinish.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Guardar el arreglo ordenado en el usuario
            tempUser.topCareers = [...selectedCareers];

            // Guardar en Base de Datos LocalStorage
            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
            users.push(tempUser);
            localStorage.setItem('brainbox_users', JSON.stringify(users));
            localStorage.setItem('brainbox_current_user', JSON.stringify(tempUser));
            
            showView('view-success');
        });
    }

    // --- LOGIN INTERNO (ESTUDIANTES Y PROFESOR) ---
    const formLoginInt = document.getElementById('form-login-internal');
    if (formLoginInt) {
        formLoginInt.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email-int').value;
            const password = document.getElementById('login-pass-int').value;
            
            if (email === "profesor@admin.com" && password === "admin123") {
                window.location.href = 'pages/profesor.html';
                return; 
            }
            
            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
            const validUser = users.find(u => u.email === email && u.password === password && u.type === 'internal');
            
            if (validUser) {
                localStorage.setItem('brainbox_current_user', JSON.stringify(validUser));
                window.location.href = 'pages/dashboard.html';
            } else {
                alert('Correo o contraseña incorrectos. ¡Inténtalo de nuevo!');
            }
        });
    }

    // --- LOGIN EXTERNO (INVITADOS) ---
    const formLoginExt = document.getElementById('form-login-external');
    if (formLoginExt) {
        formLoginExt.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email-ext').value;
            
            const guestUser = {
                fullName: "Invitado Observador",
                email: email,
                type: 'external',
                level: 1, xp: 0, points: 0, streak: 0
            };

            localStorage.setItem('brainbox_current_user', JSON.stringify(guestUser));
            window.location.href = 'pages/dashboard.html';
        });
    }

    // --- BOTÓN DE ÉXITO -> DASHBOARD ---
    const btnEnterDashboard = document.getElementById('btn-enter-dashboard');
    if (btnEnterDashboard) {
        btnEnterDashboard.addEventListener('click', () => {
            window.location.href = 'pages/dashboard.html';
        });
    }
});