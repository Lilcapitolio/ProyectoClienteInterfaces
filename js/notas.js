// Función para iniciar sesión
function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    // Usuarios simulados para login básico
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

        // Redirigir según el rol
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "admin.html";  // Redirige al panel de administrador
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; // Redirige al panel de profesor
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "alumno.html"; // Redirige al panel del estudiante
        }
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Función de verificación de acceso
function verificarAccesoPagina(rolesPermitidos) {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        alert("Debe iniciar sesión para acceder a esta página.");
        window.location.href = "login.html";  // Redirige a la página de login si no está logueado
        return;
    }

    // Verificar si el rol del usuario activo es uno de los roles permitidos
    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tiene permisos suficientes.");
        window.location.href = "index.html"; // Redirige si no tiene permisos
        return;
    }
}

// Función para ajustar la visibilidad de los paneles según el rol
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
    const rolesPermitidos = ["administrador", "profesor", "alumno"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});

// Cargar los intentos desde localStorage y mostrarlos
function cargarIntentos() {
    const intentos = JSON.parse(localStorage.getItem('intentos')) || [];
    const intentosContainer = document.getElementById('intentosContainer');
    intentosContainer.innerHTML = ''; 

    if (intentos.length === 0) {
        intentosContainer.innerHTML = '<p>No hay intentos registrados.</p>';
        return;
    }

    intentos.forEach((intento, index) => {
        const divIntento = document.createElement('div');
        divIntento.classList.add('intento'); 
        divIntento.innerHTML = `
            <p>Intento ${index + 1}: ${intento.examen} - Puntaje: ${intento.puntaje} de ${intento.total}</p>
        `;
        intentosContainer.appendChild(divIntento);
    });
}

// Llamada a la función para cargar los intentos
document.addEventListener('DOMContentLoaded', cargarIntentos);
