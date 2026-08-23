document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('students-container');
    let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];

    // Totales de lecciones (igual que en el perfil)
    const TOTAL_MATH = 33;
    const TOTAL_PHYS = 16;
    const TOTAL_CHEM = 21;

    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 10px;">📭</div>
                <h3>No hay estudiantes registrados</h3>
                <p>Aún no se ha creado ninguna cuenta en la plataforma.</p>
            </div>
        `;
        return;
    }

    let htmlContent = '';

    users.forEach(user => {
        // Variables para conteo de temas
        let mathTopics = new Set();
        let physTopics = new Set();
        let chemTopics = new Set();
        let answered = user.answeredQuestions || [];

        // Clasificar preguntas respondidas por tema
        answered.forEach(qId => {
            let parts = qId.split('_q');
            if (parts.length > 0) {
                let topicId = parts[0]; 
                if (topicId.startsWith('math')) mathTopics.add(topicId);
                else if (topicId.startsWith('phys')) physTopics.add(topicId);
                else if (topicId.startsWith('chem')) chemTopics.add(topicId);
            }
        });

        // Calcular porcentajes
        let mathProgress = Math.min(Math.round((mathTopics.size / TOTAL_MATH) * 100), 100);
        let physProgress = Math.min(Math.round((physTopics.size / TOTAL_PHYS) * 100), 100);
        let chemProgress = Math.min(Math.round((chemTopics.size / TOTAL_CHEM) * 100), 100);

        // Foto de perfil
        let firstName = user.fullName ? user.fullName.split(' ')[0] : 'Estudiante';
        let avatarSrc = user.profilePic ? user.profilePic : `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
        let school = user.school || "Unidad Educativa no especificada";

        // Generar tarjeta HTML
        htmlContent += `
            <div class="student-card">
                <div class="student-header">
                    <img src="${avatarSrc}" alt="Avatar" class="student-avatar">
                    <div class="student-info">
                        <h4>${user.fullName || 'Sin Nombre'}</h4>
                        <p>🏫 ${school}</p>
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
            </div>
        `;
    });

    container.innerHTML = htmlContent;
});