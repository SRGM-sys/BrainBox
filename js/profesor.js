document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('students-container');
    let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];

    // Totales de lecciones
    const TOTAL_MATH = 33;
    const TOTAL_PHYS = 16;
    const TOTAL_CHEM = 21;

    // Filtramos para ver solo usuarios internos (estudiantes), descartamos profesores o invitados si hubieran
    let students = users.filter(u => u.type === 'internal');

    if (students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 10px;">📭</div>
                <h3>No hay estudiantes registrados</h3>
                <p>Aún no se ha creado ninguna cuenta oficial en la plataforma.</p>
            </div>
        `;
        return;
    }

    let htmlContent = '';

    students.forEach(user => {
        // --- 1. PROCESAR PROGRESO ---
        let mathTopics = new Set();
        let physTopics = new Set();
        let chemTopics = new Set();
        let answered = user.answeredQuestions || [];

        answered.forEach(qId => {
            let parts = qId.split('_q');
            if (parts.length > 0) {
                let topicId = parts[0]; 
                if (topicId.startsWith('math')) mathTopics.add(topicId);
                else if (topicId.startsWith('phys')) physTopics.add(topicId);
                else if (topicId.startsWith('chem')) chemTopics.add(topicId);
            }
        });

        let mathProgress = Math.min(Math.round((mathTopics.size / TOTAL_MATH) * 100), 100);
        let physProgress = Math.min(Math.round((physTopics.size / TOTAL_PHYS) * 100), 100);
        let chemProgress = Math.min(Math.round((chemTopics.size / TOTAL_CHEM) * 100), 100);

        // --- 2. PROCESAR PERFIL ---
        let firstName = user.fullName ? user.fullName.split(' ')[0] : 'Estudiante';
        let avatarSrc = user.profilePic ? user.profilePic : `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        let school = user.school || "Unidad Educativa no especificada";

        // --- 3. PROCESAR EL DORSO (TOP 3 CARRERAS) ---
        let topsHtml = '';
        const tops = user.topCareers || [];
        
        if (tops.length > 0) {
            topsHtml = tops.map((career, index) => `
                <div style="background: rgba(108, 92, 231, 0.1); border-left: 4px solid #6C5CE7; padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 1.3rem; font-weight: 900; color: #6C5CE7; opacity: 0.8;">#${index + 1}</div>
                    <div style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">${career}</div>
                </div>
            `).join('');
        } else {
            topsHtml = `
                <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                    <div style="font-size: 2.5rem; margin-bottom: 10px;">🤷‍♂️</div>
                    Aún no ha seleccionado<br>carreras favoritas.
                </div>`;
        }

        // --- 4. ARMAR TARJETA 3D ---
        // Al hacer clic en el 'student-card-wrapper', buscamos su interior ('student-card-inner') y le hacemos toggle a 'is-flipped'
        htmlContent += `
            <div class="student-card-wrapper" onclick="this.querySelector('.student-card-inner').classList.toggle('is-flipped')">
                <div class="student-card-inner">
                    
                    <!-- CARA DELANTERA (PROGRESO) -->
                    <div class="student-card-front">
                        <div class="student-header">
                            <img src="${avatarSrc}" alt="Avatar" class="student-avatar">
                            <div class="student-info">
                                <h4>${user.fullName || 'Sin Nombre'}</h4>
                                <p>${school}</p>
                            </div>
                        </div>

                        <div class="subject-progress">
                            <div class="bar-labels">
                                <span>Matemáticas</span>
                                <span>${mathProgress}%</span>
                            </div>
                            <div class="bar-bg">
                                <div class="bar-fill fill-math" style="width: ${mathProgress}%"></div>
                            </div>
                        </div>

                        <div class="subject-progress">
                            <div class="bar-labels">
                                <span>Física</span>
                                <span>${physProgress}%</span>
                            </div>
                            <div class="bar-bg">
                                <div class="bar-fill fill-phys" style="width: ${physProgress}%"></div>
                            </div>
                        </div>

                        <div class="subject-progress">
                            <div class="bar-labels">
                                <span>Química</span>
                                <span>${chemProgress}%</span>
                            </div>
                            <div class="bar-bg">
                                <div class="bar-fill fill-chem" style="width: ${chemProgress}%"></div>
                            </div>
                        </div>

                        <!-- Indicador para que el profesor sepa que puede darle clic -->
                        <div style="margin-top: auto; text-align: center; font-size: 0.8rem; color: var(--primary-color); font-weight: 800;">
                            <span class="bounce-hint">Click para deslizar</span>
                        </div>
                    </div>

                    <!-- CARA TRASERA (CARRERAS) -->
                    <div class="student-card-back">
                        <h4 style="color: var(--primary-color); text-align: center; margin-bottom: 20px; font-size: 1.15rem;">Top 3 Ingenierías </h4>
                        
                        <div style="flex-grow: 1;">
                            ${topsHtml}
                        </div>

                        <div style="text-align: center; font-size: 0.8rem; color: var(--text-muted); font-weight: 800; margin-top: auto;">
                            Click para volver
                        </div>
                    </div>

                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
});