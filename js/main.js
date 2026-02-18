/* ======================================================
   AGRIFIT - PREMIUM INTERACTIVE SCRIPT
   Version: 4.0 (Production Ready)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       HELPER FUNCTIONS
    ====================================================== */

    const select = (selector, all = false) =>
        all ? document.querySelectorAll(selector) : document.querySelector(selector);

    const debounce = (func, delay = 10) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /* ======================================================
       MOBILE MENU
    ====================================================== */

    const toggle = select(".menu-toggle");
    const navLinks = select(".nav-links");

    if (toggle && navLinks) {
        toggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            toggle.classList.toggle("open");
        });
    }

    /* ======================================================
       SMOOTH SCROLL FOR INTERNAL LINKS
    ====================================================== */

    const internalLinks = select('a[href^="#"]', true);

    internalLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });

                if (navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                }
            }
        });
    });

    /* ======================================================
       NAVBAR SCROLL EFFECT
    ====================================================== */

    const navbar = select(".navbar");

    const handleNavbarScroll = () => {
        if (!navbar) return;

        if (window.scrollY > 80) {
            navbar.style.background = "rgba(11,61,37,0.95)";
            navbar.style.padding = "14px 8%";
            navbar.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        } else {
            navbar.style.background = "rgba(20,83,45,0.85)";
            navbar.style.padding = "22px 8%";
            navbar.style.boxShadow = "none";
        }
    };

    window.addEventListener("scroll", debounce(handleNavbarScroll, 10));

    /* ======================================================
       SCROLL PROGRESS BAR
    ====================================================== */

    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        height:4px;
        width:0%;
        background:linear-gradient(90deg,#22c55e,#1f7a4d);
        z-index:2000;
        transition:width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollTop / height) * 100;
        progressBar.style.width = percent + "%";
    });

    /* ======================================================
       COUNTER ANIMATION
    ====================================================== */

    const counters = select(".counter", true);

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = +counter.dataset.target;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                counter.textContent = value.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(animate);
            observer.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ======================================================
       SCROLL REVEAL EFFECT
    ====================================================== */

    const revealElements = select(
        ".category-card, .membership-card, .vision-grid div, .impact-grid div, .contact-card",
        true
    );

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transition = "all 0.8s ease";
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(50px)";
        revealObserver.observe(el);
    });

    /* ======================================================
       ACTIVE NAV LINK ON SCROLL
    ====================================================== */

    const sections = select("section", true);
    const navItems = select(".nav-links a", true);

    const activateNav = () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(link => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active-link");
            }
        });
    };

    window.addEventListener("scroll", debounce(activateNav, 20));

    /* ======================================================
       BUTTON RIPPLE EFFECT
    ====================================================== */

    const buttons = select(".btn-primary, .btn-secondary, .btn-outline", true);

    buttons.forEach(button => {
        button.addEventListener("click", function (e) {

            const rect = this.getBoundingClientRect();
            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.style.position = "absolute";
            circle.style.borderRadius = "50%";
            circle.style.background = "rgba(255,255,255,0.4)";
            circle.style.transform = "scale(0)";
            circle.style.animation = "ripple 0.6s linear";
            circle.style.pointerEvents = "none";

            const ripple = this.querySelector(".ripple");
            if (ripple) ripple.remove();

            circle.classList.add("ripple");
            this.style.position = "relative";
            this.style.overflow = "hidden";
            this.appendChild(circle);
        });
    });

    /* ======================================================
       PRICING CARD 3D EFFECT (SMOOTHED)
    ====================================================== */

    const pricingCards = select(".membership-card", true);

    pricingCards.forEach(card => {

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * 8;
            const rotateY = ((x / rect.width) - 0.5) * 8;

            card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0)";
        });
    });

    /* ======================================================
       HERO PARALLAX
    ====================================================== */

    const hero = select(".hero");

    if (hero) {
        window.addEventListener("scroll", () => {
            hero.style.backgroundPositionY = window.scrollY * 0.4 + "px";
        });
    }

    /* ======================================================
       BACK TO TOP BUTTON
    ====================================================== */

    const backToTop = document.createElement("button");
    backToTop.innerHTML = "↑";
    backToTop.style.cssText = `
        position:fixed;
        bottom:30px;
        right:30px;
        padding:12px 16px;
        border-radius:50%;
        border:none;
        background:#1f7a4d;
        color:#fff;
        font-size:18px;
        cursor:pointer;
        display:none;
        z-index:2000;
        box-shadow:0 10px 25px rgba(0,0,0,0.2);
        transition:all 0.3s ease;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 400 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

});
