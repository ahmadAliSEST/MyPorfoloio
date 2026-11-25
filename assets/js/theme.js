/* ===================================
   THEME TOGGLE (DARK / LIGHT MODE)
=================================== */

(function () {
    const themeToggleBtn = document.querySelector(".theme-toggle");
    const htmlElement = document.documentElement;

    // Determine initial theme: saved preference -> system preference -> light default
    const savedTheme = localStorage.getItem("portfolio_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    // Apply theme
    applyTheme(initialTheme);

    function applyTheme(theme) {
        if (theme === "dark") {
            htmlElement.setAttribute("data-theme", "dark");
            updateToggleIcon("dark");
        } else {
            htmlElement.removeAttribute("data-theme");
            updateToggleIcon("light");
        }
        localStorage.setItem("portfolio_theme", theme);
    }

    function updateToggleIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (!icon) return;

        if (theme === "dark") {
            icon.className = "fa-solid fa-sun";
            themeToggleBtn.setAttribute("aria-label", "Switch to Light Theme");
        } else {
            icon.className = "fa-solid fa-moon";
            themeToggleBtn.setAttribute("aria-label", "Switch to Dark Theme");
        }
    }

    // Event listener for toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(newTheme);
        });
    }

    // Listen to OS theme changes if user has not set explicit preference
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("portfolio_theme")) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
})();
