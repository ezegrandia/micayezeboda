document.addEventListener("DOMContentLoaded", () => {
    const btnIngresar = document.getElementById("btn-ingresar");
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    const audio = document.getElementById("musica-fondo");

    btnIngresar.addEventListener("click", () => {
        // Reproducir música
        audio.play().catch((err) => {
            console.warn("Error al reproducir música:", err);
        });

        // Habilitar scroll
        document.body.classList.remove("bloqueo-scroll");

        // Ocultar pantalla con animación
        pantallaEntrada.classList.add("oculta");
        setTimeout(() => {
            pantallaEntrada.style.display = "none";
        }, 800);
    });
});
