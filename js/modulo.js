document.addEventListener('DOMContentLoaded', () => {
    const viewTopics = document.getElementById('view-topics');
    const viewContent = document.getElementById('view-content');
    const topicTitle = document.getElementById('current-topic-title');
    const readingSection = document.getElementById('reading-section');
    const quizSection = document.getElementById('quiz-section');

    let currentTopicId = null;

    // --- 1. FUNCIÓN PARA ACTUALIZAR VISTOS Y AUTO-REPARAR MEDALLAS ---
    function updateCardsUI() {
        let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
        if (!currentUser.email) return;

        let answered = currentUser.answeredQuestions || [];
        let allQuestionsInModule = []; 

        const cards = document.querySelectorAll('.topic-card');
        cards.forEach(card => {
            const topicId = card.getAttribute('data-topic');
            if (topicId && window.moduleData && window.moduleData[topicId]) {
                const questions = window.moduleData[topicId].questions;
                const questionIds = questions.map(q => q.id);
                allQuestionsInModule.push(...questionIds); 
                
                const isCompleted = questionIds.length > 0 && questionIds.every(id => answered.includes(id));

                if (isCompleted) {
                    card.classList.add('completed-topic');
                } else {
                    card.classList.remove('completed-topic');
                }
            }
        });

        // AUTO-FIX de Medallas
        if (allQuestionsInModule.length > 0 && window.moduleId) {
            let completedWholeModule = allQuestionsInModule.every(id => answered.includes(id));
            if (completedWholeModule) {
                if (!currentUser.completedModules) currentUser.completedModules = [];
                if (!currentUser.completedModules.includes(window.moduleId)) {
                    currentUser.completedModules.push(window.moduleId);
                    localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
                    
                    let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
                    const index = users.findIndex(u => u.email === currentUser.email);
                    if (index !== -1) {
                        users[index] = currentUser;
                        localStorage.setItem('brainbox_users', JSON.stringify(users));
                    }
                }
            }
        }
    }

    updateCardsUI();

    // 2. ABRIR TEMA E INYECTAR CONTENIDO
    window.openTopic = function(topicId) {
        if (!window.moduleData || !window.moduleData[topicId]) return;

        currentTopicId = topicId;
        const data = window.moduleData[topicId];

        topicTitle.textContent = data.title;
        readingSection.innerHTML = data.reading;

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

        viewTopics.style.display = 'none';
        viewContent.style.display = 'block';
        document.querySelector('.module-content').scrollTop = 0;
    };

    window.backToTopics = function() {
        viewContent.style.display = 'none';
        viewTopics.style.display = 'block';
        currentTopicId = null;
    };

    // 3. MOTOR DE RANGOS
    window.calculateRank = function(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce' };
        if (xp < 200) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata' };
        if (xp < 300) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro' };
        if (xp < 500) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda' };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante' }; 
    };

    // 4. VERIFICAR RESPUESTAS Y DAR RECOMPENSA
    window.verifyAndClaim = function() {
        const data = window.moduleData[currentTopicId];
        let allCorrect = true;
        let answeredAll = true;

        data.questions.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (!selected) answeredAll = false;
            else if (parseInt(selected.value) !== q.correctIndex) allCorrect = false;
        });

        if (!answeredAll) {
            alert("⚠️ Debes responder todas las preguntas para continuar.");
            return;
        }
        if (!allCorrect) {
            alert("❌ Al menos una respuesta es incorrecta. ¡Vuelve a repasar la lectura e inténtalo de nuevo!");
            return;
        }

        let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
        if (!currentUser.answeredQuestions) currentUser.answeredQuestions = [];
        
        const questionIds = data.questions.map(q => q.id);
        const alreadyClaimed = questionIds.every(id => currentUser.answeredQuestions.includes(id));

        if (alreadyClaimed) {
            alert("✅ ¡Perfecto! Todas las respuestas son correctas.\n(Ya habías completado esta lección, así que es un buen repaso).");
            backToTopics();
            return;
        }

        currentUser.xp = (currentUser.xp || 0) + 25;
        currentUser.points = (currentUser.points || 0) + 2;
        
        const rankInfo = calculateRank(currentUser.xp);
        const oldLevel = currentUser.level || 1;
        
        currentUser.level = rankInfo.level;
        currentUser.rankClass = rankInfo.rankClass;

        let uniqueQuestions = new Set([...currentUser.answeredQuestions, ...questionIds]);
        currentUser.answeredQuestions = Array.from(uniqueQuestions);

        // ==========================================
        // 🔥 INICIO DEL MOTOR DE RACHA (STREAK)
        // ==========================================
        const todayObj = new Date();
        const todayStr = todayObj.toLocaleDateString();
        let streakMsg = "";

        if (currentUser.lastStudyDate !== todayStr) {
            const yesterdayObj = new Date();
            yesterdayObj.setDate(yesterdayObj.getDate() - 1);
            const yesterdayStr = yesterdayObj.toLocaleDateString();

            if (currentUser.lastStudyDate === yesterdayStr) {
                currentUser.streak = (currentUser.streak || 0) + 1;
            } else {
                currentUser.streak = 1;
            }
            currentUser.lastStudyDate = todayStr;

            if (!currentUser.studyHistory) currentUser.studyHistory = [];
            if (!currentUser.studyHistory.includes(todayStr)) {
                currentUser.studyHistory.push(todayStr);
            }

            streakMsg = `\n\n🔥 ¡Racha activa! Llevas ${currentUser.streak} día(s) seguidos.`;

            if (currentUser.streak % 5 === 0) {
                currentUser.points = (currentUser.points || 0) + 5;
                streakMsg += `\n🎁 ¡BONO DE RACHA! Ganaste +5 Monedas de Oro.`;
            }
        }
        // ==========================================

        localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }

        updateCardsUI();

        let allQuestionsInModule = [];
        for(let key in window.moduleData) {
            window.moduleData[key].questions.forEach(q => allQuestionsInModule.push(q.id));
        }
        let completedWholeModule = allQuestionsInModule.every(id => currentUser.answeredQuestions.includes(id));
        let alertExtra = completedWholeModule ? "\n\n🌟 ¡HAS COMPLETADO EL MÓDULO ENTERO! 🌟\n¡Un nuevo nivel se ha desbloqueado en tu ruta!" : "";

        if (currentUser.level > oldLevel) {
            alert(`✅ ¡Perfecto! 🎉\nHas subido al Nivel ${currentUser.level} (Liga ${rankInfo.rankName})\nGanaste +25 XP y +2 Monedas 🪙` + alertExtra + streakMsg);
        } else {
            alert(`✅ ¡Perfecto! Todas correctas.\nGanaste +25 XP y +2 Monedas 🪙` + alertExtra + streakMsg);
        }
        
        backToTopics();
    };
});