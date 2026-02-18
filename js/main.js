document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
 codex/improve-website-functionality-and-design-27fnno
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));

codex/improve-website-functionality-and-design-hlnbm7
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
 main
 main
    });
  }

  document.querySelectorAll('form[data-register-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = form.dataset.registerForm;
 codex/improve-website-functionality-and-design-27fnno

 codex/improve-website-functionality-and-design-hlnbm7
 main
      const payload = Object.fromEntries(new FormData(form).entries());
      const entries = JSON.parse(localStorage.getItem('agrifitRegistrations') || '[]');
      entries.push({ role, payload, createdAt: new Date().toISOString() });
      localStorage.setItem('agrifitRegistrations', JSON.stringify(entries));
      const notice = form.parentElement.querySelector('.notice');
      if (notice) {
        notice.style.display = 'block';
        notice.textContent = `Thanks! ${role} request recorded. Team AgriFit will contact you shortly.`;
 codex/improve-website-functionality-and-design-27fnno


      const values = Object.fromEntries(new FormData(form).entries());
      const registrations = JSON.parse(localStorage.getItem('agrifitRegistrations') || '[]');
      registrations.push({ role, values, at: new Date().toISOString() });
      localStorage.setItem('agrifitRegistrations', JSON.stringify(registrations));

      const notice = form.parentElement.querySelector('.notice');
      if (notice) {
        notice.style.display = 'block';
        notice.textContent = `Registration captured for ${role}. Our team will activate your dashboard within 24 hours.`;
 main
 main
      }
      form.reset();
    });
  });
 codex/improve-website-functionality-and-design-27fnno

 codex/improve-website-functionality-and-design-hlnbm7
 main

  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * progress).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.35 });
  counters.forEach(c => observer.observe(c));

  const levelFilter = document.getElementById('programFilterLevel');
  const typeFilter = document.getElementById('programFilterType');
  const cards = document.querySelectorAll('#programCards .program-card');
  const applyFilters = () => {
    const level = levelFilter?.value || 'all';
    const type = typeFilter?.value || 'all';
    cards.forEach(card => {
      const levelOk = level === 'all' || card.dataset.level === level;
      const typeOk = type === 'all' || card.dataset.type === type;
      card.style.display = (levelOk && typeOk) ? 'block' : 'none';
    });
  };
  if (levelFilter && typeFilter) {
    levelFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
  }

  document.querySelectorAll('.countdown').forEach(el => {
    const deadline = new Date(el.dataset.deadline || '').getTime();
    if (!deadline) return;
    const update = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        el.textContent = 'Registration closes today!';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      el.textContent = `${days}d ${hrs}h ${mins}m left`;
    };
    update();
    setInterval(update, 60000);
  });
 codex/improve-website-functionality-and-design-27fnno


 main
 main
});
