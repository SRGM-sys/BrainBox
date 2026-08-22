document.addEventListener('DOMContentLoaded', () => {
    let currentUser = JSON.parse(localStorage.getItem('brainbox_current_user') || "{}");
    let completed = currentUser.completedModules || [];
    let animated = currentUser.animatedNodes || [];
    let needsSave = false;

    const nodes = document.querySelectorAll('.module-node');
    
    nodes.forEach(node => {
        const moduleId = node.getAttribute('id') ? node.getAttribute('id').replace('node-', '') : null;
        const req = node.getAttribute('data-requires'); // ¿Qué módulo necesita estar completado?
        
        if (!moduleId) return;

        // 1. Si ESTE módulo ya está completado
        if (completed.includes(moduleId)) {
            node.className = 'module-node completed';
        } 
        // 2. Si no tiene requisitos (Ej: Módulo 1) y no está completado
        else if (!req) {
            node.className = 'module-node active';
        }
        // 3. Si TIENE un requisito y el requisito ESTÁ completado (¡Hora de desbloquear!)
        else if (req && completed.includes(req)) {
            // Verificamos si ya le mostramos la animación de explosión
            if (!animated.includes(moduleId)) {
                node.className = 'module-node unlocking';
                setTimeout(() => {
                    node.className = 'module-node active';
                }, 800);
                animated.push(moduleId);
                needsSave = true;
            } else {
                // Si ya la vio, solo lo dejamos activo
                node.className = 'module-node active';
            }
        } 
        // 4. Si tiene un requisito y NO está completado
        else {
            node.className = 'module-node locked';
        }
    });

    // Guardar si hubo nuevas animaciones
    if (needsSave) {
        currentUser.animatedNodes = animated;
        localStorage.setItem('brainbox_current_user', JSON.stringify(currentUser));
    }

    // --- MANEJADOR DE CLICS EN LOS NODOS ---
    window.handleNodeClick = function(element, url) {
        if (element.classList.contains('locked')) {
            alert("🔒 Debes completar el módulo anterior para desbloquear este.");
        } else if (element.classList.contains('unlocking')) {
            // Prevenir clic mientras explota el candado
        } else {
            window.location.href = url;
        }
    };
});