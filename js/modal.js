// Variables globales
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("custom-modal");
const closeBtn = document.getElementById("modal-close");
const modalContent = document.getElementById("modal-content");
const modalIcon = document.getElementById("modal-icon-img");
let currentModalOpen = null;
let scrollPos = 0;

// Mostrar loader
function mostrarLoader() {
    document.getElementById("form-loader").style.display = "flex";
}

// Ocultar loader
function ocultarLoader() {
    document.getElementById("form-loader").style.display = "none";
}

// URL de tu Apps Script
const scriptURL =
    "https://script.google.com/macros/s/AKfycbyUqb0fATpFqbUwCkYmeqrrLbIPlBV1_GggfEd_rR-qCZ7zcNyIm5mPvFebUQg7GHDj/exec";

// Configuración de los modales
const modalData = {
    dresscode: {
        title: "Dress Code",
        text: [
            "Queremos que disfrutes y te sientas cómodo/a.",
            "El código de vestimenta será <strong>elegante y formal</strong>.",
            "El <span>blanco</span> es prioridad para la novia",
        ],
        form: "",
        icon: "./assets/img/bow-icon.svg",
        iconSize: "60px",
        image: "./assets/img/novios-icono.svg",
    },
    cancion: {
        title: "Sugerir Canción",
        text: "",
        form: `
            <form class="form-cancion" autocomplete="off">
                <div class="form-group">
                    <label>Tu Nombre</label>
                    <input type="text" name="nombre" required placeholder="Tu Nombre" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Nombre de la canción y autor</label>
                    <input type="text" name="cancion" required placeholder="Nombre de la canción y autor" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Link (YouTube o Spotify - opcional)</label>
                    <input type="url" name="link" placeholder="Link YouTube (opcional)" autocomplete="off">
                </div>
                <button type="submit" class="form-btn">Enviar Sugerencia</button>
            </form>
        `,
        icon: "./assets/img/song-icon.svg",
        iconSize: "50px",
    },
    regalo: {
        title: "Regalo",
        text: "",
        form: `
        <div class="datos-bancarios">
            <h3>Datos para transferencia:</h3>
            <p><strong>Banco:</strong> Mercado Pago</p>
            <div class="dato-container">
                <p><strong>CBU:</strong> <span id="cbu-text" class="copy-text">0000003100007877635902</span></p>
                <button class="copy-btn" data-target="cbu-text">
                    <img src="./assets/img/copy-icon.png" alt="Copiar CBU" class="copy-icon">
                </button>
            </div>
            <div class="dato-container">
                <p><strong>Alias:</strong> <span id="alias-text" class="copy-text">micayeze.boda</span></p>
                <button class="copy-btn" data-target="alias-text">
                    <img src="./assets/img/copy-icon.png" alt="Copiar Alias" class="copy-icon">
                </button>
            </div>
            <p><strong>Titular:</strong> Ezequiel Emiliano Grandia</p>
        </div>
    `,
        icon: "./assets/img/gift.svg",
        iconSize: "35px",
    },
};

function capitalizar(texto) {
    return texto.toLowerCase().replace(/(^|\s)\S/g, function (c) {
        return c.toUpperCase();
    });
}

// Ocultar placeholders de los inputs del formulario al hacer focus
function setupFormPlaceholders() {
    const inputs = document.querySelectorAll(".form-cancion input");

    inputs.forEach((input) => {
        const originalPlaceholder = input.placeholder;
        input.addEventListener("focus", () => (input.placeholder = ""));
        input.addEventListener("blur", () => {
            if (input.value === "") input.placeholder = originalPlaceholder;
        });
    });
}

// Función para copiar texto al portapapeles
function setupCopyButtons() {
    const copiedMessage = document.createElement("div");
    copiedMessage.className = "copied-message";
    copiedMessage.textContent = "¡Copiado!";
    document.body.appendChild(copiedMessage);

    document.addEventListener("click", (e) => {
        if (e.target.closest(".copy-btn")) {
            const btn = e.target.closest(".copy-btn");
            const targetId = btn.getAttribute("data-target");
            const textToCopy = document.getElementById(targetId).textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                copiedMessage.style.display = "block";
                setTimeout(() => (copiedMessage.style.display = "none"), 2000);
            });
        }
    });
}

