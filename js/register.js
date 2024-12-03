    console.log("Funciona");

    // Añadir el evento click al botón
    const botonIngresar = document.getElementById("ingresar");
    if (botonIngresar) {
        botonIngresar.addEventListener("click", crearUsuario);
        }

    function crearUsuario() {
        // Obtener los valores de entrada
        let nombre = document.getElementById("nombre").value;
        let dni = document.getElementById("dni").value;
        let contrasena = document.getElementById("contrasena").value;
        let email = document.getElementById("email").value;
        let direccion = document.getElementById("direccion").value;

        if (!nombre || !dni || !contrasena || !email || !direccion) {
            console.log("Todos los campos deben ser completados");
            return;
        }
        // Crear el objeto usuario
        const usuario = {
            nombre: nombre,
            dni: dni,
            contrasena: contrasena,
            email: email,
            direccion: direccion
        };
        // Guardar en localStorage
        localStorage.setItem("usuario", JSON.stringify(usuario));

        console.log("Usuario guardado en localStorage:", usuario);
    }

