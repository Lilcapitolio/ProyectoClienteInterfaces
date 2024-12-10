// Función para cargar los intentos desde localStorage y mostrarlos en la página
function cargarIntentos() {
    // Obtener los intentos del localStorage
    const intentos = JSON.parse(localStorage.getItem('intentos')) || [];
    const intentosContainer = document.getElementById('intentosContainer');
    intentosContainer.innerHTML = ''; 

    if (intentos.length === 0) {
        intentosContainer.innerHTML = '<p>No hay intentos registrados.</p>';
        return;
    }

    intentos.forEach((intento, index) => {
        const divIntento = document.createElement('div');
        divIntento.classList.add('intento'); 
        divIntento.innerHTML = `
            <p>Intento ${index + 1}: ${intento.examen} - Puntaje: ${intento.puntaje} de ${intento.total}</p>
        `;
        intentosContainer.appendChild(divIntento);
    });
}

document.addEventListener('DOMContentLoaded', cargarIntentos);