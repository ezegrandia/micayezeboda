document.addEventListener("DOMContentLoaded", () => {
    const btnIngresar = document.getElementById("btn-ingresar");
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    const audio = document.getElementById("musica-fondo");

    btnIngresar.addEventListener("click", () => {
        // Reproducir música
        audio
            .play()
            .then(() => {
                console.log("Música iniciada");
            })
            .catch((err) => {
                console.warn("Error al reproducir música:", err);
            });

        // Ocultar pantalla con animación
        pantallaEntrada.classList.add("oculta");
        setTimeout(() => {
            pantallaEntrada.style.display = "none";
        }, 800);
    });
});
