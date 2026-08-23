document.addEventListener('DOMContentLoaded', () => {

    let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
    if (!currentUser.email) {
        window.location.href = '../index.html';
        return;
    }

    // 1. VALIDACIÓN 1: Módulos requeridos
    const completed = currentUser.completedModules || [];
    if (!completed.includes('math_m1') || !completed.includes('phys_m1') || !completed.includes('chem_m1')) {
        alert("🔒 ACCESO DENEGADO\nPara acceder a los retos combinados, debes completar primero el Módulo 1 de Matemáticas, Física y Química.");
        window.location.href = 'dashboard.html';
        return;
    }

    // Obtenemos la fecha actual
    const todayObj = new Date();
    const today = todayObj.toLocaleDateString();

    // 2. VALIDACIÓN 2: Un intento por día
    if (currentUser.lastChallengeDate === today) {
        alert("⏳ INTENTO AGOTADO\nYa usaste tu intento de hoy. Vuelve mañana para un nuevo reto.");
        window.location.href = 'dashboard.html';
        return;
    }

    // 3. BANCO CENTRAL DE PREGUNTAS
    const questionBank = [
        // Matemáticas M1
        { id: "math_m1_t1_q1", text: "Elige la oración que NO es una proposición:", options: ["París está en Europa.", "2 + 2 = 4.", "¡Lávate las manos!", "El agua hierve a 100 grados."], correctIndex: 2 },
        { id: "math_m1_t2_q1", text: "Si p = Verdadero y q = Falso, ¿cuál es el valor de verdad de (p ∧ q)?", options: ["Verdadero", "Falso", "No se sabe", "Ambos"], correctIndex: 1 },
        { id: "math_m1_t3_q1", text: "En 'Si estudio, aprobaré el examen', ¿qué tipo de condición es 'estudiar'?", options: ["Necesaria", "Suficiente", "Ninguna", "Ambas"], correctIndex: 1 },
        
        // Matemáticas M2
        { id: "math_m2_t1_q1", text: "¿Qué representa el conjunto Referencial (Re)?", options: ["El conjunto universo o de referencia.", "Una ecuación sin resolver.", "El conjunto de errores.", "Un predicado falso."], correctIndex: 0 },
        { id: "math_m2_t4_q2", text: "El conjunto formado por todos los elementos que pertenecen a A, a B, o a ambos, se llama:", options: ["Intersección", "Diferencia", "Unión", "Complemento"], correctIndex: 2 },
        
        // Física M1
        { id: "phys_m1_t1_q1", text: "¿Cuál es la unidad fundamental de la masa en el Sistema Internacional?", options: ["Gramo (g)", "Libra (lb)", "Kilogramo (kg)", "Newton (N)"], correctIndex: 2 },
        { id: "phys_m1_t2_q1", text: "El prefijo 'kilo' (k) representa una potencia de:", options: ["10²", "10⁻³", "10⁶", "10³"], correctIndex: 3 },
        { id: "phys_m1_t3_q1", text: "¿Cuántas cifras significativas tiene el número 0.0045?", options: ["2", "4", "5", "1"], correctIndex: 0 },
        
        // Física M2
        { id: "phys_m2_t1_q1", text: "¿Qué componentes son necesarios para definir una magnitud vectorial?", options: ["Solo el número.", "Módulo, dirección y sentido.", "Masa y peso.", "Solo dirección."], correctIndex: 1 },
        
        // Química M1
        { id: "chem_m1_t1_q1", text: "¿Qué partículas subatómicas se encuentran en el núcleo del átomo?", options: ["Solo electrones.", "Protones y neutrones.", "Electrones y protones.", "Solo neutrones."], correctIndex: 1 },
        { id: "chem_m1_t2_q1", text: "¿Qué determina la identidad de un elemento químico?", options: ["Número Másico (A)", "Número Atómico (Z)", "Electrones", "Neutrones"], correctIndex: 1 },
        { id: "chem_m1_t3_q2", text: "Si un átomo neutro pierde un electrón, se transforma en un:", options: ["Isótopo", "Anión", "Catión", "Nuevo elemento"], correctIndex: 2 }
    ];

    // 4. FILTRAR Y ELEGIR PREGUNTAS ALEATORIAS
    let answered = currentUser.answeredQuestions || [];
    
    // Solo tomamos preguntas que el usuario YA haya respondido en sus lecciones
    let availableQs = questionBank.filter(q => answered.includes(q.id));

    // Desordenar y tomar 5
    availableQs.sort(() => Math.random() - 0.5); 
    window.selectedQs = availableQs.slice(0, 5); 

    // 5. RENDERIZAR EL TEST
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

    // 6. FUNCIÓN DE EVALUACIÓN
    window.evaluateChallenge = function() {
        let score = 0;
        let allAnswered = true;

        window.selectedQs.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (!selected) {
                allAnswered = false;
            } else if (parseInt(selected.value) === q.correctIndex) {
                score++;
            }
        });

        if (!allAnswered) {
            alert("⚠️ Debes responder todas las preguntas antes de terminar.");
            return;
        }

        // Bloquear para el resto del día
        currentUser.lastChallengeDate = today;

        // ==========================================
        // 🔥 MOTOR DE RACHA (STREAK)
        // ==========================================
        let streakMsg = "";
        if (currentUser.lastStudyDate !== today) {
            const yesterdayObj = new Date();
            yesterdayObj.setDate(yesterdayObj.getDate() - 1);
            const yesterdayStr = yesterdayObj.toLocaleDateString();

            if (currentUser.lastStudyDate === yesterdayStr) {
                currentUser.streak = (currentUser.streak || 0) + 1;
            } else {
                currentUser.streak = 1;
            }
            currentUser.lastStudyDate = today;

            if (!currentUser.studyHistory) currentUser.studyHistory = [];
            if (!currentUser.studyHistory.includes(today)) {
                currentUser.studyHistory.push(today);
            }

            streakMsg = `\n\n🔥 ¡Racha activa! Llevas ${currentUser.streak} día(s) seguidos.`;

            if (currentUser.streak % 5 === 0) {
                currentUser.points = (currentUser.points || 0) + 5;
                streakMsg += `\n🎁 ¡BONO DE RACHA! Ganaste +5 Monedas de Oro extras.`;
            }
        }
        // ==========================================

        if (score === 5) {
            currentUser.points = (currentUser.points || 0) + 5;
            alert(`🎉 ¡PERFECTO! 🎉\nHas respondido 5/5 correctamente.\n¡Ganaste 5 Monedas de Oro! 🪙` + streakMsg);
        } else {
            alert(`Has obtenido ${score} de 5 respuestas correctas.\nNo ganaste monedas del reto esta vez, ¡pero sumaste a tu racha! 💪` + streakMsg);
        }

        // Guardar y salir
        localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
        
        let users = JSON.parse(localStorage.getItem('brainbox_users')) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem('brainbox_users', JSON.stringify(users));
        }

        window.location.href = 'dashboard.html';
    };
});