// Establecer la fecha objetivo (modificá esta línea con tu fecha y hora)
const fechaEvento = new Date("December 7, 2025 18:00:00").getTime();

// Seleccionamos todos los elementos donde mostraremos el tiempo
const elementosTiempo = document.querySelectorAll(".casillero-contador .tiempo-numero");

function actualizarContador() {
    const ahora = new Date().getTime();
    const diferencia = fechaEvento - ahora;

    let dias = 0,
        horas = 0,
        minutos = 0,
        segundos = 0;

    if (diferencia > 0) {
        dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    }

    // Mostrar los valores actualizados
    elementosTiempo[0].textContent = dias.toString().padStart(2, "0");
    elementosTiempo[1].textContent = horas.toString().padStart(2, "0");
    elementosTiempo[2].textContent = minutos.toString().padStart(2, "0");
    elementosTiempo[3].textContent = segundos.toString().padStart(2, "0");
}

// Actualizar el contador cada segundo
setInterval(actualizarContador, 1000);

// Ejecutar una vez al cargar la página
actualizarContador();
