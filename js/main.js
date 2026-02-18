/* ======================================================
   AGRIFIT - PREMIUM INTERACTIVE SCRIPT
   Version: 3.0
   Author: AgriFit
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       UTILITY FUNCTIONS
    ====================================================== */

    const select = (selector, all = false) => {
        return all 
            ? document.querySelectorAll(selector) 
            : document.querySelector(selector);
    };

    const debounce = (func, delay = 10) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /* ======================================================
       MOBILE MENU TOGGLE WITH ANIMATION
    ====================================================== */

    const toggle = select(".menu-toggle");
    const navLinks = select(".nav-links");
    const navItems = select(".nav-links li", true);

    if (toggle && navLinks) {
        toggle.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            // Animate each link
            navItems.forEach((link, index) => {
                link.style.animation = navLinks.classList.contains("active")
                    ? `fadeSlide 0.5s ease forwards ${index / 7 + 0.2}s`
                    : "";
            });

            toggle.classList.toggle("open");
        });
    }

    /* ======================================================
       STICKY NAVBAR WITH SMART SHRINK EFFECT
    ====================================================== */

    const navbar = select(".navbar");

    const handleNavbarScroll = () => {
        if (window.scrollY > 80) {
            navbar.style.background = "#0b3d25";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
            navbar.style.padding = "15px 8%";
        } else {
            navbar.style.background = "#0f5132";
            navbar.style.boxShadow = "none";
            navbar.style.padding = "20px 8%";
        }
    };

    window.addEventListener("scroll", debounce(handleNavbarScroll, 10));

    /* ======================================================
       SCROLL PROGRESS BAR
    ====================================================== */

    const progressBar = document.createElement("div");
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.height = "4px";
    progressBar.style.background = "#20c997";
    progressBar.style.zIndex = "2000";
    progressBar.style.width = "0%";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + "%";
    });

    /* ======================================================
       ADVANCED COUNTER ANIMATION
    ====================================================== */

    const counters = select(".counter", true);

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = +counter.dataset.target;
            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const update = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            update();
            observer.unobserve(counter);
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ======================================================
       PREMIUM SCROLL REVEAL WITH STAGGER
    ====================================================== */

    const revealElements = select(
        ".path-card, .course-card, .testimonial-card, .pricing-card, .step, .community-grid div",
        true
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(60px)";
        el.style.transition = "all 0.8s cubic-bezier(0.5, 0, 0, 1)";
        revealObserver.observe(el);
    });

    /* ======================================================
       ACTIVE NAV LINK ON SCROLL (IMPROVED)
    ====================================================== */

    const sections = select("section", true);
    const navLinksItems = select(".nav-links a", true);

    const activateNavLink = () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active-link");
            }
        });
    };

    window.addEventListener("scroll", debounce(activateNavLink, 20));

    /* ======================================================
       RIPPLE EFFECT FOR BUTTONS
    ====================================================== */

    const buttons = select(".btn-primary, .btn-secondary", true);

    buttons.forEach(button => {
        button.addEventListener("click", function (e) {

            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
            circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
            circle.classList.add("ripple");

            const ripple = this.getElementsByClassName("ripple")[0];
            if (ripple) ripple.remove();

            this.appendChild(circle);
        });
    });

    /* ======================================================
       PRICING CARD 3D HOVER EFFECT
    ====================================================== */

    const pricingCards = select(".pricing-card", true);

    pricingCards.forEach(card => {

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0) scale(1)";
        });
    });

    /* ======================================================
       PARALLAX EFFECT (HERO)
    ====================================================== */

    const hero = select(".hero");

    if (hero) {
        window.addEventListener("scroll", () => {
            hero.style.backgroundPositionY = window.scrollY * 0.5 + "px";
        });
    }

    /* ======================================================
       BACK TO TOP BUTTON
    ====================================================== */

    const backToTop = document.createElement("button");
    backToTop.innerHTML = "↑";
    backToTop.style.position = "fixed";
    backToTop.style.bottom = "40px";
    backToTop.style.right = "40px";
    backToTop.style.padding = "12px 16px";
    backToTop.style.borderRadius = "50%";
    backToTop.style.border = "none";
    backToTop.style.background = "#198754";
    backToTop.style.color = "#fff";
    backToTop.style.cursor = "pointer";
    backToTop.style.display = "none";
    backToTop.style.zIndex = "2000";
    backToTop.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 400 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

});
