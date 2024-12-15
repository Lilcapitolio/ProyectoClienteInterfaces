// Función para iniciar sesión
function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
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
            document.querySelector('a[href="profe.html"]').style.display = 'inline';  
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

// Llamada a la función para ajustar la visibilidad de los enlaces
document.addEventListener("DOMContentLoaded", () => {
    ajustarNavegacion();

    // Lista de roles permitidos para esta página (puedes cambiar según la página)
    const rolesPermitidos = ["administrador", "profesor"]; 

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});
