document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("animate");
                    void entry.target.offsetWidth; // reflow
                    entry.target.classList.add("animate");
                } else {
                    entry.target.classList.remove("animate");
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    function iniciarObservers() {
        const todos = document.querySelectorAll(".decor");
        todos.forEach((el) => observer.observe(el));
    }

    // Inicia observers cuando termina la pantalla de entrada
    document.addEventListener("entradaFinalizada", iniciarObservers);

    // Fallback: si no hay pantalla de entrada o ya está oculta
    const pantallaEntrada = document.getElementById("pantalla-entrada");
    if (!pantallaEntrada || pantallaEntrada.classList.contains("oculta")) {
        iniciarObservers();
    }
});
