// Función para iniciar sesión
function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    // Usuarios simulados para login básico (como ejemplo, lo puedes cambiar o eliminar si no es necesario)
    if (usuario === "admin" && contrasena === "admin") {
        const usuarioActivo = {
            usuario: "admin",
            contrasena: "admin",
            rol: "administrador" // Asignar el rol de administrador
        };
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
        alert("Inicio de sesión exitoso como admin.");
        window.location.href = "admin.html"; // Redirige al panel de administrador
        return;
    }

    // Buscar el usuario en localStorage para otros casos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario && u.contrasena === contrasena
    );

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        alert("Inicio de sesión exitoso.");

        // Verificar el rol del usuario y redirigir según corresponda
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "admin.html";  // Redirigir al panel de administrador
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; // Redirigir al panel de profesor
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "alumno.html"; // Redirigir al panel del estudiante
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
        window.location.href = "login.html";  // Redirigir a la página de login si no está logueado
        return;
    }

    // Verificar si el rol del usuario activo es uno de los roles permitidos
    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tiene permisos suficientes.");
        window.location.href = "index.html"; // Redirigir si no tiene permisos
        return;
    }
}

// Ajuste de la visibilidad de los paneles dependiendo del rol
function ajustarNavegacion() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
        // Mostrar el panel correspondiente según el rol
        if (usuarioActivo.rol === "administrador") {
            document.querySelector('a[href="admin.html"]').style.display = 'inline';  // Mostrar Panel Administrador
            document.querySelector('a[href="profe.html"]').style.display = 'none';  // Ocultar Panel Profesor
        } else if (usuarioActivo.rol === "profesor") {
            document.querySelector('a[href="profe.html"]').style.display = 'inline';  // Mostrar Panel Profesor
            document.querySelector('a[href="admin.html"]').style.display = 'none';  // Ocultar Panel Administrador
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

document.addEventListener("DOMContentLoaded", function () {
    cargarPreguntas(); // Cargar las preguntas al cargar la página
});

// Función para cargar las preguntas en la tabla
function cargarPreguntas() {
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];  // Obtener las preguntas guardadas en localStorage
    const tablaPreguntas = document.getElementById('tablaPreguntas').getElementsByTagName('tbody')[0];  // Obtener el cuerpo de la tabla
    tablaPreguntas.innerHTML = '';  // Limpiar la tabla antes de insertar nuevas filas

    preguntas.forEach((pregunta, index) => {
        const fila = tablaPreguntas.insertRow();  // Crear una nueva fila en la tabla

        // Crear la celda para la pregunta
        const celdaPregunta = fila.insertCell();
        celdaPregunta.textContent = pregunta.pregunta;

        // Crear la celda para las opciones
        const celdaOpciones = fila.insertCell();
        celdaOpciones.innerHTML = pregunta.opciones.map(op => op.text).join('<br>');  // Mostrar las opciones con saltos de línea

        // Crear la celda para la respuesta correcta
        const celdaRespuestaCorrecta = fila.insertCell();
        const indiceRespuestaCorrecta = pregunta.respuestaCorrecta;  // Obtener el índice de la respuesta correcta

        // Verificar si el índice de la respuesta correcta es válido
        if (indiceRespuestaCorrecta >= 0 && indiceRespuestaCorrecta < pregunta.opciones.length) {
            const respuestaCorrecta = pregunta.opciones[indiceRespuestaCorrecta];  // Obtener la respuesta correcta
            celdaRespuestaCorrecta.textContent = respuestaCorrecta.text;  // Mostrar la respuesta correcta
        } else {
            celdaRespuestaCorrecta.textContent = 'No definida';  // Mostrar 'No definida' si no hay respuesta correcta
        }

        // Crear la celda para la categoría
        const celdaCategoria = fila.insertCell();
        celdaCategoria.textContent = pregunta.categoria;  // Mostrar la categoría de la pregunta

        // Crear la celda para el checkbox de selección de pregunta
        const celdaSeleccionar = fila.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('seleccionarPregunta');
        checkbox.setAttribute('data-index', index);  // Establecer el índice como atributo
        celdaSeleccionar.appendChild(checkbox);  // Añadir el checkbox a la celda
    });
}

// Función para manejar la selección de preguntas
document.getElementById('formularioCrearExamen').addEventListener('submit', function (event) {
    event.preventDefault();

    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];  // Obtener las preguntas guardadas
    const preguntasSeleccionadas = [];

    // Recorrer todos los checkboxes de las preguntas
    const checkboxes = document.querySelectorAll('.seleccionarPregunta:checked');
    checkboxes.forEach((checkbox) => {
        const index = checkbox.getAttribute('data-index');  // Obtener el índice de la pregunta seleccionada
        preguntasSeleccionadas.push(preguntas[index]);
    });

    // Guardar el examen con las preguntas seleccionadas
    const examen = {
        preguntas: preguntasSeleccionadas,
        fechaCreacion: new Date().toISOString() // Fecha de creación del examen
    };

    // Guardar el examen en localStorage o enviarlo a un servidor
    localStorage.setItem('examenCreado', JSON.stringify(examen));

    alert("Examen creado con éxito.");
});
