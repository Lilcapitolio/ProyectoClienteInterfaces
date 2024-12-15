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
document.addEventListener("DOMContentLoaded", () => {
    // Lista de roles permitidos para esta página
    const rolesPermitidos = ["administrador"]; // Cambia según la página, si añadimos los roles que pueden optar a esas paginas
    verificarAccesoPagina(rolesPermitidos);
});


// Función para mostrar la tabla de usuarios
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const tablaDiv = document.getElementById("tablaUsuarios");
    tablaDiv.innerHTML = "";
    if (usuarios.length === 0) {
        tablaDiv.innerHTML = "<p>No hay usuarios registrados.</p>";
        return;
    }
    let tabla = '<table border="1" style="width: 100%; border-collapse: collapse;">';
    tabla += '<thead><tr><th>ID</th><th>Nombre</th><th>DNI</th><th>Usuario</th><th>Contraseña</th><th>Dirección</th><th>Email</th><th>Verificado</th><th>Rol</th></tr></thead>';
    tabla += '<tbody>';
    usuarios.forEach((usuario, index) => {
        const verificado = usuario.verificado ? 'checked' : '';
        const rol = usuario.rol = 'alumno'; // Asignar un rol por defecto si no existe, el cual tiene un bug, y es que aún como esta programado, no auto asigna el rol de alumno, no se porque la verdad lo dejare para la 1.1

        tabla += `<tr>
                    <td>${index + 1}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.dni}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.contrasena}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.email}</td>
                    <td><input type="checkbox" class="verificado" data-index="${index}" ${verificado}></td>
                    <td>
                        <select class="rol" data-index="${index}">
                            <option value="alumno" ${rol === 'alumno' ? 'selected' : ''}>Alumno</option>
                            <option value="profesor" ${rol === 'profesor' ? 'selected' : ''}>Profesor</option>
                            <option value="administrador" ${rol === 'administrador' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </td>
                  </tr>`;
    });
    tabla += '</tbody>';
    tabla += '</table>';
    // Insertar la tabla en el div
    tablaDiv.innerHTML = tabla;

    // Añadir un evento para manejar el cambio de los checkboxes
    const checkboxes = document.querySelectorAll('.verificado');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            // Cambiar el estado de verificación del usuario
            usuarios[index].verificado = this.checked;
            // Guardar de nuevo en el localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        });
    });

    // Añadir un evento para el cambio de rol
    const selects = document.querySelectorAll('.rol');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            // Cambiar el rol del usuario
            usuarios[index].rol = this.value;
            // Guardar de nuevo en el localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        });
    });
}

// Mostrar los usuarios cuando se carga la página
window.onload = mostrarUsuarios;
