// Función para cargar el examen actual desde localStorage
function cargarExamen() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));

    if (!examenActual) {
        document.getElementById('preguntasContainer').innerHTML = "<p>No hay examen disponible.</p>";
        return; 
    }

    document.getElementById('nombreExamen').innerText = examenActual.nombre;

    const preguntasContainer = document.getElementById('preguntasContainer');

    examenActual.preguntas.forEach((pregunta, index) => {
        const divPregunta = document.createElement('div');
        divPregunta.classList.add('pregunta');
        divPregunta.innerHTML = `
            <p>${index + 1}. ${pregunta.pregunta}</p>
            ${pregunta.opciones.map((opcion, i) => `
                <label>
                    <input type="radio" name="pregunta${index}" value="${i}" required>
                    ${opcion.text}
                </label>
            `).join('')}
        `;
        preguntasContainer.appendChild(divPregunta);
    });
}
function calcularPuntaje() {
    const examenActual = JSON.parse(localStorage.getItem('examenActual'));
    if (!examenActual || !Array.isArray(examenActual.preguntas)) {
        console.error("El examen actual no está definido o no contiene preguntas.");
        return 0;
    }

    let puntaje = 0;
//Me he visto negro para arreglar esto, pero lo que pasaba todo el rato es que estaba comparando un string con un número
// y no sabía por qué no me salía nada, pero al final me di cuenta, gracias a dios
    examenActual.preguntas.forEach((pregunta, index) => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta${index}"]:checked`);
        if (respuestaSeleccionada) {
            const opcionSeleccionada = `opcion${parseInt(respuestaSeleccionada.value, 10) + 1}`; 
            console.log(`Pregunta ${index + 1}: Respuesta seleccionada: ${opcionSeleccionada}, Respuesta correcta: ${pregunta.respuestaCorrecta}`);
            if (opcionSeleccionada === pregunta.respuestaCorrecta) {
                puntaje++;
            }
        } else {
            console.log(`Pregunta ${index + 1}: No se seleccionó ninguna respuesta.`);
        }
    });
    console.log(`Puntaje total: ${puntaje}`);
    return puntaje;
}


// Función para manejar el envío del examen
document.getElementById('formularioExamen').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const puntaje = calcularPuntaje();
    const totalPreguntas = JSON.parse(localStorage.getItem('examenActual')).preguntas.length;

    const intentos = JSON.parse(localStorage.getItem('intentos')) || [];
    const examenNombre = JSON.parse(localStorage.getItem('examenActual')).nombre;
    intentos.push({ examen: examenNombre, puntaje: puntaje, total: totalPreguntas });
    localStorage.setItem('intentos', JSON.stringify(intentos));

    alert(`Has completado el examen. Tu puntaje es: ${puntaje} de ${totalPreguntas}`);
    window.location.href = 'notas.html';
});

document.addEventListener('DOMContentLoaded', cargarExamen);
