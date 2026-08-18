document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BASE DE DATOS LOCAL DE CARRERAS
    const careersData = {
        'science': {
            title: 'Ciencias',
            color: '#26A653', // Verde
            items: [
                { icon: '🧬', name: 'Biología', desc: 'Estudia los seres vivos, su origen, evolución y propiedades.' },
                { icon: '🌍', name: 'Geología', desc: 'Análisis de la composición, estructura y procesos de la Tierra.' },
                { icon: '🌊', name: 'Oceanografía', desc: 'Exploración de los mares, ecosistemas marinos y corrientes.' },
                { icon: '🐟', name: 'Acuicultura', desc: 'Ciencia aplicada a la producción sustentable de organismos acuáticos.' },
                { icon: '🍎', name: 'Nutrición y Dietética', desc: 'Estudio de la alimentación y su impacto directo en la salud humana.' }
            ]
        },
        'technology': {
            title: 'Tecnología',
            color: '#0984E3', // Azul
            items: [
                { icon: '💻', name: 'Computación', desc: 'Desarrollo de software, algoritmos y sistemas informáticos.' },
                { icon: '🧠', name: 'Ciencia de Datos e IA', desc: 'Análisis de grandes volúmenes de datos y creación de redes neuronales.' },
                { icon: '📡', name: 'Telemática', desc: 'Integración de tecnologías de telecomunicaciones e informática.' }
            ]
        },
        'engineering': {
            title: 'Ingeniería',
            color: '#D63031', // Rojo
            items: [
                { icon: '⚡', name: 'Electricidad', desc: 'Generación, transmisión y distribución de energía eléctrica.' },
                { icon: '🤖', name: 'Electrónica y Automat.', desc: 'Control de sistemas, robótica y circuitos inteligentes.' },
                { icon: '📶', name: 'Telecomunicaciones', desc: 'Diseño de redes de comunicación, antenas y satélites.' },
                { icon: '⚙️', name: 'Mecánica', desc: 'Diseño y análisis de maquinaria, motores y sistemas térmicos.' },
                { icon: '🦾', name: 'Mecatrónica', desc: 'Fusión de mecánica, electrónica y software para crear robots.' },
                { icon: '🧱', name: 'Materiales', desc: 'Desarrollo de nuevos polímeros, metales y biomateriales.' },
                { icon: '🏭', name: 'Ing. Industrial', desc: 'Optimización de procesos operativos, logística y calidad.' },
                { icon: '🥫', name: 'Ing. en Alimentos', desc: 'Procesamiento, conservación y seguridad de la industria alimentaria.' },
                { icon: '🧪', name: 'Ing. Química', desc: 'Transformación de materias primas a gran escala.' },
                { icon: '🏗️', name: 'Ing. Civil', desc: 'Diseño y construcción de infraestructuras: puentes, vías, edificios.' },
                { icon: '⛏️', name: 'Minas', desc: 'Extracción responsable y procesamiento de recursos minerales.' },
                { icon: '🛢️', name: 'Petróleos', desc: 'Exploración y explotación de hidrocarburos y energías.' },
                { icon: '🚜', name: 'Agrícola y Biológica', desc: 'Tecnología aplicada al campo y la producción sustentable.' },
                { icon: '🚢', name: 'Naval', desc: 'Diseño y construcción de embarcaciones y plataformas marítimas.' },
                { icon: '📦', name: 'Logística y Transporte', desc: 'Gestión eficiente de cadenas de suministro y movilidad.' }
            ]
        },
        'math': {
            title: 'Matemáticas',
            color: '#6C5CE7', // Morado
            items: [
                { icon: '➗', name: 'Matemática', desc: 'Estudio abstracto de estructuras, lógica y modelado de la realidad.' },
                { icon: '📊', name: 'Estadística', desc: 'Recopilación, análisis e interpretación cuantitativa de datos complejos.' }
            ]
        }
    };

    // 2. LEER LA URL
    // Esto captura la parte "?area=science" y extrae solo la palabra "science"
    const urlParams = new URLSearchParams(window.location.search);
    const selectedArea = urlParams.get('area');

    // 3. VALIDACIÓN
    // Si el usuario entró directo a la página sin un parámetro válido, lo regresamos
    if (!selectedArea || !careersData[selectedArea]) {
        window.location.href = 'carreras-stem.html';
        return;
    }

    // 4. INYECTAR LOS DATOS
    const data = careersData[selectedArea];
    
    // Actualizar el título y su color
    const titleElement = document.getElementById('area-title');
    titleElement.textContent = data.title;
    titleElement.style.color = data.color;

    // Generar las tarjetas HTML
    const container = document.getElementById('careers-container');
    container.innerHTML = ''; // Limpiamos por si acaso

    data.items.forEach(career => {
        // Creamos la tarjeta
        const card = document.createElement('div');
        card.className = 'career-card';
        
        // Llenamos el interior de la tarjeta con el formato visual que queremos
        card.innerHTML = `
            <div class="career-img" style="color: ${data.color}; background-color: ${data.color}15;">
                ${career.icon}
            </div>
            <div class="career-text">
                <h4 style="color: ${data.color};">${career.name}</h4>
                <p>${career.desc}</p>
            </div>
            <!-- Botón de reproducir/ver para seguir el diseño que pediste -->
            <button class="info-btn" style="color: ${data.color};">▶️</button>
        `;
        
        // La agregamos al contenedor
        container.appendChild(card);
    });
});