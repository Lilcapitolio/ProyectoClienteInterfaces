function crearUsuario(event) {
    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores de entrada
    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    const direccion = document.getElementById("direccion").value;
    const email = document.getElementById("email").value;
    const mensajeDivError = document.getElementById("mensajeError");
    const mensajeDivCorrecto = document.getElementById("mensajeCorrecto");

    // Validación de campos
    if (!nombre || !dni || !usuario || !contrasena || !direccion || !email) {
        mensajeDivError.innerHTML = "Todos los campos deben ser completados";
        return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensajeDivError.innerHTML = "Por favor, introduce un email válido";
        return;
    }

    // Crear el objeto usuario con rol vacío
    const usuarioData = {
        nombre: nombre,
        dni: dni,
        usuario: usuario,
        contrasena: contrasena,
        direccion: direccion,
        email: email,
        rol: "" // Inicializamos el rol vacío
    };

    // Obtener la lista de usuarios existente del localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Agregar el nuevo usuario a la lista
    usuarios.push(usuarioData);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Limpiar campos del formulario
    document.getElementById("registerForm").reset();
    mensajeDivCorrecto.innerHTML = "Usuario guardado exitosamente en localStorage";

    // Consola para verificar el almacenamiento
    console.log("Usuarios guardados en localStorage:", usuarios);
}
