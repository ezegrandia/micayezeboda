document.addEventListener("DOMContentLoaded", function () {
    const carrusel = document.querySelector(".carrusel");
    const originales = Array.from(carrusel.children);

    // Clonar primero y último para loop infinito
    const firstClone = originales[0].cloneNode(true);
    const lastClone = originales[originales.length - 1].cloneNode(true);

    carrusel.insertBefore(lastClone, originales[0]);
    carrusel.appendChild(firstClone);

    const slides = Array.from(carrusel.children);
    let indiceActual = 1; // Comenzamos en el primer real
    let intervalo;
    const tiempo = 6000;

    // Crear indicadores
    const indicadoresContainer = document.querySelector(".carrusel-indicadores");
    originales.forEach((_, i) => {
        const btn = document.createElement("button");
        if (i === 0) btn.classList.add("activo");
        btn.addEventListener("click", () => irASlide(i + 1)); // +1 por el clon inicial
        indicadoresContainer.appendChild(btn);
    });
    const indicadores = indicadoresContainer.querySelectorAll("button");

    function centrarSlide(indice) {
        const slide = slides[indice];
        const carruselContainer = document.querySelector(".carrusel-container");

        // Posiciones absolutas
        const slideRect = slide.getBoundingClientRect();
        const containerRect = carruselContainer.getBoundingClientRect();

        // Centro de cada elemento
        const slideCenter = slideRect.left + slideRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;

        // Diferencia entre el centro del slide y el del contenedor
        const offset = slideCenter - containerCenter;

        // Ajustar transform con desplazamiento negativo
        const currentTransform = carrusel.style.transform.match(/-?\d+(\.\d+)?/g);
        carrusel.style.transform = `translateX(${(parseFloat(currentTransform?.[0]) || 0) - offset}px)`;
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
        let realIndex = indiceActual - 1; // Ajustar por el clon inicial
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

    // Evento para “loop infinito” suave
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

    // Iniciar con la primera imagen real centrada
    centrarSlide(indiceActual);
    iniciarAuto();

    window.addEventListener("resize", () => centrarSlide(indiceActual));
});
