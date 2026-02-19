document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  document.querySelectorAll('form[data-register-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = form.dataset.registerForm;
      const payload = Object.fromEntries(new FormData(form).entries());
      const entries = JSON.parse(localStorage.getItem('agrifitRegistrations') || '[]');
      entries.push({ role, payload, createdAt: new Date().toISOString() });
      localStorage.setItem('agrifitRegistrations', JSON.stringify(entries));
      const notice = form.parentElement.querySelector('.notice');
      if (notice) {
        notice.style.display = 'block';
        notice.textContent = `Thanks! ${role} request recorded. Team AgriFit will contact you shortly.`;
      }
      form.reset();
    });
  });

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



  document.querySelectorAll('.click-card[data-link]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, select, textarea')) return;
      const link = card.dataset.link;
      if (link) window.location.href = link;
    });
    card.style.cursor = 'pointer';
  });

  const courseData = [
    { id:'crop-1', sector:'crop', title:'Certificate Course in Plant Breeding', level:'Intermediate', mode:'Online', duration:'60 Hours', fee:'Free', provider:'Reliance Foundation Skilling Academy', language:'English', enrolled:'15142', outcomes:'Plant breeding essentials, marker-assisted selection, practical crop improvement workflows.' },
    { id:'crop-2', sector:'crop', title:'Soil Health & Nutrient Management', level:'Beginner', mode:'Hybrid', duration:'6 Weeks', fee:'₹1,499', provider:'AgriFit Academy', language:'English + Hindi', enrolled:'6842', outcomes:'Soil testing, nutrient plans, cost control and seasonal recommendation design.' },
    { id:'livestock-1', sector:'livestock', title:'Dairy Productivity Improvement', level:'Beginner', mode:'Online', duration:'5 Weeks', fee:'₹1,999', provider:'AgriFit Dairy Cell', language:'English', enrolled:'3920', outcomes:'Feed planning, milk yield tracking and disease prevention protocol.' },
    { id:'fpo-1', sector:'fpo', title:'FPO Governance & Compliance Leader', level:'Advanced', mode:'Hybrid', duration:'8 Weeks', fee:'₹4,500', provider:'AgriFit FPO School', language:'English', enrolled:'1240', outcomes:'Board governance, compliance calendar, financial controls and MIS practices.' },
    { id:'business-1', sector:'business', title:'Agri Enterprise Revenue Accelerator', level:'Advanced', mode:'Offline', duration:'10 Weeks', fee:'₹7,500', provider:'AgriFit Business Lab', language:'English', enrolled:'980', outcomes:'Revenue model design, procurement strategy and market expansion planning.' },
    { id:'graduate-1', sector:'graduate', title:'Agri Graduate Industry Readiness Bootcamp', level:'Intermediate', mode:'Online', duration:'6 Weeks', fee:'₹2,999', provider:'AgriFit Professional Track', language:'English', enrolled:'2100', outcomes:'Field diagnostics, communication, reporting and interview project portfolio.' },
    { id:'scheme-1', sector:'scheme', title:'Scheme Documentation & Approval Mastery', level:'Beginner', mode:'Online', duration:'4 Weeks', fee:'Free', provider:'AgriFit Scheme Desk', language:'English + Hindi', enrolled:'5120', outcomes:'Eligibility checks, document kits, application flow and follow-up systems.' }
  ];

  const renderCourseCatalog = () => {
    const grid = document.getElementById('courseGrid');
    if (!grid) return;
    const title = document.getElementById('courseCatalogTitle');
    const empty = document.getElementById('courseEmpty');
    const query = new URLSearchParams(window.location.search);
    const sector = query.get('sector') || 'all';
    const searchEl = document.getElementById('courseSearch');
    const levelEl = document.getElementById('courseLevel');
    const modeEl = document.getElementById('courseMode');

    if (title) title.textContent = sector === 'all' ? 'Explore Courses' : `Explore ${sector.toUpperCase()} Courses`;

    const paint = () => {
      const search = (searchEl?.value || '').toLowerCase().trim();
      const level = levelEl?.value || 'all';
      const mode = modeEl?.value || 'all';
      const filtered = courseData.filter(c => {
        const sectorOk = sector === 'all' || c.sector === sector;
        const levelOk = level === 'all' || c.level === level;
        const modeOk = mode === 'all' || c.mode === mode;
        const searchOk = !search || `${c.title} ${c.level} ${c.language}`.toLowerCase().includes(search);
        return sectorOk && levelOk && modeOk && searchOk;
      });

      grid.innerHTML = filtered.map(c => `
        <article class="course-card">
          <p class="small">${c.mode} · ${c.level}</p>
          <h3>${c.title}</h3>
          <p class="small">${c.provider}</p>
          <p><strong>${c.fee}</strong> · ${c.duration}</p>
          <a class="btn btn-primary" href="course-detail.html?id=${c.id}">View Details</a>
        </article>
      `).join('');

      empty.style.display = filtered.length ? 'none' : 'block';
    };

    [searchEl, levelEl, modeEl].forEach(el => el?.addEventListener('input', paint));
    [levelEl, modeEl].forEach(el => el?.addEventListener('change', paint));
    paint();
  };

  const renderCourseDetail = () => {
    const wrapper = document.getElementById('courseDetail');
    if (!wrapper) return;
    const id = new URLSearchParams(window.location.search).get('id');
    const c = courseData.find(x => x.id === id) || courseData[0];
    wrapper.innerHTML = `
      <div class="course-hero">
        <div>
          <p class="eyebrow">${c.mode} · ${c.level}</p>
          <h2>${c.title}</h2>
          <p class="small">${c.provider}</p>
          <p class="course-meta">${c.fee} · ${c.duration} · ${c.enrolled}+ enrolled · ${c.language}</p>
          <p>${c.outcomes}</p>
        </div>
        <div class="course-enroll card snapshot">
          <h3>Enroll in this Course</h3>
          <form data-register-form="Course Enrollment">
            <input type="hidden" name="course" value="${c.title}">
            <label>Full Name<input required name="name"></label>
            <label>Mobile Number<input required name="phone"></label>
            <label>Role<select name="role"><option>Farmer</option><option>FPO</option><option>Graduate</option><option>Business</option></select></label>
            <button class="btn btn-primary" type="submit">Enroll Now</button>
          </form>
          <div class="notice"></div>
        </div>
      </div>
      <div class="course-tabs">
        <article class="feature-card"><h3>Course Details</h3><p class="small">Structured modules, implementation assignments, and weekly checkpoints.</p></article>
        <article class="feature-card"><h3>Eligibility</h3><p class="small">Open to members with active profile and baseline registration.</p></article>
        <article class="feature-card"><h3>Certification</h3><p class="small">Certificate of completion after assessment + implementation proof.</p></article>
      </div>
    `;
  };

  renderCourseCatalog();
  renderCourseDetail();
});
