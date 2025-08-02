window.addEventListener("DOMContentLoaded", () => {
    const decorSup1 = document.querySelector(".decor-sup-1");
    const decorSup2 = document.querySelector(".decor-sup-2");
    const decorInf1 = document.querySelector(".decor-inf-1");
    const decorInf2 = document.querySelector(".decor-inf-2");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("animate");
                    void entry.target.offsetWidth;
                    entry.target.classList.add("animate");
                } else {
                    entry.target.classList.remove("animate");
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(decorSup1);
    observer.observe(decorSup2);
    observer.observe(decorInf1);
    observer.observe(decorInf2);
});
