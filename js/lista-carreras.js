document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BASE DE DATOS LOCAL DE CARRERAS
    const careersData = {
        'science': {
            title: 'Ciencias',
            color: '#26A653', // Verde
            items: [
                { 
                    img: '../assets/icons/ciencia-1.png', 
                    name: 'Ingeniería en Alimentos', 
                    desc: 'Aplicación de la ciencia y tecnología para el desarrollo, procesamiento, conservación y control de calidad de los productos alimenticios desde el campo hasta la mesa.',
                    egreso: 'Podrás dirigir plantas de producción, diseñar nuevos alimentos nutritivos, garantizar la calidad e inocuidad sanitaria, o investigar en biotecnología alimentaria.' 
                },
                { 
                    img: '../assets/icons/ciencia-2.png', 
                    name: 'Geología', 
                    desc: 'Análisis minucioso de la composición física, estructura interna, historia de la Tierra y los procesos dinámicos que la modelan.',
                    egreso: 'Serás clave en la exploración de recursos naturales, prevención de riesgos sísmicos y consultoría ambiental.' 
                },
                { 
                    img: '../assets/icons/ciencia-3.png', 
                    name: 'Oceanografía', 
                    desc: 'Exploración integral de los mares y océanos, abarcando sus vastos ecosistemas, el análisis de corrientes marinas y relieve submarino.',
                    egreso: 'Ejercerás en institutos de investigación marina, monitoreo del clima global y conservación de ecosistemas en peligro.' 
                },
                { 
                    img: '../assets/icons/ciencia-4.png', 
                    name: 'Acuicultura', 
                    desc: 'Ciencia y tecnología aplicada a la cría, reproducción y producción sustentable de organismos acuáticos de alto valor comercial.',
                    egreso: 'Liderarás la industria alimentaria dirigiendo granjas acuícolas y desarrollando sistemas de purificación de agua.' 
                },
                { 
                    img: '../assets/icons/ciencia-5.png', 
                    name: 'Ingeniería Agrícola y Biológica', 
                    desc: 'Aplicación de principios biológicos y de ingeniería para la producción agrícola sustentable y manejo eficiente de los recursos naturales.',
                    egreso: 'Podrás diseñar sistemas de riego inteligente, gestionar agronegocios y aplicar biotecnología para mejorar cultivos.' 
                }
            ]
        },
        'technology': {
            title: 'Tecnología',
            color: '#0984E3', // Azul
            items: [
                { 
                    img: '../assets/icons/tecnologia-1.png', 
                    name: 'Computación', 
                    desc: 'Desarrollo de software, algoritmos, bases de datos y sistemas informáticos eficientes.', 
                    egreso: 'Arquitecto de software, desarrollador web/móvil, analista de sistemas y experto en ciberseguridad.' 
                },
                { 
                    img: '../assets/icons/tecnologia-2.png', 
                    name: 'Ciencia de Datos e IA', 
                    desc: 'Análisis de grandes volúmenes de datos y creación de redes neuronales y aprendizaje automático.', 
                    egreso: 'Científico de datos, ingeniero de Inteligencia Artificial, consultor analítico y modelador predictivo.' 
                },
                { 
                    img: '../assets/icons/tecnologia-3.png', 
                    name: 'Telemática', 
                    desc: 'Integración de tecnologías de telecomunicaciones e informática para la transmisión de datos.', 
                    egreso: 'Administrador de redes, diseñador de sistemas IoT (Internet de las Cosas), consultor de conectividad.' 
                },
                { 
                    img: '../assets/icons/tecnologia-4.png', 
                    name: 'Telecomunicaciones', 
                    desc: 'Diseño, instalación y mantenimiento de redes de comunicación, antenas y sistemas satelitales.', 
                    egreso: 'Ingeniero de redes de telecomunicaciones, arquitecto de infraestructura inalámbrica, gestor de fibra óptica.' 
                }
            ]
        },
        'engineering': {
            title: 'Ingeniería',
            color: '#D63031', // Rojo
            items: [
                { 
                    img: '../assets/icons/ingenieria-1.png', 
                    name: 'Electricidad', 
                    desc: 'Generación, transmisión y distribución de energía eléctrica en alta y baja tensión.', 
                    egreso: 'Diseño de redes eléctricas, mantenimiento de plantas generadoras y especialista en energías renovables.' 
                },
                { 
                    img: '../assets/icons/ingenieria-2.png', 
                    name: 'Electrónica y Automatización', 
                    desc: 'Control de sistemas, diseño de placas y circuitos inteligentes para procesos industriales.', 
                    egreso: 'Ingeniero en automatización industrial, diseñador de hardware, especialista en sistemas integrados.' 
                },
                { 
                    img: '../assets/icons/ingenieria-3.png', 
                    name: 'Mecatrónica', 
                    desc: 'Fusión estratégica de mecánica, electrónica y software para crear robots y sistemas inteligentes.', 
                    egreso: 'Ingeniero de robótica, desarrollador de automatización de manufactura, diseñador de sistemas electromecánicos.' 
                },
                { 
                    img: '../assets/icons/ingenieria-4.png', 
                    name: 'Ingeniería Civil', 
                    desc: 'Diseño, construcción y mantenimiento de infraestructuras vitales como puentes, carreteras y edificios.', 
                    egreso: 'Gerente de obra, diseñador y calculista estructural, consultor de proyectos de desarrollo urbano.' 
                },
                { 
                    img: '../assets/icons/ingenieria-5.png', 
                    name: 'Ingeniería Industrial', 
                    desc: 'Optimización de procesos productivos, gestión de calidad y mejora de la eficiencia operativa empresarial.', 
                    egreso: 'Gerente de operaciones, analista de procesos, director de logística y supervisor de calidad industrial.' 
                },
                { 
                    img: '../assets/icons/ingenieria-6.png', 
                    name: 'Ingeniería Mecánica', 
                    desc: 'Análisis, diseño y fabricación de sistemas mecánicos, máquinas pesadas y motores térmicos.', 
                    egreso: 'Ingeniero de diseño mecánico, supervisor de mantenimiento industrial, analista de termodinámica.' 
                },
                { 
                    img: '../assets/icons/ingenieria-7.png', 
                    name: 'Ingeniería Química', 
                    desc: 'Transformación física y química de materias primas a gran escala para crear productos útiles y seguros.', 
                    egreso: 'Director de planta petroquímica, ingeniero de control de procesos, investigador de polímeros.' 
                },
                { 
                    img: '../assets/icons/ingenieria-8.png', 
                    name: 'Ingeniería en Materiales', 
                    desc: 'Desarrollo, procesamiento y ensayo de nuevos materiales como metales, polímeros, cerámicas y nanomateriales.', 
                    egreso: 'Investigador de I+D (Investigación y Desarrollo), inspector de calidad industrial, ingeniero metalúrgico.' 
                },
                { 
                    img: '../assets/icons/ingenieria-9.png', 
                    name: 'Ingeniería Naval', 
                    desc: 'Diseño, construcción y mantenimiento de embarcaciones, astilleros y artefactos marinos.', 
                    egreso: 'Ingeniero de astilleros, supervisor de flota naval, diseñador de plataformas oceánicas.' 
                },
                { 
                    img: '../assets/icons/ingenieria-10.png', 
                    name: 'Logística y Transporte', 
                    desc: 'Gestión eficiente de cadenas de suministro, redes de distribución nacional e internacional y sistemas de movilidad.', 
                    egreso: 'Director de Supply Chain, gerente de flotas de transporte, analista de distribución logística global.' 
                },
                { 
                    img: '../assets/icons/ingenieria-11.png', 
                    name: 'Ingeniería de Minas', 
                    desc: 'Exploración, extracción y procesamiento responsable de recursos minerales metálicos y no metálicos.', 
                    egreso: 'Ingeniero de minas, planificador de explotación, consultor ambiental minero.' 
                },
                { 
                    img: '../assets/icons/ingenieria-12.png', 
                    name: 'Ingeniería en Petróleos', 
                    desc: 'Exploración, perforación y producción de hidrocarburos y gestión avanzada de yacimientos energéticos.', 
                    egreso: 'Ingeniero de perforación, supervisor de yacimientos, consultor energético y de seguridad.' 
                }
            ]
        },
        'math': {
            title: 'Matemáticas',
            color: '#6C5CE7', // Morado
            items: [
                { 
                    img: '../assets/icons/matematica-1.png', 
                    name: 'Matemática', 
                    desc: 'Estudio abstracto de estructuras, lógica y modelado de la realidad mediante lenguajes cuantitativos.', 
                    egreso: 'Analista financiero, investigador académico, modelador matemático predictivo para empresas.' 
                },
                { 
                    img: '../assets/icons/matematica-2.png', 
                    name: 'Estadística', 
                    desc: 'Recopilación, análisis e interpretación cuantitativa de datos complejos para la toma de decisiones.', 
                    egreso: 'Analista de riesgos, consultor estadístico corporativo, actuario y proyeccionista de mercado.' 
                }
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