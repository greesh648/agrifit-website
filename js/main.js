/* ===============================
   MOBILE MENU TOGGLE
================================= */

const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


/* ===============================
   STICKY NAVBAR ON SCROLL
================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "#0b3d25";
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";
    } else {
        navbar.style.background = "#0f5132";
        navbar.style.boxShadow = "none";
    }
});


/* ===============================
   COUNTER ANIMATION (ON VIEW)
================================= */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute("data-target");
            let count = 0;
            const speed = target / 150;

            const updateCounter = () => {
                if (count < target) {
                    count += speed;
                    counter.innerText = Math.ceil(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.6 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});


/* ===============================
   SCROLL REVEAL ANIMATION
================================= */

const revealElements = document.querySelectorAll(
    ".path-card, .course-card, .testimonial-card, .pricing-card, .step, .community-grid div"
);

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.8s ease";
    revealObserver.observe(el);
});


/* ===============================
   ACTIVE NAV LINK ON SCROLL
================================= */

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active-link");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active-link");
        }
    });
});


/* ===============================
   BUTTON MICRO INTERACTION
================================= */

const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");

buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.05)";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});


/* ===============================
   PRICING CARD POP EFFECT
================================= */

const pricingCards = document.querySelectorAll(".pricing-card");

pricingCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "scale(1.05)";
        card.style.boxShadow = "0 25px 60px rgba(0,0,0,0.2)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
        card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.05)";
    });
});


/* ===============================
   SMOOTH SCROLL OFFSET FIX
================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: "smooth"
            });
        }
    });
});