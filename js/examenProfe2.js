   // Cargar preguntas desde localStorage
   function cargarPreguntas() {
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    const tablaPreguntas = document.getElementById('tablaPreguntas').getElementsByTagName('tbody')[0];
    tablaPreguntas.innerHTML = '';

    // Mostrar las preguntas
    preguntas.forEach((pregunta, index) => {
        const fila = tablaPreguntas.insertRow();

        //  Pregunta
        const celdaPregunta = fila.insertCell();
        celdaPregunta.textContent = pregunta.pregunta;

        //  Opciones
        const celdaOpciones = fila.insertCell();
        celdaOpciones.innerHTML = pregunta.opciones.map(op => op.text).join('<br>');

        // Respuesta Correcta
        const celdaRespuestaCorrecta = fila.insertCell();
        celdaRespuestaCorrecta.textContent = pregunta.opciones.find(op => op.id === pregunta.respuestaCorrecta).text;

        // Checkbox para seleccionar pregunta
        const celdaSeleccionar = fila.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('seleccionarPregunta');
        checkbox.setAttribute('data-index', index);
        celdaSeleccionar.appendChild(checkbox);
    });
}
document.getElementById('formularioCrearExamen').addEventListener('submit', function (event) {
    event.preventDefault();

    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    const preguntasSeleccionadas = Array.from(
        document.querySelectorAll('.seleccionarPregunta:checked')
    ).map(checkbox => {
        const index = checkbox.getAttribute('data-index');
        return preguntas[index];
    });

    if (preguntasSeleccionadas.length === 0) {
        alert("Debe seleccionar al menos una pregunta para el examen.");
        return;
    }

    const examenes = JSON.parse(localStorage.getItem('examenes')) || [];
    const numeroExamen = examenes.length + 1;
    const nombreExamen = `Examen ${numeroExamen}`; 
    const nuevoExamen = {
        nombre: nombreExamen,
        preguntas: preguntasSeleccionadas
    };

    examenes.push(nuevoExamen);
    localStorage.setItem('examenes', JSON.stringify(examenes));

    mostrarMensajeExamenCreado();
});

function mostrarMensajeExamenCreado() {
    const mensajeExamenCreado = document.getElementById('mensajeExamenCreado');
    mensajeExamenCreado.style.display = 'block'; 

    setTimeout(() => {
        mensajeExamenCreado.style.display = 'none';
    }, 3000);
}


cargarPreguntas();