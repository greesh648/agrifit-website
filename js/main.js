document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  document.querySelectorAll('form[data-register-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = form.dataset.registerForm;
      const values = Object.fromEntries(new FormData(form).entries());
      const registrations = JSON.parse(localStorage.getItem('agrifitRegistrations') || '[]');
      registrations.push({ role, values, at: new Date().toISOString() });
      localStorage.setItem('agrifitRegistrations', JSON.stringify(registrations));

      const notice = form.parentElement.querySelector('.notice');
      if (notice) {
        notice.style.display = 'block';
        notice.textContent = `Registration captured for ${role}. Our team will activate your dashboard within 24 hours.`;
      }
      form.reset();
    });
  });
});
