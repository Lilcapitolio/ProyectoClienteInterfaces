function iniciarSesion(event) {
    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores de entrada
    const usuarioInput = document.querySelector('input[name="usuario"]').value;
    const passwordInput = document.querySelector('input[name="password"]').value;
    const mensajeDivError = document.getElementById("mensajeError");
    const mensajeDivCorrecto = document.getElementById("mensajeCorrecto");

    // Verificar si el usuario es "admin" con credenciales específicas
    if (usuarioInput === "admin" && passwordInput === "admin") {

        mensajeDivCorrecto.innerHTML = "Inicio de sesión exitoso. Bienvenido, Admin!";
        window.location.href = "home.html";  
        return;
    }
    // Obtener la lista de usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar el usuario en la lista
    const usuarioEncontrado = usuarios.find(
        usuario => usuario.usuario === usuarioInput && usuario.contrasena === passwordInput
    );

    // Verificar si el usuario fue encontrado
    if (usuarioEncontrado) {
        mensajeDivCorrecto.innerHTML = "Inicio de sesión exitoso. Bienvenido, " + usuarioEncontrado.nombre + "!";
        window.location.href = "home.html"; 
    } else {
        mensajeDivError.innerHTML = "Usuario o contraseña incorrectos.";
    }
}
