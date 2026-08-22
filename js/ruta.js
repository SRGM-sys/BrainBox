document.addEventListener('DOMContentLoaded', () => {
    // Función global para desbloquear un módulo al darle clic
    window.unlockModule = function(nodeElement) {
        
        // Solo hacemos la animación si el nodo está bloqueado
        if (nodeElement.classList.contains('locked')) {
            
            // 1. Quitamos la clase bloqueada y ponemos la de animación
            nodeElement.classList.remove('locked');
            nodeElement.classList.add('unlocking');
            
            // 2. Esperamos a que termine la animación (800ms) para dejarlo activo
            setTimeout(() => {
                nodeElement.classList.remove('unlocking');
                nodeElement.classList.add('active');
                
                // Opcional: Pequeña celebración
                // alert("¡Nuevo módulo desbloqueado!");
            }, 800); 
        }
    };
});