document.addEventListener("DOMContentLoaded", () => {
    const typingElement = document.querySelector("#typing");
    if (typingElement && typeof Typed !== "undefined") {
        new Typed("#typing", {
            strings: [
                "Salesforce Developer",
                "Apex & LWC Specialist",
                "Flow Automation Expert",
                "CRM Solution Architect"
            ],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 1600,
            loop: true
        });
    }
});