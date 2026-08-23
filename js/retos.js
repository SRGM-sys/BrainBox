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

    // --- LÓGICA DE FECHAS ESTANDARIZADA ---
    function getStandardDate(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
    if (!currentUser.email) {
        window.location.href = '../index.html';
        return;
    }

    const completed = currentUser.completedModules || [];
    if (!completed.includes('math_m1') || !completed.includes('phys_m1') || !completed.includes('chem_m1')) {
        showCustomAlert("🔒 Acceso Denegado", "Para acceder a los retos combinados, debes completar primero el Módulo 1 de Matemáticas, Física y Química.", () => {
            window.location.href = 'dashboard.html';
        });
        return;
    }

    const todayObj = new Date();
    const todayStr = getStandardDate(todayObj);

    if (currentUser.lastChallengeDate === todayStr) {
        showCustomAlert("⏳ Intento Agotado", "Ya usaste tu intento de hoy.\nVuelve mañana para un nuevo reto.", () => {
            window.location.href = 'dashboard.html';
        });
        return;
    }

    const questionBank = [
        { id: "math_m1_t1_q1", text: "Elige la oración que NO es una proposición:", options: ["París está en Europa.", "2 + 2 = 4.", "¡Lávate las manos!", "El agua hierve a 100 grados."], correctIndex: 2 },
        { id: "math_m1_t2_q1", text: "Si p = Verdadero y q = Falso, ¿cuál es el valor de verdad de (p ∧ q)?", options: ["Verdadero", "Falso", "No se sabe", "Ambos"], correctIndex: 1 },
        { id: "math_m1_t3_q1", text: "En 'Si estudio, aprobaré el examen', ¿qué tipo de condición es 'estudiar'?", options: ["Necesaria", "Suficiente", "Ninguna", "Ambas"], correctIndex: 1 },
        { id: "math_m2_t1_q1", text: "¿Qué representa el conjunto Referencial (Re)?", options: ["El conjunto universo o de referencia.", "Una ecuación sin resolver.", "El conjunto de errores.", "Un predicado falso."], correctIndex: 0 },
        { id: "math_m2_t4_q2", text: "El conjunto formado por todos los elementos que pertenecen a A, a B, o a ambos, se llama:", options: ["Intersección", "Diferencia", "Unión", "Complemento"], correctIndex: 2 },
        { id: "phys_m1_t1_q1", text: "¿Cuál es la unidad fundamental de la masa en el Sistema Internacional?", options: ["Gramo (g)", "Libra (lb)", "Kilogramo (kg)", "Newton (N)"], correctIndex: 2 },
        { id: "phys_m1_t2_q1", text: "El prefijo 'kilo' (k) representa una potencia de:", options: ["10²", "10⁻³", "10⁶", "10³"], correctIndex: 3 },
        { id: "phys_m1_t3_q1", text: "¿Cuántas cifras significativas tiene el número 0.0045?", options: ["2", "4", "5", "1"], correctIndex: 0 },
        { id: "phys_m2_t1_q1", text: "¿Qué componentes son necesarios para definir una magnitud vectorial?", options: ["Solo el número.", "Módulo, dirección y sentido.", "Masa y peso.", "Solo dirección."], correctIndex: 1 },
        { id: "chem_m1_t1_q1", text: "¿Qué partículas subatómicas se encuentran en el núcleo del átomo?", options: ["Solo electrones.", "Protones y neutrones.", "Electrones y protones.", "Solo neutrones."], correctIndex: 1 },
        { id: "chem_m1_t2_q1", text: "¿Qué determina la identidad de un elemento químico?", options: ["Número Másico (A)", "Número Atómico (Z)", "Electrones", "Neutrones"], correctIndex: 1 },
        { id: "chem_m1_t3_q2", text: "Si un átomo neutro pierde un electrón, se transforma en un:", options: ["Isótopo", "Anión", "Catión", "Nuevo elemento"], correctIndex: 2 }
    ];

    let answered = currentUser.answeredQuestions || [];
    let availableQs = questionBank.filter(q => answered.includes(q.id));
    availableQs.sort(() => Math.random() - 0.5); 
    window.selectedQs = availableQs.slice(0, 5); 

    const quizSection = document.getElementById('quiz-section');
    let quizHtml = '';
    
    window.selectedQs.forEach((q, qIndex) => {
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

    window.evaluateChallenge = function() {
        let score = 0;
        let allAnswered = true;

        window.selectedQs.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (!selected) allAnswered = false;
            else if (parseInt(selected.value) === q.correctIndex) score++;
        });

        if (!allAnswered) {
            showCustomAlert("⚠️ Faltan Respuestas", "Debes responder todas las preguntas antes de terminar.");
            return;
        }

        currentUser.lastChallengeDate = todayStr;

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

        const finishAndSave = () => {
            localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
            let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
            const index = users.findIndex(u => u.email === currentUser.email);
            if (index !== -1) {
                users[index] = currentUser;
                localStorage.setItem('brainbox_users', JSON.stringify(users));
            }
            window.location.href = 'dashboard.html';
        };

        if (score === 5) {
            currentUser.points = (currentUser.points || 0) + 5;
            showCustomAlert("🎉 ¡PERFECTO!", `Has respondido 5/5 correctamente.\n¡Ganaste 5 Monedas de Oro! 🪙${streakMsg}`, finishAndSave);
        } else {
            showCustomAlert("Buen intento", `Has obtenido ${score} de 5 respuestas correctas.\nNo ganaste monedas esta vez, ¡pero sumaste a tu racha!${streakMsg}`, finishAndSave);
        }
    };
});