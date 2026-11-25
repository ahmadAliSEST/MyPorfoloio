/* ===================================
   NAVBAR & MOBILE MENU FUNCTIONALITY
=================================== */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Header scroll background effect
    function handleScroll() {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (isOpen) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });

        // Close mobile menu when clicking any nav link
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("active")) {
                closeMobileMenu();
            }
        });

        function closeMobileMenu() {
            navMenu.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.className = "fa-solid fa-bars";
            }
        }
    }
});