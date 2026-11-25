/* ===================================
   SCROLL SPY & BACK TO TOP
=================================== */

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll(".nav-menu .nav-link");
    const floatingTopBtn = document.querySelector(".floating-back-to-top");
    const backToTopBtn = document.querySelector(".back-to-top");

    // ScrollSpy: Update active nav link based on scroll position
    function onScrollSpy() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });

        // Toggle floating back to top button
        if (floatingTopBtn) {
            if (window.scrollY > 350) {
                floatingTopBtn.classList.add("visible");
            } else {
                floatingTopBtn.classList.remove("visible");
            }
        }
    }

    window.addEventListener("scroll", onScrollSpy, { passive: true });
    onScrollSpy();

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    if (floatingTopBtn) {
        floatingTopBtn.addEventListener("click", scrollToTop);
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", scrollToTop);
    }
});
