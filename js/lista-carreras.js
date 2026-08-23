document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BASE DE DATOS LOCAL DE CARRERAS
    const careersData = {
        'science': {
            title: 'Ciencias',
            color: '#26A653', // Verde
            items: [
                { 
                    img: '../assets/images/biologia.jpg', 
                    name: 'Biología', 
                    desc: 'Estudio profundo de los seres vivos, su estructura, funcionamiento celular, genética, evolución y las complejas interacciones con su entorno natural.',
                    egreso: 'Podrás trabajar en investigación científica, conservación de vida silvestre, biotecnología o laboratorios clínicos.' 
                },
                { 
                    img: '../assets/images/geologia.jpg', 
                    name: 'Geología', 
                    desc: 'Análisis minucioso de la composición física, estructura interna, historia de la Tierra y los procesos dinámicos que la modelan.',
                    egreso: 'Serás clave en la exploración de recursos naturales, prevención de riesgos sísmicos y consultoría ambiental.' 
                },
                { 
                    img: '../assets/images/oceanografia.jpg', 
                    name: 'Oceanografía', 
                    desc: 'Exploración integral de los mares y océanos, abarcando sus vastos ecosistemas, el análisis de corrientes marinas y relieve submarino.',
                    egreso: 'Ejercerás en institutos de investigación marina, monitoreo del clima global y conservación de ecosistemas en peligro.' 
                },
                { 
                    img: '../assets/images/acuicultura.jpg', 
                    name: 'Acuicultura', 
                    desc: 'Ciencia y tecnología aplicada a la cría, reproducción y producción sustentable de organismos acuáticos de alto valor.',
                    egreso: 'Liderarás la industria alimentaria dirigiendo granjas acuícolas y desarrollando sistemas de purificación de agua.' 
                },
                { 
                    img: '../assets/images/nutricion.jpg', 
                    name: 'Nutrición y Dietética', 
                    desc: 'Estudio científico de la alimentación, los nutrientes bioquímicos y su impacto directo en el metabolismo celular.',
                    egreso: 'Trabajarás diseñando planes nutricionales en clínicas, optimizando el rendimiento deportivo, o creando productos saludables.' 
                }
            ]
        },
        'technology': {
            title: 'Tecnología',
            color: '#0984E3', // Azul
            items: [
                { img: '../assets/images/computacion.jpg', name: 'Computación', desc: 'Desarrollo de software, algoritmos y sistemas informáticos.', egreso: 'Arquitecto de software, desarrollador web, experto en ciberseguridad.' },
                { img: '../assets/images/datos.jpg', name: 'Ciencia de Datos e IA', desc: 'Análisis de grandes volúmenes de datos y creación de redes neuronales.', egreso: 'Científico de datos, ingeniero de IA, consultor analítico.' },
                { img: '../assets/images/telematica.jpg', name: 'Telemática', desc: 'Integración de tecnologías de telecomunicaciones e informática.', egreso: 'Administrador de redes, diseño de IoT, ingeniero de telecomunicaciones.' }
            ]
        },
        'engineering': {
            title: 'Ingeniería',
            color: '#D63031', // Rojo
            items: [
                { img: '../assets/images/electricidad.jpg', name: 'Electricidad', desc: 'Generación, transmisión y distribución de energía eléctrica.', egreso: 'Diseño de redes eléctricas, mantenimiento de plantas, energías renovables.' },
                { img: '../assets/images/electronica.jpg', name: 'Electrónica y Automat.', desc: 'Control de sistemas, robótica y circuitos inteligentes.', egreso: 'Automatización industrial, robótica, diseño de hardware.' },
                { img: '../assets/images/mecatronica.jpg', name: 'Mecatrónica', desc: 'Fusión de mecánica, electrónica y software para crear robots.', egreso: 'Ingeniero de robótica, diseñador de sistemas electromecánicos.' }
            ]
        },
        'math': {
            title: 'Matemáticas',
            color: '#6C5CE7', // Morado
            items: [
                { img: '../assets/images/matematica.jpg', name: 'Matemática', desc: 'Estudio abstracto de estructuras, lógica y modelado de la realidad.', egreso: 'Analista financiero, investigador, modelador matemático predictivo.' },
                { img: '../assets/images/estadistica.jpg', name: 'Estadística', desc: 'Recopilación, análisis e interpretación cuantitativa de datos complejos.', egreso: 'Analista de riesgos, consultor estadístico, actuario.' }
            ]
        }
    };

    // 2. LEER LA URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedArea = urlParams.get('area');

    // 3. VALIDACIÓN
    if (!selectedArea || !careersData[selectedArea]) {
        window.location.href = 'carreras-stem.html';
        return;
    }

    // 4. INYECTAR LOS DATOS Y ANIMACIONES
    const data = careersData[selectedArea];
    
    const titleElement = document.getElementById('area-title');
    titleElement.textContent = data.title;
    titleElement.style.color = data.color;

    const container = document.getElementById('careers-container');
    container.innerHTML = ''; 

    // Añadimos "index" para calcular el retraso de la animación
    data.items.forEach((career, index) => {
        const card = document.createElement('div');
        card.className = 'career-card';
        
        card.style.borderColor = `${data.color}33`; 
        
        // Magia: Cada tarjeta tarda 0.15 segundos más en aparecer que la anterior
        card.style.animationDelay = `${index * 0.15}s`;
        
        // HTML inyectado sin el botón de play
        card.innerHTML = `
            <div class="career-img-container">
                <img src="${career.img}" onerror="this.src='https://placehold.co/400x400/${data.color.replace('#','')}/FFFFFF?text=${encodeURIComponent(career.name)}'" alt="${career.name}">
            </div>
            <div class="career-content">
                <div class="career-header">
                    <h3 class="career-title" style="color: ${data.color};">${career.name}</h3>
                </div>
                <p class="career-desc">${career.desc}</p>
                <div class="career-prospects" style="background-color: ${data.color}15; border-left: 4px solid ${data.color};">
                    <strong style="color: ${data.color};">🎓 Perfil de Egreso</strong>
                    <p>${career.egreso}</p>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
});