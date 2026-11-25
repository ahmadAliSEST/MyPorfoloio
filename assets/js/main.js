/* ===================================================
   MAIN INTERACTIVITY SCRIPT
   Ahmad Ali - Salesforce Developer Portfolio
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================
       1. LENIS SMOOTH SCROLL (LIKE DEVANSH PRAKASH)
    =================================== */
    if (typeof Lenis !== "undefined") {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect anchor links to Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#' && !targetId.includes('Modal')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        lenis.scrollTo(targetElement, { offset: -70 });
                    }
                }
            });
        });
    }

    /* ===================================
       2. ABOUT ME CONSOLE TABS & COPY CODE
    =================================== */
    const consoleTabs = document.querySelectorAll(".console-tab");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const consoleCopyBtn = document.querySelector(".console-copy-btn");

    if (consoleTabs.length > 0) {
        consoleTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const targetTab = tab.getAttribute("data-tab");

                // Deactivate all
                consoleTabs.forEach((t) => t.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                // Activate clicked
                tab.classList.add("active");
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add("active");
                }
            });
        });
    }

    if (consoleCopyBtn) {
        consoleCopyBtn.addEventListener("click", () => {
            const activePane = document.querySelector(".tab-pane.active");
            if (!activePane) return;

            // Extract plain text from code lines
            const lines = activePane.querySelectorAll(".line-content");
            let codeText = "";
            lines.forEach((line) => {
                codeText += line.innerText + "\n";
            });

            navigator.clipboard.writeText(codeText.trim()).then(() => {
                const originalHtml = consoleCopyBtn.innerHTML;
                consoleCopyBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #10B981;"></i> Copied!`;
                setTimeout(() => {
                    consoleCopyBtn.innerHTML = originalHtml;
                }, 2000);
            }).catch(() => {
                // Fallback
                consoleCopyBtn.innerText = "Copied!";
                setTimeout(() => {
                    consoleCopyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
                }, 2000);
            });
        });
    }

    /* ===================================
       3. PROJECT CATEGORY FILTERING (DEVANSH STYLE)
    =================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                projectCards.forEach((card) => {
                    const cardCategory = card.getAttribute("data-category");
                    if (filterValue === "all" || (cardCategory && cardCategory.includes(filterValue))) {
                        card.classList.remove("is-hidden");
                    } else {
                        card.classList.add("is-hidden");
                    }
                });
            });
        });
    }

    /* ===================================
       4. CONTACT FORM SUBMISSION TO AHMAD'S EMAIL
    =================================== */
    const contactForm = document.getElementById("contactForm");
    const formAlert = document.getElementById("formAlert");

    if (contactForm && formAlert) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("contactName");
            const emailInput = document.getElementById("contactEmail");
            const phoneInput = document.getElementById("contactPhone");
            const subjectInput = document.getElementById("contactSubject");
            const messageInput = document.getElementById("contactMessage");
            const submitBtn = contactForm.querySelector(".btn-submit");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : "Not specified";
            const subject = subjectInput ? subjectInput.value : "Salesforce Developer Opportunity";
            const message = messageInput.value.trim();

            // Client Validation
            if (!name || !email || !message) {
                showAlert("Please complete all required fields (Name, Email, and Message).", "error");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert("Please enter a valid email address.", "error");
                return;
            }

            // UI Loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending to Ahmad Ali...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

            try {
                // Post directly to FormSubmit endpoint configured for ahmadalisest@gmail.com
                const response = await fetch("https://formsubmit.co/ajax/ahmadalisest@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        topic: subject,
                        message: message,
                        _subject: `New Portfolio Inquiry from ${name} - ${subject}`,
                        _template: "table",
                        _captcha: "false"
                    })
                });

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                if (response.ok) {
                    showAlert(`Thank you, ${name}! Your inquiry has been dispatched directly to Ahmad Ali (ahmadalisest@gmail.com). You will receive a response shortly.`, "success");
                    contactForm.reset();
                } else {
                    // Fallback to mailto link
                    handleMailtoFallback(name, email, subject, message);
                }
            } catch (err) {
                // If offline or blocked by adblock, provide seamless 1-click fallback
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                handleMailtoFallback(name, email, subject, message);
            }
        });

        function handleMailtoFallback(name, email, subject, message) {
            const mailtoUrl = `mailto:ahmadalisest@gmail.com?subject=${encodeURIComponent(subject + " - " + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\nMessage:\n" + message)}`;
            showAlert(`Message drafted! <a href="${mailtoUrl}" style="color: #fff; text-decoration: underline; font-weight: 700;">Click here to send directly via your email client</a>.`, "success");
        }

        function showAlert(msg, type) {
            formAlert.className = `form-alert ${type}`;
            formAlert.innerHTML = `
                <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
                <div>${msg}</div>
            `;
            formAlert.style.display = "flex";

            // Scroll alert into view
            formAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });

            if (type === "success") {
                setTimeout(() => {
                    formAlert.style.display = "none";
                }, 10000);
            }
        }
    }

    /* ===================================
       5. RESUME MODAL & PRINT HANDLER
    =================================== */
    const resumePreviewButtons = document.querySelectorAll(".btn-resume-preview");
    const resumeModal = document.getElementById("resumeModal");
    const closeResumeBtn = document.getElementById("closeResumeModal");
    const printResumeBtn = document.getElementById("printResumeBtn");

    if (resumeModal) {
        resumePreviewButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openResumeModal();
            });
        });

        if (closeResumeBtn) {
            closeResumeBtn.addEventListener("click", closeResumeModal);
        }

        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resumeModal.classList.contains("active")) {
                closeResumeModal();
            }
        });

        if (printResumeBtn) {
            printResumeBtn.addEventListener("click", () => {
                const printContent = document.getElementById("resumePrintArea").innerHTML;
                const printWindow = window.open("", "_blank");
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Ahmad Ali - Salesforce Developer Resume</title>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
                        <style>
                            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                            h1, h2, h3, h4 { margin-top: 0; color: #0f172a; }
                            .resume-header-top { border-bottom: 2px solid #00A1E0; padding-bottom: 16px; margin-bottom: 20px; }
                            .resume-section-block { margin-bottom: 22px; }
                            .resume-skill-badge { display: inline-block; padding: 3px 10px; background: #e0f2fe; color: #0284c7; border-radius: 4px; font-size: 12px; margin-right: 6px; margin-bottom: 6px; font-weight: 600; }
                            ul { padding-left: 20px; }
                            li { margin-bottom: 6px; }
                            @media print {
                                body { padding: 0; }
                                @page { margin: 1.5cm; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            });
        }
    }

    function openResumeModal() {
        resumeModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeResumeModal() {
        resumeModal.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    /* ===================================
       6. ARCHITECTURE MODAL HANDLER
    =================================== */
    const archButtons = document.querySelectorAll(".btn-open-arch");
    const archModal = document.getElementById("archModal");
    const closeArchBtn = document.getElementById("closeArchModal");
    const archModalTitle = document.getElementById("archModalTitle");
    const archModalBody = document.getElementById("archModalBody");

    const projectArchitectures = {
        "restaurant": {
            title: "Restaurant Automation System Architecture",
            content: `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <p><strong>Cloud Architecture:</strong> Custom Lightning App built with Apex controllers, reactive LWC UI components, and Record-Triggered Flows.</p>
                    <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: var(--primary-color); margin-top:0;">Key Engineering Highlights:</h4>
                        <ul style="padding-left: 20px; margin: 0; line-height: 1.8;">
                            <li><strong>Apex Controller Bulkification:</strong> SOQL queries optimized with indexed fields, avoiding Governor limits during peak table reservation traffic.</li>
                            <li><strong>Reactive LWC Grid:</strong> Real-time table status monitoring with Lightning Message Service (LMS) communicating table state to kitchen display.</li>
                            <li><strong>Automated Stock Replenishment:</strong> Before-save Flows calculate ingredient depletion and fire sub-flows creating Purchase Orders.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        "healthcloud": {
            title: "HealthCloud Patient Management Architecture",
            content: `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <p><strong>Clinical Architecture:</strong> Secure healthcare portal adhering strictly to HIPAA and patient privacy standards.</p>
                    <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: var(--primary-color); margin-top:0;">Security & Process Logic:</h4>
                        <ul style="padding-left: 20px; margin: 0; line-height: 1.8;">
                            <li><strong>Role Hierarchy & FLS:</strong> Medical records restricted via granular Permission Sets, Field-Level Security, and Sharing Rules.</li>
                            <li><strong>Apex Trigger Handler Pattern:</strong> Single trigger per object delegating logic to handler and helper classes with 90%+ code coverage.</li>
                            <li><strong>Dynamic Scheduling Component:</strong> LWC custom calendar utilizing wire adapters and imperative Apex for doctor roster collision detection.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        "hr": {
            title: "Enterprise HR & Talent Automation Architecture",
            content: `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <p><strong>Operations Architecture:</strong> End-to-end recruitment, onboarding, and multi-tier approval system modeled after large-scale enterprise workflows (HPCL Rajasthan Refinery experience).</p>
                    <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: var(--primary-color); margin-top:0;">Automation Framework:</h4>
                        <ul style="padding-left: 20px; margin: 0; line-height: 1.8;">
                            <li><strong>Multi-Step Approvals:</strong> Configured approval processes with dynamic routing to Department Heads and HR Directors.</li>
                            <li><strong>Invocable Apex Integration:</strong> Custom Apex action triggered from Flow to generate official onboarding documentation and provision user credentials.</li>
                            <li><strong>Real-time KPI Analytics:</strong> Executive summary reports tracking time-to-hire, departmental attrition, and operational compliance.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        "aircall": {
            title: "Aircall Telephony (CTI) & Salesforce Integration",
            content: `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <p><strong>Integration Architecture:</strong> Real-time Computer Telephony Integration (CTI) syncing call logs, recordings, and agent events into Salesforce CRM.</p>
                    <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: var(--primary-color); margin-top:0;">Integration Specifications:</h4>
                        <ul style="padding-left: 20px; margin: 0; line-height: 1.8;">
                            <li><strong>Custom Inbound REST Endpoint:</strong> <code>@RestResource(urlMapping='/api/aircall/webhook/*')</code> parses call events, verifies signatures, and upserts Lead/Contact records.</li>
                            <li><strong>Screen-Pop LWC:</strong> When an inbound call arrives, an automated screen-pop displays caller history, open cases, and past notes immediately.</li>
                            <li><strong>Governor Limits Resilience:</strong> Heavy event processing dispatched asynchronously via Queueable Apex and Platform Events.</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };

    if (archButtons.length > 0 && archModal) {
        archButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-project");
                const data = projectArchitectures[key];
                if (data && archModalTitle && archModalBody) {
                    archModalTitle.innerHTML = `<i class="fa-solid fa-diagram-project"></i> ${data.title}`;
                    archModalBody.innerHTML = data.content;
                    archModal.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            });
        });

        if (closeArchBtn) {
            closeArchBtn.addEventListener("click", () => {
                archModal.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        }

        archModal.addEventListener("click", (e) => {
            if (e.target === archModal) {
                archModal.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }

});
