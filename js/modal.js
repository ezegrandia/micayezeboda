// Variables globales
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("custom-modal");
const closeBtn = document.getElementById("modal-close");
const modalContent = document.getElementById("modal-content");
const modalIcon = document.getElementById("modal-icon-img");

// Configuración de los modales
const modalData = {
    dresscode: {
        title: "Dress Code",
        text: [
            "Queremos que disfrutes y te sientas cómodo.",
            "El código de vestimenta será <strong>elegante y formal</strong>.",
            "El <span>blanco</span> es prioridad para la novia",
        ],
        form: "",
        icon: "./assets/img/bow-icon.svg",
        iconSize: "50px",
        image: "./assets/img/novios-icono.svg",
    },
    regalo: {
        title: "Regalo",
        text: "",
        form: `
            <div class="datos-bancarios">
                <h3>Datos para transferencia:</h3>
                <p><strong>Banco:</strong>Mercado Pago</p>
                <p><strong>CBU:</strong>0000003100007877635902</p>
                <p><strong>Alias:</strong>micayeze.boda</p>
                <p><strong>Titular:</strong>Ezequiel Emiliano Grandia</p>
                <p><strong>CUIL:</strong>20389088006</p>
            </div>
        `,
        icon: "./assets/img/gift.svg",
        iconSize: "50px",
    },
    cancion: {
        title: "Sugerir Canción",
        text: "",
        form: `
            <form class="form-cancion">
                <div class="form-group">
                    <label>Tu Nombre</label>
                    <input type="text" name="nombre" required placeholder="Tu Nombre">
                </div>
                <div class="form-group">
                    <label>Nombre de la canción y autor</label>
                    <input type="text" name="cancion" required placeholder="Nombre de la canción y autor">
                </div>
                <div class="form-group">
                    <label>Link (YouTube o Spotify - opcional)</label>
                    <input type="url" name="link" placeholder="Link YouTube (opcional)">
                </div>
                <button type="submit" class="form-btn">Enviar Sugerencia</button>
            </form>
        `,
        icon: "./assets/img/song-icon.svg",
        iconSize: "50px",
    },
};

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

        // Mostrar modal y bloquear scroll (cambio aquí)
        overlay.style.display = "block";
        modal.style.display = "flex";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.classList.add("bloqueo-scroll");
    });
});

// Función para cerrar modal (cambios aquí)
function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.classList.remove("bloqueo-scroll");
}

// Event listeners para cerrar
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Manejar envío de formulario
document.addEventListener("submit", function (e) {
    if (e.target.classList.contains("form-cancion")) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log("Canción sugerida:", data);

        // Mostrar mensaje de confirmación
        modalContent.innerHTML = `
            <h2 class="modal-title">¡Gracias por tu sugerencia!</h2>
            <div class="modal-block">
                <p>Hemos recibido tu canción "${data.cancion}".</p>
                <p>¡Esperamos verte en la fiesta!</p>
            </div>
        `;

        // Cerrar automáticamente después de 3 segundos
        setTimeout(closeModal, 3000);
    }
});
