//Buscamos al usuario dentro de usuarios con el find, estoy enamorado del find
function iniciarSesion(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    // Buscar el usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario && u.contrasena === contrasena
    );
}
    //verificamos la carga correcta de los examenes que ya haya creados o no
function cargarExamenes() {
    const examenes = JSON.parse(localStorage.getItem('examenCreado')) || [];
    const examenesContainer = document.getElementById('examenesContainer');

    // Verificar si hay exámenes
    if (examenes.length === 0) {
        examenesContainer.innerHTML = "<p>No hay exámenes disponibles.</p>";
        return;
    }

    examenes.forEach((examen, index) => {
        if (!examen.id) {
            examen.id = `examen_${index}`; 
            // Actualizar el examen con el id único en el localStorage
            localStorage.setItem('examenCreado', JSON.stringify(examenes));
        }

        const divExamen = document.createElement('div');
        divExamen.classList.add('examen');
        divExamen.innerHTML = `
            <p>Examen: ${examen.id}</p>
            <button class="boton" onclick="iniciarExamen(${index})">Iniciar Examen</button>
        `;
        examenesContainer.appendChild(divExamen);
    });
}
//Esta función es para mostrar lo que cada rol permita ver
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el usuario activo del localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Verificar si el usuario está logueado
    if (usuarioActivo) {
        // Mostrar el panel correspondiente según el rol
        if (usuarioActivo.rol === "administrador") { //el admin ve todo
            document.querySelector('a[href="admin.html"]').style.display = 'inline';  
            document.querySelector('a[href="profe.html"]').style.display = 'inline'; 
        } else if (usuarioActivo.rol === "profesor") { //El profe solo ve lo del profe
            document.querySelector('a[href="profe.html"]').style.display = 'inline'; 
            document.querySelector('a[href="admin.html"]').style.display = 'none'; 
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
    const examenes = JSON.parse(localStorage.getItem('examenCreado')) || [];
    const examenSeleccionado = examenes[index];

    localStorage.setItem('examenActual', JSON.stringify(examenSeleccionado));

    window.location.href = 'examenRealizar.html'; }
window.onload = cargarExamenes;

