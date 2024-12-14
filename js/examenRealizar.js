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
            document.querySelector('a[href="profe.html"]').style.display = 'inline';  // Ocultar Panel Profesor
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
    const rolesPermitidos = ["administrador", "profesor","alumno"]; // Cambia según la página

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});


// Función para cargar el examen actual desde localStorage
function cargarExamen() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));

    if (!examenActual) {
        document.getElementById('preguntasContainer').innerHTML = "<p>No hay examen disponible.</p>";
        return; 
    }

    document.getElementById('nombreExamen').innerText = examenActual.nombre;

    const preguntasContainer = document.getElementById('preguntasContainer');

    examenActual.preguntas.forEach((pregunta, index) => {
        const divPregunta = document.createElement('div');
        divPregunta.classList.add('pregunta');
        divPregunta.innerHTML = `
            <p>${index + 1}. ${pregunta.pregunta}</p>
            ${pregunta.opciones.map((opcion, i) => `
                <label>
                    <input type="radio" name="pregunta${index}" value="${i}" required>
                    ${opcion.text}
                </label>
            `).join('')}
        `;
        preguntasContainer.appendChild(divPregunta);
    });
}
function calcularPuntaje() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));
    if (!examenActual || !Array.isArray(examenActual.preguntas)) {
        console.error("El examen actual no está definido o no contiene preguntas.");
        return 0;
    }

    let puntaje = 0;
//Me he visto negro para arreglar esto, pero lo que pasaba todo el rato es que estaba comparando un string con un número
// y no sabía por qué no me salía nada, pero al final me di cuenta, gracias a dios
    examenActual.preguntas.forEach((pregunta, index) => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta${index}"]:checked`);
        if (respuestaSeleccionada) {
            const opcionSeleccionada = `opcion${parseInt(respuestaSeleccionada.value, 10) + 1}`; 
            console.log(`Pregunta ${index + 1}: Respuesta seleccionada: ${opcionSeleccionada}, Respuesta correcta: ${pregunta.respuestaCorrecta}`);
            if (opcionSeleccionada === pregunta.respuestaCorrecta) {
                puntaje++;
            }
        } else {
            console.log(`Pregunta ${index + 1}: No se seleccionó ninguna respuesta.`);
        }
    });
    console.log(`Puntaje total: ${puntaje}`);
    return puntaje;
}


// Función para manejar el envío del examen
document.getElementById('formularioExamen').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const puntaje = calcularPuntaje();
    const totalPreguntas = JSON.parse(localStorage.getItem('examenActual')).preguntas.length;

    const intentos = JSON.parse(localStorage.getItem('intentos')) || [];
    const examenNombre = JSON.parse(localStorage.getItem('examenActual')).nombre;
    intentos.push({ examen: examenNombre, puntaje: puntaje, total: totalPreguntas });
    localStorage.setItem('intentos', JSON.stringify(intentos));

    alert(`Has completado el examen. Tu puntaje es: ${puntaje} de ${totalPreguntas}`);
    window.location.href = 'notas.html';
});

document.addEventListener('DOMContentLoaded', cargarExamen);
