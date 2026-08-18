document.addEventListener('DOMContentLoaded', () => {
    const btnBack = document.querySelector('.back-btn');
    const pageTitle = document.getElementById('page-title');
    
    const viewGrid = document.getElementById('stem-grid');
    const allLists = document.querySelectorAll('.career-list');

    // Nombres para el título al cambiar de vista
    const titles = {
        'science': 'Ciencias',
        'technology': 'Tecnología',
        'engineering': 'Ingeniería',
        'math': 'Matemáticas'
    };

    // Función global para mostrar una categoría
    window.showCategory = function(categoryId) {
        // 1. Ocultar la cuadrícula principal
        viewGrid.classList.remove('active');
        
        // 2. Ocultar todas las listas por seguridad
        allLists.forEach(list => list.classList.remove('active'));
        
        // 3. Mostrar la lista seleccionada
        const targetList = document.getElementById(`list-${categoryId}`);
        if (targetList) {
            targetList.classList.add('active');
        }

        // 4. Cambiar el comportamiento del botón "Volver" y el Título
        pageTitle.textContent = titles[categoryId];
        
        // Removemos el enlace al index y le ponemos lógica de regresar a la cuadrícula
        btnBack.removeAttribute('href');
        btnBack.onclick = (e) => {
            e.preventDefault();
            returnToGrid();
        };
    };

    // Función para regresar a las 4 letras iniciales
    function returnToGrid() {
        // 1. Ocultar todas las listas
        allLists.forEach(list => list.classList.remove('active'));
        
        // 2. Mostrar la cuadrícula
        viewGrid.classList.add('active');
        
        // 3. Restaurar botón y título original
        pageTitle.textContent = 'Mundo STEM';
        btnBack.onclick = null;
        btnBack.setAttribute('href', '../index.html');
    }
});