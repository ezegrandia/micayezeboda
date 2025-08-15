document.addEventListener("DOMContentLoaded", () => {
    const btnIngresar = document.getElementById("btn-ingresar");
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    const audio = document.getElementById("musica-fondo");

    // Animar SOLO los decor del MAIN al cerrar la pantalla de entrada
    function animarDecorMain() {
        const decorMain = document.querySelectorAll(".section-main .decor");
        decorMain.forEach((decor) => {
            decor.classList.remove("animate");
            // forzar reflow para reiniciar la animación
            // eslint-disable-next-line no-unused-expressions
            decor.offsetWidth;
            decor.classList.add("animate");
        });
    }

    // Cerrar pantalla de entrada
    function cerrarPantallaEntrada() {
        if (!pantallaEntrada) return;

        // Reproducir música (si el navegador lo permite por la interacción)
        if (audio) {
            audio.play().catch((err) => {
                console.warn("Error al reproducir música:", err);
            });
        }

        // Habilitar scroll
        document.body.classList.remove("bloqueo-scroll");

        // Ocultar pantalla con animación (usa tu clase existente)
        pantallaEntrada.classList.add("oculta");

        // Arrancá animaciones del MAIN casi al instante
        setTimeout(() => {
            animarDecorMain();
        }, 100);

        // Terminar de ocultar la pantalla y disparar evento global
        setTimeout(() => {
            pantallaEntrada.style.display = "none";
            // Avisar al resto que la entrada terminó → los observers pueden iniciar
            document.dispatchEvent(new Event("entradaFinalizada"));
        }, 800); // mismo tiempo que tu transición CSS de .oculta
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", cerrarPantallaEntrada);
    }

    // Caso: si la pantalla ya está oculta al cargar (reloads, debug, etc.)
    if (!pantallaEntrada || pantallaEntrada.classList.contains("oculta")) {
        // Asegurá animación del MAIN y que los observers puedan iniciar
        setTimeout(() => {
            animarDecorMain();
            document.dispatchEvent(new Event("entradaFinalizada"));
        }, 0);
    }
});
