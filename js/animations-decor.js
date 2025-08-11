window.addEventListener("DOMContentLoaded", () => {
    const decorSup1 = document.querySelector(".decor-sup-1");
    const decorSup2 = document.querySelector(".decor-sup-2");
    const decorInf1 = document.querySelector(".decor-inf-1");
    const decorInf2 = document.querySelector(".decor-inf-2");
    const decorDer1 = document.querySelector(".decor-der-1");
    const decorDer2 = document.querySelector(".decor-der-2");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                } else {
                    entry.target.classList.remove("animate");
                }
            });
        },
        { threshold: 0.1 }
    );

    [decorSup1, decorSup2, decorInf1, decorInf2, decorDer1, decorDer2].forEach((decor) => {
        if (decor) {
            // Agregar animate al cargar para que estén visibles inicialmente
            decor.classList.add("animate");
            observer.observe(decor);
        }
    });
});
