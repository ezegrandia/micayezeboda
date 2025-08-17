(function () {
    const modal = document.getElementById("galeriaModal");
    const imagenModal = document.getElementById("imagenModal");
    const cerrarBtn = modal.querySelector(".cerrar");
    const flechaIzq = modal.querySelector(".izquierda");
    const flechaDer = modal.querySelector(".derecha");
    const contadorModal = document.getElementById("contadorModal");

    let imagenes = [];
    let indiceActual = 0;
    let modalAbierto = false;

    // utility: abrir/cerrar con clase (evita depender del inline style)
    function abrirModal(listaImagenes, indice = 0) {
        if (!Array.isArray(listaImagenes) || listaImagenes.length === 0) return;
        imagenes = listaImagenes.slice();
        indiceActual = Math.max(0, Math.min(indice, imagenes.length - 1));
        // bloquear scroll y abrir
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        modalAbierto = true;
        window.history.pushState({ galeriaModalOpen: true }, "");
        precargarImagenes();
        mostrarImagen();
    }

    function cerrarModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        modalAbierto = false;
    }

    function mostrarImagen() {
        if (!imagenes || imagenes.length === 0) return;
        const src = imagenes[indiceActual];

        // efecto de carga: ocultamos mientras carga
        imagenModal.classList.add("is-loading");
        // crear imagen para precargar y esperar load
        const img = new Image();
        img.src = src;
        img.onload = function () {
            imagenModal.src = src;
            imagenModal.alt = `Imagen ${indiceActual + 1} de ${imagenes.length}`;
            contadorModal.textContent = `${indiceActual + 1} / ${imagenes.length}`;
            // tras pequeña espera para que el usuario vea fade, removemos clase loading
            requestAnimationFrame(() => {
                imagenModal.classList.remove("is-loading");
            });
        };
        img.onerror = function () {
            // en caso de error, mostramos algo neutro
            imagenModal.classList.remove("is-loading");
            imagenModal.alt = "Error cargando la imagen";
            contadorModal.textContent = `${indiceActual + 1} / ${imagenes.length}`;
        };
    }

    function navegarDerecha() {
        if (!imagenes.length) return;
        indiceActual = (indiceActual + 1) % imagenes.length;
        mostrarImagen();
    }

    function navegarIzquierda() {
        if (!imagenes.length) return;
        indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        mostrarImagen();
    }

    function precargarImagenes() {
        imagenes.forEach((src) => {
            const i = new Image();
            i.src = src;
        });
    }

    function handleBackButton() {
        if (modalAbierto) {
            cerrarModal();
            return true;
        }
        return false;
    }

    // eventos
    flechaDer?.addEventListener("click", (e) => {
        e.stopPropagation();
        navegarDerecha();
    });
    flechaIzq?.addEventListener("click", (e) => {
        e.stopPropagation();
        navegarIzquierda();
    });
    cerrarBtn?.addEventListener("click", cerrarModal);

    modal.addEventListener("click", (e) => {
        // click solo en overlay (fuera de .modal-contenido)
        if (e.target === modal) cerrarModal();
    });

    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") return cerrarModal();
        if (e.key === "ArrowRight") return navegarDerecha();
        if (e.key === "ArrowLeft") return navegarIzquierda();
    });

    // Manejar historial de navegación
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.galeriaModalOpen) {
            handleBackButton();
        } else if (modalAbierto) {
            handleBackButton();
        }
    });

    // Exponer funciones globales mínimas para abrir desde tu markup
    window.GaleriaModal = {
        abrir: abrirModal,
        cerrar: cerrarModal,
    };

    // Listeners iglesia
    document.querySelectorAll(".iglesia-icon, .iglesia-texto, .iglesia-btn").forEach((el) => {
        el.addEventListener("click", () => abrirModal(["assets/img/iglesia1.jpg", "assets/img/iglesia2.jpg"]));
    });

    // Listeners salón
    document.querySelectorAll(".salon-icon, .salon-texto, .salon-btn").forEach((el) => {
        el.addEventListener("click", () => abrirModal(["assets/img/salon1.jpg", "assets/img/salon2.jpg"]));
    });

    // Listeners para la galería Polaroid
    const polaroidImgs = document.querySelectorAll(".carrusel-container .polaroid img");
    const listaPolaroids = Array.from(polaroidImgs).map((img) => img.src);

    polaroidImgs.forEach((img, index) => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            abrirModal(listaPolaroids, index);
        });
    });
})();
