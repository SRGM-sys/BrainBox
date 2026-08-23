document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIÓN MÁGICA PARA CREAR ALERTAS BONITAS ---
    window.showCustomAlert = function(title, message, callback) {
        let overlay = document.getElementById('brainbox-alert');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'brainbox-alert';
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
            
            let box = document.createElement('div');
            box.id = 'brainbox-alert-box';
            box.style.cssText = 'background: var(--surface-color, #ffffff); padding: 30px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; max-width: 350px; width: 90%; transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);';
            
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

        const box = document.getElementById('brainbox-alert-box');
        box.innerHTML = `
            <h3 style="color: var(--text-main, #2D3436); font-size: 1.3rem; margin-top: 0; margin-bottom: 10px;">${title}</h3>
            <p style="color: var(--text-muted, #636E72); font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px;">${message.replace(/\n/g, '<br>')}</p>
            <button id="brainbox-alert-btn" style="background: var(--primary-color, #6C5CE7); color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: bold; font-size: 1rem; width: 100%; cursor: pointer; box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);">Aceptar</button>
        `;

        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
            box.style.transform = 'scale(1)';
        }, 10);

        document.getElementById('brainbox-alert-btn').onclick = () => {
            overlay.style.opacity = '0';
            box.style.transform = 'scale(0.8)';
            setTimeout(() => {
                overlay.style.display = 'none';
                if (callback) callback();
            }, 300);
        };
    };

    function getStandardDate(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    const viewTopics = document.getElementById('view-topics');
    const viewContent = document.getElementById('view-content');
    const topicTitle = document.getElementById('current-topic-title');
    const readingSection = document.getElementById('reading-section');
    const quizSection = document.getElementById('quiz-section');
    let currentTopicId = null;

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
                if (isCompleted) card.classList.add('completed-topic');
                else card.classList.remove('completed-topic');
            }
        });

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

    window.calculateRank = function(xp) {
        if (xp < 100) return { level: 1, rankClass: 'rank-bronce', rankName: 'Bronce' };
        if (xp < 250) return { level: 2, rankClass: 'rank-plata', rankName: 'Plata' };
        if (xp < 450) return { level: 3, rankClass: 'rank-oro', rankName: 'Oro' };
        if (xp < 750) return { level: 4, rankClass: 'rank-esmeralda', rankName: 'Esmeralda' };
        return { level: 5, rankClass: 'rank-diamante', rankName: 'Diamante' }; 
    };

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
            showCustomAlert("⚠️ Atención", "Debes responder todas las preguntas para continuar.");
            return;
        }
        if (!allCorrect) {
            showCustomAlert("❌ Error", "Al menos una respuesta es incorrecta.\n¡Vuelve a repasar la lectura e inténtalo de nuevo!");
            return;
        }

        let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
        if (!currentUser.answeredQuestions) currentUser.answeredQuestions = [];
        
        const questionIds = data.questions.map(q => q.id);
        const alreadyClaimed = questionIds.every(id => currentUser.answeredQuestions.includes(id));

        if (alreadyClaimed) {
            showCustomAlert("✅ ¡Excelente Repaso!", "Todas las respuestas son correctas.\n(Ya habías completado esta lección).", backToTopics);
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

        const todayObj = new Date();
        const todayStr = getStandardDate(todayObj);
        let streakMsg = "";

        if (currentUser.lastStudyDate !== todayStr) {
            const yesterdayObj = new Date();
            yesterdayObj.setDate(yesterdayObj.getDate() - 1);
            const yesterdayStr = getStandardDate(yesterdayObj);

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
                streakMsg += `\n¡BONO DE RACHA! Ganaste +5 Monedas de Oro.`;
            }
        }

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
        let alertExtra = completedWholeModule ? "\n\n¡HAS COMPLETADO EL MÓDULO ENTERO!\n¡Un nuevo nivel se ha desbloqueado en tu ruta!" : "";

        if (currentUser.level > oldLevel) {
            showCustomAlert("✅ ¡NUEVO NIVEL! ", `Has subido al Nivel ${currentUser.level} (Liga ${rankInfo.rankName})\nGanaste +25 XP y +2 Monedas 🪙${alertExtra}${streakMsg}`, backToTopics);
        } else {
            showCustomAlert("✅ ¡Perfecto!", `Todas correctas.\nGanaste +25 XP y +2 Monedas 🪙${alertExtra}${streakMsg}`, backToTopics);
        }
    };
});