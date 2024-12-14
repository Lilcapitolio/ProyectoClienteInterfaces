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

// Llamada a la función para ajustar la visibilidad de los enlaces
document.addEventListener("DOMContentLoaded", () => {
    ajustarNavegacion();

    // Lista de roles permitidos para esta página (puedes cambiar según la página)
    const rolesPermitidos = ["administrador", "profesor"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});


// Ejemplo de uso en una página
document.addEventListener("DOMContentLoaded", () => {
    // Lista de roles permitidos para esta página
    const rolesPermitidos = ["administrador", "profesor"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});
document.getElementById('formularioExamen').addEventListener('submit', function (event) {
    event.preventDefault();

    const preguntaInput = document.getElementById('pregunta');
    const opcionesInputs = document.querySelectorAll('.respuesta');
    const respuestaCorrectaInput = document.querySelector('input[name="respuestaCorrecta"]:checked');
    const categoriaSelect = document.getElementById('categoria');  // Obtener el select de categoría

    // Verificar si se seleccionó una respuesta correcta
    if (!respuestaCorrectaInput) {
        alert("Debes seleccionar una respuesta correcta.");
        return;
    }

    // Encontrar el índice de la respuesta correcta
    const respuestaCorrectaIndex = Array.from(opcionesInputs).findIndex(input => input === respuestaCorrectaInput);
    
    // Verificar si el índice es correcto
    console.log("Índice de la respuesta correcta:", respuestaCorrectaIndex);

    // Crear la nueva pregunta con opciones, índice de la respuesta correcta y categoría
    const nuevaPregunta = {
        pregunta: preguntaInput.value,
        opciones: Array.from(opcionesInputs).map((input, index) => ({
            text: input.value,
            id: `opcion${index + 1}`
        })),
        respuestaCorrecta: respuestaCorrectaIndex, // Guardamos el índice de la respuesta correcta
        categoria: categoriaSelect.value // Guardamos la categoría seleccionada
    };

    console.log("Pregunta creada:", nuevaPregunta); // Verificar la estructura de la nueva pregunta

    // Obtener las preguntas existentes desde localStorage
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    preguntas.push(nuevaPregunta);
    localStorage.setItem('preguntas', JSON.stringify(preguntas));

    // Limpiar los campos del formulario
    preguntaInput.value = '';
    opcionesInputs.forEach(input => (input.value = ''));
    respuestaCorrectaInput.checked = false;
    categoriaSelect.value = 'facil'; // Resetear la categoría a "fácil" después de enviar

    mostrarMensajePreguntaCreado();
    cargarPreguntas();
});

// Función para mostrar el mensaje de pregunta creada con éxito
function mostrarMensajePreguntaCreado() {
    const mensajePreguntaCreada = document.getElementById('mensajePreguntaCreada');
    mensajePreguntaCreada.style.display = 'block'; 

    setTimeout(() => {
        mensajePreguntaCreada.style.display = 'none';
    }, 3000);
}
