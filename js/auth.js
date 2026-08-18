// --- FUNCIÓN PARA CAMBIAR VISTAS EN EL MODAL ---
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {

    // Botones del Modal
    document.getElementById('btn-show-login')?.addEventListener('click', () => {
        showView('view-login');
    });
    document.getElementById('btn-show-register')?.addEventListener('click', () => {
        showView('view-register');
    });

    // --- VISTA PREVIA DE LA FOTO (Estilo Moderno) ---
    const fileInput = document.getElementById('reg-profile-pic');
    const picContainer = document.getElementById('profile-pic-container');
    const picIcon = document.getElementById('profile-pic-icon');

    if (fileInput && picContainer) {
        // Al hacer clic en el círculo, simulamos un clic en el input oculto
        picContainer.addEventListener('click', () => {
            fileInput.click();
        });

        // Cuando el explorador de archivos se cierra y hay una imagen seleccionada
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Ocultamos el icono de la cámara
                    if (picIcon) picIcon.style.display = 'none';
                    
                    // Verificamos si ya existe la etiqueta de la imagen; si no, la creamos
                    let imgPreview = document.getElementById('img-preview');
                    if (!imgPreview) {
                        imgPreview = document.createElement('img');
                        imgPreview.id = 'img-preview';
                        imgPreview.style.width = '100%';
                        imgPreview.style.height = '100%';
                        imgPreview.style.objectFit = 'cover';
                        picContainer.appendChild(imgPreview);
                    }
                    
                    // Le asignamos la imagen seleccionada
                    imgPreview.src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // --- 1. LÓGICA DE REGISTRO MODIFICADA ---
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('reg-fullname').value;
            const email = formRegister.querySelector('input[type="email"]').value;
            const passwords = formRegister.querySelectorAll('input[type="password"]');
            
            const pass1 = passwords[0].value;
            const pass2 = passwords[1].value;

            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden. ¡Revisa bien, pana!');
                return;
            }

            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];

            if (users.find(u => u.email === email)) {
                alert('Este correo ya está registrado. Ve a iniciar sesión.');
                return;
            }

            // Función interna para guardar el usuario una vez que tengamos la foto procesada
            const finishRegistration = (profilePicBase64) => {
                const newUser = {
                    fullName: fullName,
                    email: email,
                    password: pass1,
                    profilePic: profilePicBase64 // Guardamos la foto aquí
                };

                users.push(newUser);
                localStorage.setItem('brainbox_users', JSON.stringify(users));
                localStorage.setItem('brainbox_current_user', JSON.stringify(newUser));
                window.location.href = 'pages/dashboard.html';
            };

            // Verificar si el usuario subió una imagen
            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    finishRegistration(e.target.result); // Pasa la imagen en Base64
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                finishRegistration(null); // No subió foto, pasamos null
            }
        });
    }

    // --- 2. LÓGICA DE INICIO DE SESIÓN ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = formLogin.querySelector('input[type="password"]').value;
            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
            const validUser = users.find(u => u.email === email && u.password === password);

            if (validUser) {
                localStorage.setItem('brainbox_current_user', JSON.stringify(validUser));
                window.location.href = 'pages/dashboard.html';
            } else {
                alert('Correo o contraseña incorrectos. ¡Inténtalo de nuevo!');
            }
        });
    }
});