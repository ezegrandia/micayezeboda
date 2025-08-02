import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

const canvas = document.getElementById("animacion-lottie");
const iconoEstatico = document.getElementById("icono-estatico");
const audio = document.getElementById("musica-fondo");

let reproduciendo = true;

const animacion = new DotLottie({
    autoplay: true,
    loop: true,
    canvas: canvas,
    src: "https://lottie.host/567e8378-7f84-40f6-b4b2-9643a02452d8/lfpnzh9ARz.lottie",
});

window.addEventListener("load", () => {
    audio.play().catch((err) => {
        console.warn("Audio bloqueado hasta interacción del usuario:", err);
    });
    actualizarVisibilidad();
});

function actualizarVisibilidad() {
    if (reproduciendo) {
        canvas.style.display = "block";
        iconoEstatico.style.display = "none";
    } else {
        canvas.style.display = "none";
        iconoEstatico.style.display = "block";
    }
}

function toggleAudioAnimacion() {
    if (reproduciendo) {
        audio.pause();
        animacion.stop();
    } else {
        animacion.play();
        audio.play().catch((err) => {
            console.warn("Error al reproducir audio:", err);
        });
    }
    reproduciendo = !reproduciendo;
    actualizarVisibilidad();
}

canvas.addEventListener("click", toggleAudioAnimacion);
iconoEstatico.addEventListener("click", toggleAudioAnimacion);
