

// Cargar exámenes desde localStorage
function cargarExamenes() {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || [];
    const examenesContainer = document.getElementById('examenesContainer');

    // Verificar si hay exámenes
    if (examenes.length === 0) {
        examenesContainer.innerHTML = "<p>No hay exámenes disponibles.</p>";
        return;
    }

    examenes.forEach((examen, index) => {
        const divExamen = document.createElement('div');
        divExamen.classList.add('examen');
        divExamen.innerHTML = `
            <p>Examen ${index + 1}</p>
            <button class="boton" onclick="iniciarExamen(${index})">Iniciar Examen</button>
        `;
        examenesContainer.appendChild(divExamen);
    });
}

// Función para iniciar el examen
function iniciarExamen(index) {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || [];
    const examenSeleccionado = examenes[index];

    localStorage.setItem('examenActual', JSON.stringify(examenSeleccionado));

    window.location.href = 'examenRealizar.html'; }
window.onload = cargarExamenes;