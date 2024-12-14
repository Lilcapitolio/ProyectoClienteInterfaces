function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    // Usuarios simulados para login básico
    if (usuario === "admin" && contrasena === "admin") {
        const usuarioActivo = {
            usuario: "admin",
            contrasena: "admin",
            rol: "administrador" // Puedes asignar un rol aquí si es necesario
        };
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
        alert("Inicio de sesión exitoso como admin.");
        window.location.href = "pagina-protegida.html"; // Cambia al enlace de tu página protegida
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
        window.location.href = "pagina-protegida.html"; // Cambia al enlace de tu página protegida
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Ejemplo de uso en una página
document.addEventListener("DOMContentLoaded", () => {
    // Lista de roles permitidos para esta página
    const rolesPermitidos = ["administrador", "profesor"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});


// Cargar exámenes desde localStorage
function cargarExamenes() {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || [];
    const examenesContainer = document.getElementById('examenesContainer');

    // Verificar si hay exámenes
    if (examenes.length === 0) {
        examenesContainer.innerHTML = "<p>No hay exámenes disponibles.</p>";
        return;
    }

    examenes.forEach((examen, index) => {
        const divExamen = document.createElement('div');
        divExamen.classList.add('examen');
        divExamen.innerHTML = `
            <p>Examen ${index + 1}</p>
            <button class="boton" onclick="iniciarExamen(${index})">Iniciar Examen</button>
        `;
        examenesContainer.appendChild(divExamen);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el usuario activo del localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Verificar si el usuario está logueado
    if (usuarioActivo) {
        // Mostrar el panel correspondiente según el rol
        if (usuarioActivo.rol === "administrador") {
            document.querySelector('a[href="admin.html"]').style.display = 'inline';  // Mostrar Panel Administrador
            document.querySelector('a[href="profe.html"]').style.display = 'inline';  // Ocultar Panel Profesor
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

// Función para iniciar el examen
function iniciarExamen(index) {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || [];
    const examenSeleccionado = examenes[index];

    localStorage.setItem('examenActual', JSON.stringify(examenSeleccionado));

    window.location.href = 'examenRealizar.html'; }
window.onload = cargarExamenes;

