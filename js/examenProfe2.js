// Función para iniciar sesión
function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    // Buscar el usuario en localStorage 
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario && u.contrasena === contrasena
    );
    if (usuarioEncontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        alert("Inicio de sesión exitoso.");
        // Verificar el rol del usuario y redirigir según corresponda
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "admin.html";  
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; 
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "alumno.html"; 
        } else {
            alert("Rol no reconocido.");
        }
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Verificación de acceso en páginas protegidas
function verificarAccesoPagina(rolesPermitidos) {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        alert("Debe iniciar sesión para acceder a esta página.");
        window.location.href = "login.html";  
        return;
    }

    // Verificar si el rol del usuario activo es uno de los roles permitidos
    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tiene permisos suficientes.");
        window.location.href = "index.html"; 
        return;
    }
}
// Ajuste de la visibilidad de los paneles dependiendo del rol
function ajustarNavegacion() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
        // Mostrar el panel correspondiente según el rol
        if (usuarioActivo.rol === "administrador") {
            document.querySelector('a[href="admin.html"]').style.display = 'inline';
            document.querySelector('a[href="profe.html"]').style.display = 'none';  
        } else if (usuarioActivo.rol === "profesor") {
            document.querySelector('a[href="profe.html"]').style.display = 'inline'; 
            document.querySelector('a[href="admin.html"]').style.display = 'none'; 
        } else {
            // Si es un alumno, ocultar ambos paneles
            document.querySelector('a[href="profe.html"]').style.display = 'none';
            document.querySelector('a[href="admin.html"]').style.display = 'none';
        }
    } else {
        // Si no hay usuario activo, redirige a la página de login
        window.location.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cargarPreguntas(); // Cargar las preguntas al cargar la página
});
// Función para manejar la creación de exámenes
document.getElementById('formularioCrearExamen').addEventListener('submit', function (event) {
    event.preventDefault();
// Obtener las preguntas guardadas
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || []; 
    const preguntasSeleccionadas = [];

    // Recorrer todos los checkboxes de las preguntas seleccionadas
    const checkboxes = document.querySelectorAll('.seleccionarPregunta:checked');
    checkboxes.forEach((checkbox) => {
        const index = checkbox.getAttribute('data-index'); 
        preguntasSeleccionadas.push(preguntas[index]);
    });

    if (preguntasSeleccionadas.length === 0) {
        alert("Por favor, selecciona al menos una pregunta para crear el examen.");
        return;
    }

    // Recuperar el array de exámenes existentes desde localStorage
    const examenes = JSON.parse(localStorage.getItem('examenCreado')) || [];

    // El ID del nuevo examen será el siguiente número disponible
    const nuevoExamenId = examenes.length + 1;

    // Crear el objeto del examen
    const nuevoExamen = {
        id: nuevoExamenId,  // Asignar el ID numérico
        preguntas: preguntasSeleccionadas,
        fechaCreacion: new Date().toISOString() // Fecha de creación del examen
    };
    examenes.push(nuevoExamen);
    // Guardar el array actualizado en localStorage
    localStorage.setItem('examenCreado', JSON.stringify(examenes));
    mostrarMensajeExamenCreado();
  // Función para mostrar el mensaje de pregunta creada con éxito
function mostrarMensajeExamenCreado() {
    const mensajeExamenCreado = document.getElementById('mensajeExamenCreado');
    mensajeExamenCreado.style.display = 'block'; 

    setTimeout(() => {
        mensajeExamenCreado.style.display = 'none';
    }, 3000);
}
});

// Función para cargar el select con categorías
function cargarCategorias() {
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    //Esto ya si lo hemos visto en programacion funcional
    const categorias = [...new Set(preguntas.map(pregunta => pregunta.categoria))]; 
    const selectCategoria = document.getElementById('filtroCategoria');

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

// Función para cargar preguntas en la tabla, con filtro de categoría
function cargarPreguntas(categoriaFiltrada = '') {
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || []; //  las preguntas guardadas en localStorage
    const tablaPreguntas = document.getElementById('tablaPreguntas').getElementsByTagName('tbody')[0]; //  el cuerpo de la tabla
    tablaPreguntas.innerHTML = ''; 

    // Filtrar preguntas por categoría, si se ha seleccionado alguna, por defecto no
    const preguntasFiltradas = categoriaFiltrada 
        ? preguntas.filter(pregunta => pregunta.categoria === categoriaFiltrada) 
        : preguntas;

    preguntasFiltradas.forEach((pregunta, index) => {
        const fila = tablaPreguntas.insertRow(); 

        // Crear la celda para la pregunta
        const celdaPregunta = fila.insertCell();
        celdaPregunta.textContent = pregunta.pregunta;

        // Crear la celda para las opciones
        const celdaOpciones = fila.insertCell();
        celdaOpciones.innerHTML = pregunta.opciones.map(op => op.text).join('<br>'); // Mostrar las opciones con saltos de línea

        // Crear la celda para la respuesta correcta
        const celdaRespuestaCorrecta = fila.insertCell();
        const indiceRespuestaCorrecta = pregunta.respuestaCorrecta; 

        // Verificar si el índice de la respuesta correcta es válido y mostrarla
        if (indiceRespuestaCorrecta >= 0 && indiceRespuestaCorrecta < pregunta.opciones.length) {
            const respuestaCorrecta = pregunta.opciones[indiceRespuestaCorrecta]; 
            celdaRespuestaCorrecta.textContent = respuestaCorrecta.text;
        } else {
            celdaRespuestaCorrecta.textContent = 'No definida'; 
        }

        // Crear la celda para la categoría
        const celdaCategoria = fila.insertCell();
        celdaCategoria.textContent = pregunta.categoria; 
        // Crear la celda para el checkbox de selección de pregunta
        const celdaSeleccionar = fila.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('seleccionarPregunta');
        checkbox.setAttribute('data-index', index); 
        celdaSeleccionar.appendChild(checkbox); 
    });
}

// Cargar preguntas y categorías al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias(); // Cargar categorías al cargar la página
    cargarPreguntas(); // Cargar todas las preguntas al inicio

    // Filtrar preguntas por categoría cuando se cambie el select
    document.getElementById('filtroCategoria').addEventListener('change', function () {
        const categoriaSeleccionada = this.value;
        cargarPreguntas(categoriaSeleccionada); 
    });
});
