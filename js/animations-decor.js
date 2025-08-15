document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Reiniciar animación cada vez que entra
                    entry.target.classList.remove("animate");
                    // Forzar reflow para reiniciar animación
                    void entry.target.offsetWidth;
                    entry.target.classList.add("animate");
                } else {
                    // Al salir, quitar clase para que pueda volver a animar
                    entry.target.classList.remove("animate");
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    function iniciarObservers() {
        // Observa todos los decor excepto los del MAIN (que se animan en entrada.js)
        const todos = document.querySelectorAll(".decor");
        const decorNoMain = Array.from(todos).filter((el) => !el.closest(".section-main"));

        decorNoMain.forEach((el) => observer.observe(el));
    }

    // Inicia observers cuando termina la pantalla de entrada
    document.addEventListener("entradaFinalizada", iniciarObservers);

    // Fallback: si no hay pantalla de entrada o ya está oculta
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    if (!pantallaEntrada || pantallaEntrada.classList.contains("oculta")) {
        iniciarObservers();
    }
});
