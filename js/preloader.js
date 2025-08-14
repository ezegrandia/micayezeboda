window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    const tiempoMinimo = 2000; // milisegundos (1.5 segundos mínimo)
    const tiempoInicio = performance.now();

    function ocultarPreloader() {
        preloader.classList.add("oculto");
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }

    const tiempoTranscurrido = performance.now() - tiempoInicio;
    if (tiempoTranscurrido >= tiempoMinimo) {
        ocultarPreloader();
    } else {
        setTimeout(ocultarPreloader, tiempoMinimo - tiempoTranscurrido);
    }
});
