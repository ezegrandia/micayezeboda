document.addEventListener("DOMContentLoaded", function () {
    const carrusel = document.querySelector(".carrusel");
    const carruselContainer = document.querySelector(".carrusel-container");
    const originales = Array.from(carrusel.children);

    // Clonar primer y último
    const firstClone = originales[0].cloneNode(true);
    const lastClone = originales[originales.length - 1].cloneNode(true);
    carrusel.insertBefore(lastClone, originales[0]);
    carrusel.appendChild(firstClone);

    const slides = Array.from(carrusel.children);
    let indiceActual = 1;
    let intervalo;
    const tiempo = 6000;
    let offsets = [];

    // Calcular offsets para centrar cada slide
    function calcularOffsets() {
        offsets = slides.map((slide) => {
            const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
            const containerCenter = carruselContainer.offsetWidth / 2;
            return containerCenter - slideCenter;
        });
    }

    // Crear indicadores
    const indicadoresContainer = document.querySelector(".carrusel-indicadores");
    originales.forEach((_, i) => {
        const btn = document.createElement("button");
        if (i === 0) btn.classList.add("activo");
        btn.addEventListener("click", () => irASlide(i + 1));
        indicadoresContainer.appendChild(btn);
    });
    const indicadores = indicadoresContainer.querySelectorAll("button");

    function centrarSlide(indice) {
        carrusel.style.transform = `translateX(${offsets[indice]}px)`;
    }

    function irASlide(indice) {
        indiceActual = indice;
        carrusel.style.transition = "transform 0.5s ease-in-out";
        centrarSlide(indiceActual);
        actualizarIndicadores();
        reiniciarAuto();
    }

    function actualizarIndicadores() {
        indicadores.forEach((btn) => btn.classList.remove("activo"));
        let realIndex = indiceActual - 1;
        if (realIndex === -1) realIndex = originales.length - 1;
        if (realIndex === originales.length) realIndex = 0;
        indicadores[realIndex].classList.add("activo");
    }

    function siguienteSlide() {
        indiceActual++;
        carrusel.style.transition = "transform 0.5s ease-in-out";
        centrarSlide(indiceActual);
        actualizarIndicadores();
    }

    function iniciarAuto() {
        intervalo = setInterval(siguienteSlide, tiempo);
    }

    function reiniciarAuto() {
        clearInterval(intervalo);
        iniciarAuto();
    }

    // Loop infinito sin tirones
    carrusel.addEventListener("transitionend", () => {
        if (slides[indiceActual] === firstClone) {
            carrusel.style.transition = "none";
            indiceActual = 1;
            centrarSlide(indiceActual);
        }
        if (slides[indiceActual] === lastClone) {
            carrusel.style.transition = "none";
            indiceActual = originales.length;
            centrarSlide(indiceActual);
        }
    });

    // Inicializar
    calcularOffsets();
    centrarSlide(indiceActual);
    iniciarAuto();

    // Recalcular al redimensionar
    window.addEventListener("resize", () => {
        calcularOffsets();
        centrarSlide(indiceActual);
    });
});
