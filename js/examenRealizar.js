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
    const rolesPermitidos = ["administrador", "profesor","alumno"]; 

    // Verificar acceso
    verificarAccesoPagina(rolesPermitidos);
});


// Función para cargar el examen actual desde localStorage
function cargarExamen() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));
//verificar si no hay examenes
    if (!examenActual) {
        document.getElementById('preguntasContainer').innerHTML = "<p>No hay examen disponible.</p>";
        return; 
    }
//mostrar cada examen con su id para diferenciarlos entre si
    document.getElementById('nombreExamen').innerText = "Examen: "+examenActual.id;

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
//Verificar que se puntua bien el examen
function calcularPuntaje() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));
    if (!examenActual || !Array.isArray(examenActual.preguntas)) {
        console.error("El examen actual no está definido o no contiene preguntas.");
        return 0;
    }

    let puntaje = 0;

    examenActual.preguntas.forEach((pregunta, index) => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta${index}"]:checked`);
        
        if (respuestaSeleccionada) {
            // Convertir el valor de la respuesta seleccionada a número
            const respuestaSeleccionadaValor = parseInt(respuestaSeleccionada.value, 10);

            console.log(`Pregunta ${index + 1}: Respuesta seleccionada: ${respuestaSeleccionadaValor}, Respuesta correcta: ${pregunta.respuestaCorrecta}`);

            // Compara el índice de la respuesta seleccionada con el índice de la respuesta correcta
            if (respuestaSeleccionadaValor === pregunta.respuestaCorrecta) {
                puntaje++;
            }
        } else {
            console.log(`Pregunta ${index + 1}: No se seleccionó ninguna respuesta.`);
        }
    });

    console.log(`Puntaje total: ${puntaje}`);
    return puntaje;
}
document.getElementById('formularioExamen').addEventListener('submit', function (event) {
    event.preventDefault();     
        // Obtener el objeto de usuarioActivo del localStorage
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));  
        if (!usuarioActivo || !usuarioActivo.usuario) {
            alert('No se ha encontrado el usuario activo.');
            return;
        }
    
        const usuarioNombre = usuarioActivo.usuario;  // Usamos el campo 'usuario' como ID y asi no se repiten
        const puntaje = calcularPuntaje();
        const totalPreguntas = JSON.parse(localStorage.getItem('examenActual')).preguntas.length;
    
        const examen = JSON.parse(localStorage.getItem('examenActual'));
        const examenId = examen.id;  
    
        // Obtener los intentos del usuario específico
        const intentosUsuario = JSON.parse(localStorage.getItem(`intentos_${usuarioNombre}`)) || [];
    
        // Agregar el nuevo intento
        intentosUsuario.push({ examenId: examenId, examenNombre: examen.nombre, puntaje: puntaje, total: totalPreguntas });
    
        // Guardar los intentos del usuario de vuelta en localStorage
        localStorage.setItem(`intentos_${usuarioNombre}`, JSON.stringify(intentosUsuario));
    
        alert(`Has completado el examen. Tu puntaje es: ${puntaje} de ${totalPreguntas}`);
        window.location.href = 'notas.html';
        localStorage.removeItem('examenActual');
    });
    


document.addEventListener('DOMContentLoaded', cargarExamen);
