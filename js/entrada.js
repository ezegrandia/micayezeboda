document.addEventListener("DOMContentLoaded", () => {
    // Evitar que el navegador recuerde la posición de scroll al recargar
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    // Forzar que la página arranque siempre arriba
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const btnIngresar = document.getElementById("btn-ingresar");
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    const audio = document.getElementById("musica-fondo");

    // 🚫 Bloquear scroll desde el inicio
    document.body.classList.add("bloqueo-scroll");

    // Animar SOLO los decor del MAIN al cerrar la pantalla de entrada
    function animarDecorMain() {
        const decorMain = document.querySelectorAll(".section-main .decor");
        decorMain.forEach((decor) => {
            decor.classList.remove("animate");
            decor.offsetWidth; // forzar reflow
            decor.classList.add("animate");
        });
    }

    // Cerrar pantalla de entrada
    function cerrarPantallaEntrada() {
        if (!pantallaEntrada) return;

        // ✅ Habilitar scroll
        document.body.classList.remove("bloqueo-scroll");

        // Asegurarse de volver al tope
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Reproducir música
        if (audio) {
            audio.play().catch((err) => {
                console.warn("Error al reproducir música:", err);
            });
        }

        // Ocultar pantalla con animación
        pantallaEntrada.classList.add("oculta");

        setTimeout(() => {
            pantallaEntrada.style.display = "none";
            document.dispatchEvent(new Event("entradaFinalizada"));
        }, 400); // mismo tiempo que tu transición CSS de .oculta
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", cerrarPantallaEntrada);
    }

    // Caso: si la pantalla ya está oculta al cargar
    if (!pantallaEntrada || pantallaEntrada.classList.contains("oculta")) {
        setTimeout(() => {
            animarDecorMain();
            document.dispatchEvent(new Event("entradaFinalizada"));
        }, 0);
    }
});
