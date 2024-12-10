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
        const rol = usuario.rol || 'alumno'; // Asignar un rol por defecto si no existe

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

    // Añadir un evento para manejar el cambio de estado de los checkboxes
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

    // Añadir un evento para manejar el cambio de rol
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