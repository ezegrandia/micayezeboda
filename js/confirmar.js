// confirmar.js - Script para el formulario de confirmación de asistencia

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const cantidadPersonas = document.getElementById("cantidad-personas");
    const personasContainer = document.getElementById("personas-container");
    const confirmarForm = document.getElementById("confirmar-form");

    // URL de tu Apps Script (REEMPLAZAR CON TU URL AL HACER EL DEPLOY)
    const scriptURL =
        "https://script.google.com/macros/s/AKfycbzF4TMM2f-wldccE3iCRmz1UzN5zBpZFGncQwGfANKash25TM0VxPrL0stQWe8DOC9l/exec";

    // Generar formularios según cantidad de personas seleccionada
    function generarFormulariosPersonas(cantidad) {
        personasContainer.innerHTML = "";

        if (cantidad === 0) {
            // Caso de no asistencia
            const noAsistenciaHTML = `
                <div class="no-asistencia-container">
                    <p class="no-asistencia-texto">Lamentamos que no puedas asistir. 
                    <br><br>Por favor, déjanos tus datos para tenerlos en cuenta.</p>
                    <div class="form-group">
                        <input type="text" name="nombre-no-asistencia" placeholder="Nombre (obligatorio)" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="apellido-no-asistencia" placeholder="Apellido (obligatorio)" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="comentario-no-asistencia" placeholder="Comentario (opcional)">
                    </div>
                </div>
            `;
            personasContainer.innerHTML = noAsistenciaHTML;
        } else if (cantidad > 0) {
            // Generar formularios para cada persona
            for (let i = 1; i <= cantidad; i++) {
                const personaHTML = `
                    <div class="persona-form" data-persona="${i}">
                        <h3 class="persona-titulo">Persona ${i}</h3>
                        <div class="form-group">
                            <input type="text" name="persona-${i}-nombre" placeholder="Nombre (obligatorio)" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="persona-${i}-apellido" placeholder="Apellido (obligatorio)" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="persona-${i}-dni" autocomplete="off" placeholder="DNI (sin puntos, obligatorio)" 
                                   pattern="[0-9]+" title="Por favor ingresa solo números" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="persona-${i}-alimentacion" autocomplete="off" placeholder="Requerimiento en alimentación (opcional)">
                        </div>
                        <div class="form-group">
                            <input type="text" name="persona-${i}-comentario" autocomplete="off" placeholder="Comentario (opcional)">
                        </div>
                    </div>
                `;
                personasContainer.insertAdjacentHTML("beforeend", personaHTML);
            }
        }

        // Configurar placeholders dinámicamente
        setupConfirmacionPlaceholders();
    }

    // Configurar placeholders para inputs del formulario
    function setupConfirmacionPlaceholders() {
        const inputs = document.querySelectorAll(".form-confirmacion input");

        inputs.forEach((input) => {
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

    // Mostrar mensaje de confirmación
    function mostrarConfirmacionExito(cantidad, nombres) {
        const modalOverlay = document.createElement("div");
        modalOverlay.className = "confirmacion-overlay";

        const modalContent = document.createElement("div");
        modalContent.className = "confirmacion-modal";

        let mensaje = "";
        let titulo = "";

        if (cantidad === 0) {
            titulo = "Lamentamos que no puedas asistir";
            mensaje = `Gracias por informarnos, ${nombres[0]}. 
            <br><br>Hemos registrado que no podrás acompañarnos. 
            <br><br>¡Te extrañaremos en nuestro gran día!`;
        } else if (cantidad === 1) {
            titulo = "¡Confirmación exitosa!";
            mensaje = `¡Gracias por confirmar, ${nombres[0]}! 
            <br><br>Hemos registrado tu asistencia. 
            <br><br>¡Esperamos verte en nuestro gran día!`;
        } else {
            titulo = "¡Confirmación exitosa!";
            const otrosNombres = nombres.slice(1).join(", ");
            mensaje = `¡Gracias por confirmar, ${nombres[0]}! 
            <br><br>Hemos registrado la asistencia de ${cantidad} personas (${nombres.join(", ")}). 
            <br><br>¡Esperamos verlos en nuestro gran día!`;
        }

        modalContent.innerHTML = `
            <h2>${titulo}</h2>
            <p>${mensaje}</p>
            <button class="confirmacion-cerrar-btn">Cerrar</button>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Cerrar modal
        const cerrarBtn = modalContent.querySelector(".confirmacion-cerrar-btn");
        cerrarBtn.addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });
    }

    // Mostrar mensaje de error
    function mostrarErrorConfirmacion() {
        const modalOverlay = document.createElement("div");
        modalOverlay.className = "confirmacion-overlay";

        const modalContent = document.createElement("div");
        modalContent.className = "confirmacion-modal error";

        modalContent.innerHTML = `
            <h2>¡Error al confirmar!</h2>
            <p>Ocurrió un problema al procesar tu confirmación. Por favor intenta nuevamente más tarde.</p>
            <button class="confirmacion-cerrar-btn">Cerrar</button>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        const cerrarBtn = modalContent.querySelector(".confirmacion-cerrar-btn");
        cerrarBtn.addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });
    }

    // Enviar datos a Google Sheets
    async function enviarDatosGoogleSheets(personasData, cantidad, nombres) {
        try {
            // Enviar cada persona como fila separada
            for (const persona of personasData) {
                const response = await fetch(scriptURL, {
                    method: "POST",
                    body: JSON.stringify({
                        ...persona,
                        "cantidad-personas": cantidad,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Error en la respuesta");
            }

            mostrarConfirmacionExito(cantidad, nombres);
        } catch (error) {
            console.error("Error:", error);
            mostrarErrorConfirmacion();
        } finally {
            // Limpiar formulario
            confirmarForm.reset();
            personasContainer.innerHTML = "";
            cantidadPersonas.selectedIndex = 0;
        }
    }

    // Event listeners
    cantidadPersonas.addEventListener("change", function () {
        const cantidad = parseInt(this.value);
        generarFormulariosPersonas(cantidad);
    });

    confirmarForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const cantidad = parseInt(data["cantidad-personas"]);
        const asistencia = cantidad > 0 ? "Sí" : "No";

        // Obtener nombres para el mensaje y datos para Sheets
        let nombres = [];
        let personasData = [];

        if (cantidad === 0) {
            nombres.push(data["nombre-no-asistencia"]);
            personasData.push({
                nombre: data["nombre-no-asistencia"],
                apellido: data["apellido-no-asistencia"],
                dni: "",
                alimentacion: "",
                comentario: data["comentario-no-asistencia"] || "",
                asistencia: "No",
            });
        } else {
            for (let i = 1; i <= cantidad; i++) {
                const nombre = data[`persona-${i}-nombre`];
                if (nombre) {
                    nombres.push(nombre);
                    personasData.push({
                        nombre: data[`persona-${i}-nombre`],
                        apellido: data[`persona-${i}-apellido`],
                        dni: data[`persona-${i}-dni`],
                        alimentacion: data[`persona-${i}-alimentacion`] || "",
                        comentario: data[`persona-${i}-comentario`] || "",
                        asistencia: "Sí",
                    });
                }
            }
        }

        // Enviar datos a Google Sheets
        enviarDatosGoogleSheets(personasData, cantidad, nombres);
    });

    // Inicializar placeholders
    setupConfirmacionPlaceholders();
});
