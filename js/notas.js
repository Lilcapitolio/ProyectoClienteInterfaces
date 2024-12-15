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

        // Redirigir según el rol
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "admin.html";  
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; 
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "alumno.html";
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

// Función para ajustar la visibilidad de los paneles según el rol
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
    const rolesPermitidos = ["administrador", "profesor", "alumno"]; 

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});
// Cargar los intentos del usuario desde localStorage y mostrarlos agrupados por examen
function cargarIntentos() {
    // Obtener el usuario activo desde localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));  
    if (!usuarioActivo || !usuarioActivo.usuario) {
        alert('No se ha encontrado el usuario activo.');
        return;
    }

    const usuarioNombre = usuarioActivo.usuario;  // Usamos el nombre de usuario como ID
    const intentos = JSON.parse(localStorage.getItem(`intentos_${usuarioNombre}`)) || [];  // Obtener los intentos del usuario actual
    const examenes = JSON.parse(localStorage.getItem('examenCreado')) || [];  // Obtener los exámenes
    const intentosContainer = document.getElementById('intentosContainer');
    intentosContainer.innerHTML = '';  // Limpiar el contenedor de intentos

    if (intentos.length === 0) {
        intentosContainer.innerHTML = '<p>No hay intentos registrados.</p>';
        return;
    }

    // Agrupar los intentos por id de examen
    const intentosAgrupados = {};

    intentos.forEach((intento) => {
        if (!intentosAgrupados[intento.examenId]) {
            intentosAgrupados[intento.examenId] = [];
        }
        intentosAgrupados[intento.examenId].push(intento);
    });

    // Recorrer los exámenes y mostrar los intentos
    examenes.forEach((examen) => {
        const divExamen = document.createElement('div');
        divExamen.classList.add('examen-intentos');
        
        // Mostrar el nombre del examen usando el examen.id
        divExamen.innerHTML = `<h3>Examen: ${examen.id}</h3>`;

        // Verificar si hay intentos para este examen
        if (intentosAgrupados[examen.id]) {
            const intentosExamen = intentosAgrupados[examen.id];

            intentosExamen.forEach((intento, intentoIndex) => {
                const divIntento = document.createElement('div');
                divIntento.classList.add('intento');
                
                // Mostrar detalles de cada intento
                divIntento.innerHTML = `
                    <p>Intento ${intentoIndex + 1}: ${intento.puntaje} de ${intento.total}</p>
                `;
                divExamen.appendChild(divIntento);
            });
        } else {
            divExamen.innerHTML += "<p>No hay intentos registrados para este examen.</p>";
        }

        // Añadir el bloque de intentos del examen al contenedor
        intentosContainer.appendChild(divExamen);
    });
}

// Llamada a la función para cargar los intentos
document.addEventListener('DOMContentLoaded', cargarIntentos);
