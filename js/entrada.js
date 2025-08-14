document.addEventListener("DOMContentLoaded", () => {
    const btnIngresar = document.getElementById("btn-ingresar");
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    const audio = document.getElementById("musica-fondo");

    function reiniciarDecoradores() {
        document.querySelectorAll(".decor").forEach((decor) => {
            decor.classList.remove("animate");
            void decor.offsetWidth; // fuerza reflow
            decor.classList.add("animate");
        });
    }

    btnIngresar.addEventListener("click", () => {
        // Reproducir música
        audio.play().catch((err) => {
            console.warn("Error al reproducir música:", err);
        });

        // Habilitar scroll
        document.body.classList.remove("bloqueo-scroll");

        // Ocultar pantalla con animación
        pantallaEntrada.classList.add("oculta");

        // Iniciar animaciones de decoradores antes de que termine la transición
        setTimeout(() => {
            reiniciarDecoradores();
        }, 100); // empieza casi al instante, ajusta a gusto

        // Terminar de ocultar la pantalla
        setTimeout(() => {
            pantallaEntrada.style.display = "none";
        }, 800); // mismo tiempo que tu animación CSS de .oculta
    });

    // Si la pantalla ya está oculta al cargar
    if (!pantallaEntrada || pantallaEntrada.classList.contains("oculta")) {
        reiniciarDecoradores();
    }
});
