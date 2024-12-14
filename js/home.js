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
        window.location.href = "pagina-admin.html"; // Redirige al panel de administrador
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
            window.location.href = "admin";  // Redirigir al panel de administrador
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; // Redirigir al panel de profesor
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "home.html"; // Redirigir al panel del estudiante
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
        window.location.href = "pagina-no-autorizada.html"; // Redirigir si no tiene permisos
        return;
    }
}

// Ejemplo de uso en una página protegida
document.addEventListener("DOMContentLoaded", () => {
    // Lista de roles permitidos para esta página
    const rolesPermitidos = ["administrador", "profesor","alumno"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el usuario activo del localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Verificar si el usuario está logueado
    if (usuarioActivo) {
        // Mostrar el panel correspondiente según el rol
        if (usuarioActivo.rol === "administrador") {
            document.querySelector('a[href="admin.html"]').style.display = 'inline';  // Mostrar Panel Administrador
            document.querySelector('a[href="profe.html"]').style.display = 'none';  // Ocultar Panel Profesor
        } else if (usuarioActivo.rol === "profesor") {
            document.querySelector('a[href="profe.html"]').style.display = 'inline';  // Mostrar Panel Profesor
            document.querySelector('a[href="admin.html"]').style.display = 'none';  // Ocultar Panel Administrador
        } else {
            // Si es un alumno, puedes ocultar ambos paneles
            document.querySelector('a[href="profe.html"]').style.display = 'none';
            document.querySelector('a[href="admin.html"]').style.display = 'none';
        }
    } else {
        // Si no hay usuario activo, redirige a la página de login
        window.location.href = "login.html";
    }
});
