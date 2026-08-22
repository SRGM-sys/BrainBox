document.addEventListener('DOMContentLoaded', () => {
    const viewTopics = document.getElementById('view-topics');
    const viewContent = document.getElementById('view-content');
    const topicTitle = document.getElementById('current-topic-title');
    const readingSection = document.getElementById('reading-section');
    const quizSection = document.getElementById('quiz-section');

    let currentTopicId = null;

    // 1. ABRIR TEMA E INYECTAR CONTENIDO
    window.openTopic = function(topicId) {
        if (!window.moduleData || !window.moduleData[topicId]) {
            alert("Error: Contenido no encontrado.");
            return;
        }

        currentTopicId = topicId;
        const data = window.moduleData[topicId];

        // Título y lectura
        topicTitle.textContent = data.title;
        readingSection.innerHTML = data.reading;

        // Generar HTML del Quiz
        let quizHtml = '';
        data.questions.forEach((q, qIndex) => {
            quizHtml += `
                <div class="question-block">
                    <h4>${qIndex + 1}. ${q.text}</h4>
                    <div class="options-container">
            `;
            q.options.forEach((opt, oIndex) => {
                quizHtml += `
                    <label class="option-label">
                        <input type="radio" name="q${qIndex}" value="${oIndex}">
                        <span>${opt}</span>
                    </label>
                `;
            });
            quizHtml += `</div></div>`;
        });
        quizSection.innerHTML = quizHtml;

        // Cambio de vista
        viewTopics.style.display = 'none';
        viewContent.style.display = 'block';
        document.querySelector('.module-content').scrollTop = 0;
    };

    window.backToTopics = function() {
        viewContent.style.display = 'none';
        viewTopics.style.display = 'block';
        currentTopicId = null;
    };

    // 2. MOTOR DE RANGOS
    window.calculateRank = function(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce' };
        if (xp < 200) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata' };
        if (xp < 300) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro' };
        if (xp < 500) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda' };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante' }; 
    };

    // 3. VERIFICAR RESPUESTAS Y DAR RECOMPENSA
    window.verifyAndClaim = function() {
        const data = window.moduleData[currentTopicId];
        let allCorrect = true;
        let answeredAll = true;

        // Revisar cada pregunta
        data.questions.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (!selected) {
                answeredAll = false;
            } else if (parseInt(selected.value) !== q.correctIndex) {
                allCorrect = false;
            }
        });

        if (!answeredAll) {
            alert("⚠️ Debes responder todas las preguntas para continuar.");
            return;
        }

        if (!allCorrect) {
            alert("❌ Al menos una respuesta es incorrecta. ¡Vuelve a repasar la lectura e inténtalo de nuevo!");
            return;
        }

        // --- SI TODO ES CORRECTO ---
        let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
        if (!currentUser.email) return;

        if (!currentUser.answeredQuestions) currentUser.answeredQuestions = [];
        
        // Verificamos si ya había completado ESTE tema antes
        const questionIds = data.questions.map(q => q.id);
        const alreadyClaimed = questionIds.every(id => currentUser.answeredQuestions.includes(id));

        if (alreadyClaimed) {
            alert("✅ ¡Perfecto! Todas las respuestas son correctas.\n(Ya habías completado esta lección, así que es un buen repaso pero no hay recompensa extra).");
            backToTopics();
            return;
        }

        // Dar recompensas (Solo la primera vez)
        currentUser.xp = (currentUser.xp || 0) + 25;
        currentUser.points = (currentUser.points || 0) + 2;
        
        const rankInfo = calculateRank(currentUser.xp);
        const oldLevel = currentUser.level || 1;
        
        currentUser.level = rankInfo.level;
        currentUser.rankClass = rankInfo.rankClass;

        // Guardar preguntas en el banco
        let uniqueQuestions = new Set([...currentUser.answeredQuestions, ...questionIds]);
        currentUser.answeredQuestions = Array.from(uniqueQuestions);

        // Guardar en la base de datos
        localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }

        if (currentUser.level > oldLevel) {
            alert(`✅ ¡Perfecto! 🎉\nHas subido al Nivel ${currentUser.level} (Liga ${rankInfo.rankName})\nGanaste +25 XP y +2 Monedas 🪙`);
        } else {
            alert(`✅ ¡Perfecto! Todas correctas.\nGanaste +25 XP y +2 Monedas 🪙`);
        }
        
        backToTopics();
    };

});