document.getElementById('formularioExamen').addEventListener('submit', function (event) {
    event.preventDefault();

    const preguntaInput = document.getElementById('pregunta');
    const opcionesInputs = document.querySelectorAll('.respuesta');
    const respuestaCorrectaInput = document.querySelector('input[name="respuestaCorrecta"]:checked');

    if (!respuestaCorrectaInput) {
        alert("Debes seleccionar una respuesta correcta.");
        return;
    }

    // La respuesta correcta será el índice de la opción seleccionada
    const respuestaCorrectaIndex = Array.from(opcionesInputs).indexOf(respuestaCorrectaInput);

    const nuevaPregunta = {
        pregunta: preguntaInput.value,
        opciones: Array.from(opcionesInputs).map((input, index) => ({
            text: input.value,
            id: `opcion${index + 1}`
        })),
        respuestaCorrecta: respuestaCorrectaIndex // Guardamos el índice de la respuesta correcta
    };

    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    preguntas.push(nuevaPregunta);
    localStorage.setItem('preguntas', JSON.stringify(preguntas));

    // Limpiar los campos
    preguntaInput.value = '';
    opcionesInputs.forEach(input => (input.value = ''));
    respuestaCorrectaInput.checked = false;

    mostrarMensajePreguntaCreado();
    cargarPreguntas();
});
