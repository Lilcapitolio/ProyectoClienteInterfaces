// Función para mostrar la tabla de usuarios
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const tablaDiv = document.getElementById("tablaUsuarios");
    tablaDiv.innerHTML = "";
    if (usuarios.length === 0) {
        tablaDiv.innerHTML = "<p>No hay usuarios registrados.</p>";
        return;
    }
    // Crear la tabla
    let tabla = '<table border="1" style="width: 100%; border-collapse: collapse;">';
    tabla += '<thead><tr><th>ID</th><th>Nombre</th><th>DNI</th><th>Usuario</th><th>Contraseña</th><th>Dirección</th><th>Email</th><th>Verificado</th></tr></thead>';
    tabla += '<tbody>';
    let index;
    usuarios.forEach((usuario, index) => {
        // Crear el checkbox, si el usuario está verificado, se marca el checkbox
        //Creamos el checkbox aqui porque es mejor, que establecer directamente que es false, creo que es mas seguro
        const verificado = usuario.verificado ? 'checked' : '';

        tabla += `<tr>
                    <td>${index + 1}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.dni}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.contrasena}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.email}</td>
                    <td><input type="checkbox" class="verificado" data-index="${index}" ${verificado}></td>
                  </tr>`;
    });
    tabla += '</tbody>';
    tabla += '</table>';
    // Insertar la tabla en el div
    tablaDiv.innerHTML = tabla;

    // Añadir un evento para manejar el cambio de estado de los checkboxes
    const checkboxes = document.querySelectorAll('.verificado');
    checkboxes.forEach(checkbox => {
        //El funcionamiento con change lo he sacado de un post de stackoverflow que me ha solucionado mucho la vida la verdad
        checkbox.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            // Cambiar el estado de verificación del usuario
            usuarios[index].verificado = this.checked;
            // Guardar de nuevo en el localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        });
    });
}

// Mostrar los usuarios cuando se carga la página
window.onload = mostrarUsuarios;
