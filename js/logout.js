// Función para cerrar sesión (log out)
function cerrarSesion() {
    // Eliminar 'usuarioActivo' del localStorage
    localStorage.removeItem("usuarioActivo");

    // Redirigir al usuario a la página de login
    window.location.href = "login.html";  // Redirigir a la página de login
}

// Asignar la función al botón de Log Out
document.getElementById("logoutButton").addEventListener("click", cerrarSesion);
