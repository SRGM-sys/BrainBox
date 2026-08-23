<div align="center">
  <h1>BrainBox</h1>
  <p><em>Una plataforma web interactiva y gamificada para el aprendizaje STEM</em> <br> https://srgm-sys.github.io/BrainBox/ </p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript Badge" />
</div>

## 1. Acerca del Proyecto
El objetivo principal de BrainBox es hacer que el aprendizaje de materias complejas como **Matemáticas, Física y Química** sea dinámico, divertido y visualmente atractivo. Además, incluye un componente de orientación vocacional para que los estudiantes descubran carreras afines a sus intereses.

### Características Principales:
- 🎯 **Rutas de Aprendizaje (Duolingo Style):** Nodos desbloqueables que representan módulos de estudio. No puedes avanzar al siguiente tema sin antes dominar el actual.
- 🎯 **Gamificación Total:** 
  - **Sistema de Ligas y Niveles:** Gana XP (experiencia) para subir de rango (Bronce, Plata, Oro, Esmeralda, Diamante), lo cual se refleja en un marco de colores alrededor de tu avatar.
  - **Monedas y Tienda de Canjeo:** Por cada lección completada, ganas monedas (puntos) que puedes canjear en la tienda virtual por premios reales o beneficios escolares (ej. +1 punto en una tarea, una empanada del bar).
  - **Rachas Diarias:** Fomenta la constancia premiando a los estudiantes que ingresan a estudiar en días consecutivos.
- 🎯 **Panel de Profesor:** Una vista exclusiva (`profesor.html`) para que el docente pueda monitorear el progreso de cada estudiante, ver sus barras de progreso en cada materia y conocer sus carreras de interés a través de tarjetas interactivas en 3D (efecto Flip).
- 🎯 **Explorador STEM:** Una sección dedicada a la orientación vocacional, donde los usuarios pueden interactuar mediante la funcionalidad de "Arrastrar y Soltar" (Drag & Drop) para armar su **Top 3 de Ingenierías o Ciencias** favoritas.
- 🎯 **Retos Diarios:** Evaluaciones combinadas de todos los módulos aprendidos para poner a prueba los conocimientos y ganar recompensas adicionales (monedas de oro).
- 🎯 **Diseño Moderno y Responsivo:** Interfaz amigable con animaciones fluidas, partículas de fondo flotantes, un diseño en tarjetas (cards) y optimización para teléfonos móviles y pantallas grandes.
- 🎯 **Almacenamiento Local (LocalStorage):** El sistema funciona completamente en el navegador del usuario utilizando JavaScript puro para gestionar sesiones, base de datos de usuarios, historiales de estudio y control de acceso, sin necesidad de un backend tradicional.

---

## 2. Imágenes de la página web 📸

A continuación se presentan capturas de las vistas principales del proyecto.

### 🏠 Dashboard Principal
*Vista general donde el estudiante ve su saludo, nivel, XP, racha semanal y el acceso a las tres materias principales.*
![Dashboard Principal](https://placehold.co/800x450/6C5CE7/FFFFFF?text=Captura+del+Dashboard+Principal)

### 🗺️ Ruta de Aprendizaje (Estilo Duolingo)
*El camino a seguir en una materia específica. Muestra los nodos completados, el módulo activo y los candados de las lecciones futuras sobre un fondo animado.*
![Ruta de Aprendizaje](https://placehold.co/800x450/00CEC9/FFFFFF?text=Captura+de+la+Ruta+de+Aprendizaje)

### 📖 Módulo de Estudio y Quiz
*Interfaz de lectura teórica y cuestionario de opción múltiple (Quiz) donde se verifican las respuestas para ganar XP.*
![Módulo de Estudio](https://placehold.co/800x450/44BD6E/FFFFFF?text=Captura+del+Modulo+y+Quiz)

### 🛍️ Tienda de Canjeo
*Sistema de recompensas con tarjetas dinámicas donde los alumnos gastan los puntos obtenidos.*
![Tienda de Canjeo](https://placehold.co/800x450/FDCB6E/FFFFFF?text=Captura+de+la+Tienda+de+Canjeo)

### 🧑‍🎓 Perfil del Estudiante
*Muestra el progreso circular en cada materia (Matemáticas, Física y Química), la liga actual y el Top 3 de carreras vocacionales.*
![Perfil](https://placehold.co/800x450/DFE6E9/2D3436?text=Captura+del+Perfil+del+Estudiante)

### 👨‍🏫 Panel del Profesor
*Tarjetas 3D que giran al hacer clic para que el maestro revise el avance estadístico y vocacional de sus alumnos.*
![Panel de Profesor](https://placehold.co/800x450/2D3436/FFFFFF?text=Captura+del+Panel+del+Profesor)

---

## 3. Tecnologías Utilizadas 🛠️

- **Frontend:** HTML5, CSS3 puro (Variables CSS, Grid, Flexbox, Keyframes para animaciones 3D y partículas).
- **Lógica e Interactividad:** Vanilla JavaScript (ES6+), implementando Drag & Drop API, manipulaciòn del DOM y lógicas de validación.
- **Base de Datos Simulada:** `localStorage` del navegador para almacenamiento de progreso, usuarios y estado de sesión.
- **Recursos Externos:** Se utilizó la API de DiceBear para la generación de avatares por defecto y Google Fonts (Inter).

## 4. Cómo ejecutar el proyecto ⚙️

1. Clona este repositorio o descarga el código fuente en un archivo ZIP y extráelo.
2. Este proyecto **no** necesita la instalación de dependencias, Node.js ni bases de datos locales.
3. Simplemente abre el archivo `index.html` en tu navegador web moderno (Chrome, Firefox, Edge, Safari).
4. Crea una cuenta nueva desde la pantalla principal para simular a un estudiante (tus datos se guardarán localmente).
5. **Para probar el Panel del Profesor**, debes iniciar sesión desde el index principal con las siguientes credenciales de administrador integradas:
   - **Correo:** `profesor@admin.com`
   - **Contraseña:** `admin123`

---
*Hecho para impulsar el aprendizaje de las ciencias exactas.*