// Función para manejar el botón atrás
function handleBackButton() {
    if (currentModalOpen) {
        closeModal();
        return true;
    }
    return false;
}

// Función para abrir modales
document.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const type = btn.dataset.modal;
        const data = modalData[type];

        if (!data) {
            console.error(`Modal data not found for type: ${type}`);
            return;
        }

        currentModalOpen = type;
        window.history.pushState({ modalOpen: true }, "");

        modalContent.innerHTML = "";

        if (data.title) {
            const modalTitle = document.createElement("h2");
            modalTitle.textContent = data.title;
            modalTitle.classList.add("modal-title");
            modalContent.appendChild(modalTitle);
        }

        const textContainer = document.createElement("div");
        textContainer.id = "modal-text";
        modalContent.appendChild(textContainer);

        if (data.text && data.text.length > 0) {
            data.text.forEach((parrafo) => {
                const div = document.createElement("div");
                div.classList.add("modal-block");
                div.innerHTML = `<p>${parrafo}</p>`;
                textContainer.appendChild(div);
            });
        }

        if (data.image) {
            const img = document.createElement("img");
            img.src = data.image;
            img.alt = data.title;
            img.classList.add("modal-image");
            textContainer.appendChild(img);
        }

        if (data.form) {
            const divForm = document.createElement("div");
            divForm.innerHTML = data.form;
            modalContent.appendChild(divForm);
        }

        if (modalIcon && data.icon) {
            modalIcon.src = data.icon;
            modalIcon.style.width = data.iconSize;
            modalIcon.style.height = data.iconSize;
        }

        // --- Guardar posición y congelar scroll ---
        scrollPos = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPos}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        overlay.style.display = "block";
        modal.style.display = "flex";

        setTimeout(() => {
            setupCopyButtons();
            if (btn.dataset.modal === "cancion") setupFormPlaceholders();
        }, 100);
    });
});

// Función para cerrar modal
function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";

    // --- Restaurar scroll sin “bajón” ---
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    // volver exactamente al mismo punto
    window.scrollTo({ top: scrollPos, left: 0, behavior: "instant" });

    currentModalOpen = null;
}

// Event listeners para cerrar
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Manejar historial de navegación
window.addEventListener("popstate", function (event) {
    if (event.state && event.state.modalOpen) {
        handleBackButton();
    } else if (currentModalOpen) {
        handleBackButton();
    }
});

// Manejar envío de formulario
document.addEventListener("submit", function (e) {
    if (e.target.classList.contains("form-cancion")) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log("Canción sugerida:", data);

        // Convertir a URL-encoded
        const body = new URLSearchParams(data).toString();

        mostrarLoader(); // 🔹 Mostrar loader antes de enviar

        fetch(scriptURL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    const nombreCapitalizado = capitalizar(data.nombre || "");
                    const cancionCapitalizada = capitalizar(data.cancion || "");

                    modalContent.innerHTML = `
                    <h2 class="modal-title">¡Gracias por tu sugerencia, ${nombreCapitalizado}!</h2>
                    <div class="modal-block">
                    <p>Hemos recibido tu canción <strong>"${cancionCapitalizada}"</strong>.</p>
                    <p>¡Seguro será un temazo en la fiesta! 🎶</p>
                    </div>
                    `;
                } else {
                    throw new Error(res.error || "Hubo un error desconocido");
                }
            })
            .catch((err) => {
                console.error("Error al enviar:", err);
                modalContent.innerHTML = `
                    <h2 class="modal-title">Hubo un error</h2>
                    <div class="modal-block">
                        <p>No pudimos registrar tu sugerencia. Por favor intentá de nuevo.</p>
                    </div>
                `;
            })
            .finally(() => {
                ocultarLoader(); // 🔹 Ocultar loader al terminar
            });
    }
});
