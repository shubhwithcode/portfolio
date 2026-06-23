document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".menu-toggle");
    let revealObserver;

    function initReveal(scope = document) {
        const revealItems = scope.querySelectorAll("[data-reveal]:not([data-reveal-ready])");

        if (!revealItems.length) {
            return;
        }

        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.16,
                rootMargin: "0px 0px -40px 0px"
            });
        }

        revealItems.forEach((item, index) => {
            if (!item.style.transitionDelay) {
                item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
            }

            item.setAttribute("data-reveal-ready", "true");
            revealObserver.observe(item);
        });
    }

    window.initReveal = initReveal;

    if (nav && toggle) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    initReveal();
});
