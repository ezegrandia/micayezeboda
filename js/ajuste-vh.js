function updateRealVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--real-vh", `${vh}px`);
}
window.addEventListener("resize", updateRealVh);
updateRealVh();
