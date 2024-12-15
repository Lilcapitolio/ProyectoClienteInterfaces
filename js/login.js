function iniciarSesion(event) {
    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores de entrada
    const usuarioInput = document.querySelector('input[name="usuario"]').value;
    const passwordInput = document.querySelector('input[name="password"]').value;
    const mensajeDivError = document.getElementById("mensajeError");
    const mensajeDivCorrecto = document.getElementById("mensajeCorrecto");

    // Limpiar mensajes de error y éxito anteriores
    mensajeDivError.innerHTML = '';
    mensajeDivCorrecto.innerHTML = '';

    // Verificar si el usuario es "admin" con credenciales específicas
    if (usuarioInput === "admin" && passwordInput === "admin") {
        mensajeDivCorrecto.innerHTML = "Inicio de sesión exitoso. Bienvenido, Admin!";
        localStorage.setItem("usuarioActivo", JSON.stringify({
            usuario: "admin",
            contrasena: "admin",
            rol: "administrador"
        }));
        window.location.href = "admin.html";  // Redirigir al panel de administración
        return;
    }

    // Obtener la lista de usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si hay usuarios en el localStorage
    if (usuarios.length === 0) {
        mensajeDivError.innerHTML = "No hay usuarios registrados.";
        return;
    }

    // Buscar el usuario en la lista
    const usuarioEncontrado = usuarios.find(
        usuario => usuario.usuario === usuarioInput && usuario.contrasena === passwordInput
    );

    // Verificar si el usuario fue encontrado
    if (usuarioEncontrado) {
        // Si el usuario no está verificado, mostramos un mensaje de error
        if (!usuarioEncontrado.verificado) {
            mensajeDivError.innerHTML = "Tu cuenta aún no está verificada. Por favor, contacta con un administrador.";
            return;
        }

        // Si el usuario está verificado, se realiza el inicio de sesión
        mensajeDivCorrecto.innerHTML = "Inicio de sesión exitoso. Bienvenido, " + usuarioEncontrado.nombre + "!";

        // Guardar el usuario activo en localStorage
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

        // Verificar el rol del usuario y redirigir según corresponda
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "admin.html"; 
        } else if (usuarioEncontrado.rol === "profesor") {
            window.location.href = "profe.html"; 
        } else if (usuarioEncontrado.rol === "alumno") {
            window.location.href = "home.html"; 
        } else {
            window.location.href = "home.html"; 
        }
    } else {
        // Si no se encuentra el usuario o la contraseña no es correcta
        mensajeDivError.innerHTML = "Usuario o contraseña incorrectos.";
    }
}
