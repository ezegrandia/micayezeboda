// Variables globales
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("custom-modal");
const closeBtn = document.getElementById("modal-close");
const modalContent = document.getElementById("modal-content");
const modalIcon = document.getElementById("modal-icon-img");
let currentModalOpen = null;

// 🔹 URL de tu Apps Script (reemplazá por la tuya)
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzlzOvlsP_XtA1oMQsntL5k20Dvp6MloOCn8FD11uAnc8HvjPgGD8HNrGChuYNMt3UV/exec";

// Utilidad: mostrar/ocultar loader global del form
function toggleFormLoader(show) {
    const loader = document.getElementById("form-loader");
    if (loader) loader.style.display = show ? "flex" : "none";
}

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

//Ocultar placeholders de los inputs del formulario al hacer focus
function setupFormPlaceholders() {
    const inputs = document.querySelectorAll(".form-cancion input");

    inputs.forEach((input) => {
        // Guardar el placeholder original
        const originalPlaceholder = input.placeholder;

        input.addEventListener("focus", () => {
            input.placeholder = "";
        });

        input.addEventListener("blur", () => {
            if (input.value === "") {
                input.placeholder = originalPlaceholder;
            }
        });
    });
}

// Función para copiar texto al portapapeles
function setupCopyButtons() {
    // Crear elemento para mensaje de copiado
    const copiedMessage = document.createElement("div");
    copiedMessage.className = "copied-message";
    copiedMessage.textContent = "¡Copiado!";
    document.body.appendChild(copiedMessage);

    // Manejar clic en botones de copiar
    document.addEventListener("click", (e) => {
        if (e.target.closest(".copy-btn")) {
            const btn = e.target.closest(".copy-btn");
            const targetId = btn.getAttribute("data-target");
            const textToCopy = document.getElementById(targetId).textContent;

            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    // Mostrar mensaje de copiado
                    copiedMessage.style.display = "block";
                    setTimeout(() => {
                        copiedMessage.style.display = "none";
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Error al copiar: ", err);
                    // Fallback para navegadores que no soportan clipboard API
                    const textArea = document.createElement("textarea");
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);

                    copiedMessage.textContent = "¡Copiado! (método alternativo)";
                    copiedMessage.style.display = "block";
                    setTimeout(() => {
                        copiedMessage.style.display = "none";
                    }, 2000);
                });
        }
    });
}

// Función para manejar el botón atrás
function handleBackButton() {
    if (currentModalOpen) {
        closeModal();
        return true; // Indicar que manejamos el evento
    }
    return false;
}

// Función para abrir modales
document.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const type = btn.dataset.modal;
        const data = modalData[type];

        // Verificar que los datos del modal existan
        if (!data) {
            console.error(`Modal data not found for type: ${type}`);
            return;
        }

        // Registrar modal abierto
        currentModalOpen = type;
        // Agregar estado al historial
        window.history.pushState({ modalOpen: true }, "");

        // Limpiar contenido previo
        modalContent.innerHTML = "";

        // Agregar título
        if (data.title) {
            const modalTitle = document.createElement("h2");
            modalTitle.textContent = data.title;
            modalTitle.classList.add("modal-title");
            modalContent.appendChild(modalTitle);
        }

        // Crear contenedor de texto
        const textContainer = document.createElement("div");
        textContainer.id = "modal-text";
        modalContent.appendChild(textContainer);

        // Agregar texto si existe
        if (data.text && data.text.length > 0) {
            data.text.forEach((parrafo) => {
                const div = document.createElement("div");
                div.classList.add("modal-block");
                div.innerHTML = `<p>${parrafo}</p>`;
                textContainer.appendChild(div);
            });
        }

        // Agregar imagen si existe
        if (data.image) {
            const img = document.createElement("img");
            img.src = data.image;
            img.alt = data.title;
            img.classList.add("modal-image");
            textContainer.appendChild(img);
        }

        // Agregar formulario si existe
        if (data.form) {
            const divForm = document.createElement("div");
            divForm.innerHTML = data.form;
            modalContent.appendChild(divForm);
        }

        // Configurar icono
        if (modalIcon && data.icon) {
            modalIcon.src = data.icon;
            modalIcon.style.width = data.iconSize;
            modalIcon.style.height = data.iconSize;
        }

        // Mostrar modal y bloquear scroll
        overlay.style.display = "block";
        modal.style.display = "flex";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.classList.add("bloqueo-scroll");

        // Después de mostrar el modal
        setTimeout(() => {
            setupCopyButtons();
            if (btn.dataset.modal === "cancion") {
                setupFormPlaceholders();
            }
        }, 100);
    });
});

// Función para cerrar modal
function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.classList.remove("bloqueo-scroll");
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

        // ⚠️ poné acá la URL de tu App Script desplegado como "Aplicación web"
        const scriptURL =
            "https://script.google.com/macros/s/AKfycbzlzOvlsP_XtA1oMQsntL5k20Dvp6MloOCn8FD11uAnc8HvjPgGD8HNrGChuYNMt3UV/exec";

        fetch(scriptURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("Respuesta del servidor:", res); // 👈 te muestra el error exacto
                if (res.success) {
                    // Mostrar mensaje de confirmación
                    modalContent.innerHTML = `
                    <h2 class="modal-title">¡Gracias por tu sugerencia!</h2>
                    <div class="modal-block">
                        <p>Hemos recibido tu canción "${data.cancion}".</p>
                        <p>¡Esperamos verte en la fiesta!</p>
                    </div>
                `;

                    // Cerrar automáticamente después de 6 segundos
                    setTimeout(closeModal, 6000);
                } else {
                    throw new Error(res.error || "Error desconocido en el servidor");
                }
            })
            .catch((err) => {
                console.error("Error al enviar:", err);
                modalContent.innerHTML = `
                <h2 class="modal-title">Hubo un error</h2>
                <div class="modal-block">
                    <p>No pudimos enviar tu sugerencia. Por favor, intentá de nuevo.</p>
                </div>
            `;
                setTimeout(closeModal, 6000);
            });
    }
});
