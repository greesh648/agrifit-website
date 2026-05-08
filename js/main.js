document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('form[data-register-form]').forEach((form) => {
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

  const courseData = [
    { id: 'crop-1', sector: 'crop', emoji: '🌾', title: 'Plant Breeding Mastery', level: 'Intermediate', mode: 'Online', duration: '60 Hours', fee: 'Free', provider: 'AgriFit Academy', language: 'English', enrolled: '15142', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1100&q=80', outcomes: 'Plant breeding essentials, marker-assisted selection, practical crop improvement workflows.', benefits: ['Seed selection mastery', 'Higher yield planning', 'Field trial skills'] },
    { id: 'crop-2', sector: 'crop', emoji: '🧪', title: 'Soil Health & Nutrient Management', level: 'Beginner', mode: 'Hybrid', duration: '6 Weeks', fee: '₹1,499', provider: 'AgriFit Academy', language: 'English + Hindi', enrolled: '6842', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=80', outcomes: 'Soil testing, nutrient plans, cost control and seasonal recommendation design.', benefits: ['Soil report reading', 'Nutrient budgeting', 'Input cost reduction'] },
    { id: 'livestock-1', sector: 'livestock', emoji: '🐄', title: 'Dairy Productivity Improvement', level: 'Beginner', mode: 'Online', duration: '5 Weeks', fee: '₹1,999', provider: 'AgriFit Dairy Cell', language: 'English', enrolled: '3920', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1100&q=80', outcomes: 'Feed planning, milk yield tracking and disease prevention protocol.', benefits: ['Milk yield optimization', 'Animal health protocol', 'Farm profitability'] },
    { id: 'fpo-1', sector: 'fpo', emoji: '🏢', title: 'FPO Governance & Compliance Leader', level: 'Advanced', mode: 'Hybrid', duration: '8 Weeks', fee: '₹4,500', provider: 'AgriFit FPO School', language: 'English', enrolled: '1240', outcomes: 'Board governance, compliance calendar, financial controls and MIS practices.' },
  ];

  const renderCourseCatalog = () => {
    const grid = document.getElementById('courseGrid');
    if (!grid) return;
    const title = document.getElementById('courseCatalogTitle');
    const empty = document.getElementById('courseEmpty');
    const sector = new URLSearchParams(window.location.search).get('sector') || 'all';
    const searchEl = document.getElementById('courseSearch');
    const levelEl = document.getElementById('courseLevel');
    const modeEl = document.getElementById('courseMode');

    if (title) title.textContent = sector === 'all' ? 'Explore Courses' : `Explore ${sector.toUpperCase()} Courses`;

    const paint = () => {
      const search = (searchEl?.value || '').toLowerCase().trim();
      const level = levelEl?.value || 'all';
      const mode = modeEl?.value || 'all';
      const filtered = courseData.filter((c) => {
        const sectorOk = sector === 'all' || c.sector === sector;
        const levelOk = level === 'all' || c.level === level;
        const modeOk = mode === 'all' || c.mode === mode;
        const searchOk = !search || `${c.title} ${c.level} ${c.language}`.toLowerCase().includes(search);
        return sectorOk && levelOk && modeOk && searchOk;
      });

      grid.innerHTML = filtered.map((c) => `
        <article class="course-card">
          <div class="course-cartoon">${c.emoji || '🌱'}</div>
          <p class="small">${c.mode} · ${c.level}</p>
          <h3>${c.title}</h3>
          <p class="small">${c.provider}</p>
          <p><strong>${c.fee}</strong> · ${c.duration}</p>
          <a class="btn btn-primary" href="course-detail.html?id=${c.id}">View Details</a>
        </article>
      `).join('');

      empty.style.display = filtered.length ? 'none' : 'block';
    };

    [searchEl, levelEl, modeEl].forEach((el) => el?.addEventListener('input', paint));
    [levelEl, modeEl].forEach((el) => el?.addEventListener('change', paint));
    paint();
  };

  const renderCourseDetail = () => {
    const wrapper = document.getElementById('courseDetail');
    if (!wrapper) return;
    const id = new URLSearchParams(window.location.search).get('id');
    const c = courseData.find((x) => x.id === id) || courseData[0];
    wrapper.innerHTML = `
      <div class="course-hero">
        <div>
          <p class="eyebrow">${c.mode} · ${c.level}</p>
          <h2>${c.emoji || '🌱'} ${c.title}</h2>
          <p class="small">${c.provider}</p>
          <p class="course-meta">${c.fee} · ${c.duration} · ${c.enrolled}+ enrolled · ${c.language}</p>
          <img class='rounded-img' src='${c.image || 'assets/images/farm.jpg'}' alt='${c.title}' />
          <p>${c.outcomes}</p>
          <ul class='check-list'>${(c.benefits || ['Hands-on assignments', 'Mentor support', 'Certificate of completion']).map((b) => `<li>${b}</li>`).join('')}</ul>
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
      </div>`;
  };

  const initPayment = () => {
    const form = document.getElementById('paymentForm');
    if (!form) return;
    const status = document.getElementById('paymentStatus');
    const plan = new URLSearchParams(window.location.search).get('plan') || 'starter';
    const planLabel = document.getElementById('planLabel');
    if (planLabel) planLabel.textContent = plan.toUpperCase();

    const planAmount = { starter: 149900, pro: 299900, global: 599900 };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'block';
      status.textContent = 'Creating secure payment order...';
      try {
        const config = await fetch('http://localhost:8787/api/config').then((r) => r.json());
        const order = await fetch('http://localhost:8787/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: planAmount[plan] || planAmount.starter, receipt: `agrifit_${Date.now()}` }),
        }).then((r) => r.json());

        if (!order.id || !window.Razorpay) throw new Error('Razorpay init failed. Start API server and check keys.');

        const fd = new FormData(form);
        const opts = {
          key: config.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'AgriFit',
          description: `${plan.toUpperCase()} Membership`,
          order_id: order.id,
          prefill: { name: fd.get('name'), email: fd.get('email'), contact: fd.get('mobile') },
          theme: { color: '#0b6b3a' },
          handler: async function (response) {
            const verify = await fetch('http://localhost:8787/api/verify-payment', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response),
            }).then((r) => r.json());
            status.textContent = verify.verified ? `Payment successful: ${response.razorpay_payment_id}` : 'Payment received but verification failed.';
          },
        };
        const rzp = new window.Razorpay(opts);
        rzp.on('payment.failed', function (resp) {
          status.textContent = `Payment failed: ${resp.error.description}`;
        });
        rzp.open();
      } catch (err) {
        status.textContent = `Payment setup error: ${err.message}`;
      }
    });
  };

  const injectSevaBot = () => {
    if (document.getElementById('sevaBot')) return;
    const box = document.createElement('div');
    box.id = 'sevaBot';
    box.innerHTML = `<button class="seva-toggle"><span class="seva-emoji">🌾</span> AgriFit Seva</button><div class="seva-panel"><h4>AgriFit Seva</h4><div class="seva-messages" id="sevaMessages"><div class="seva-msg bot">Namaste! Ask about courses, schemes, membership, or payment.</div></div><div class="seva-input"><input id="sevaInput" placeholder="Type your message..."><button id="sevaSend" class="btn btn-primary" type="button">Send</button></div></div>`;
    document.body.appendChild(box);
    box.querySelector('.seva-toggle').addEventListener('click', () => box.classList.toggle('open'));
    box.classList.add('open');
    const send = () => {
      const input = box.querySelector('#sevaInput');
      const messages = box.querySelector('#sevaMessages');
      const text = input.value.trim();
      if (!text) return;
      messages.innerHTML += `<div class="seva-msg user">${text}</div>`;
      let reply = 'For consultation call 7996213245 or email kalwal432@gmail.com.';
      const t = text.toLowerCase();
      if (t.includes('payment')) reply = 'Open Membership → choose plan → Payment page. Live gateway keys can be added next.';
      if (t.includes('scheme')) reply = 'Open Scheme Hub for PM-KISAN, PMFBY, AIF and eNAM steps with official links.';
      if (t.includes('course')) reply = 'Open Programs/Courses page and choose your sector, then click course details.';
      messages.innerHTML += `<div class="seva-msg bot">${reply}</div>`;
      messages.scrollTop = messages.scrollHeight;
      input.value = '';
    };
    box.querySelector('#sevaSend').addEventListener('click', send);
    box.querySelector('#sevaInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  };


  const initLanguageDropdown = () => {
    const sel = document.getElementById('languageSelect');
    if (!sel) return;
    const dict = {
      en: { hero_title: 'Train. Transform. Track. Grow.', hero_sub: 'Built for farmers, FPOs, agri graduates, dealers, and partners who want measurable outcomes — not one-time training.', nav_home: 'Home', nav_programs: 'Programs', nav_membership: 'Membership', market_title: 'Program browsing with smart filters', journey_title: 'Role-based premium user experience', flow_title: 'Simple 4-step growth flow' },
      hi: { hero_title: 'प्रशिक्षण लें। परिवर्तन करें। ट्रैक करें। बढ़ें।', hero_sub: 'किसान, FPO, एग्री ग्रेजुएट, डीलर और पार्टनर के लिए परिणाम-आधारित प्लेटफ़ॉर्म।', nav_home: 'होम', nav_programs: 'प्रोग्राम', nav_membership: 'मेंबरशिप', market_title: 'स्मार्ट फ़िल्टर के साथ प्रोग्राम ब्राउज़िंग', journey_title: 'भूमिका आधारित प्रीमियम अनुभव', flow_title: 'सरल 4-स्टेप ग्रोथ फ्लो' },
      kn: { hero_title: 'ತರಬೇತಿ. ರೂಪಾಂತರ. ಟ್ರ್ಯಾಕ್. ಬೆಳವಣಿಗೆ.', hero_sub: 'ರೈತರು, FPO, ಕೃಷಿ ಪದವೀಧರರು ಮತ್ತು ಪಾಲುದಾರರಿಗಾಗಿ ಫಲಿತಾಂಶ-ಆಧಾರಿತ ವೇದಿಕೆ.', nav_home: 'ಮುಖಪುಟ', nav_programs: 'ಕಾರ್ಯಕ್ರಮಗಳು', nav_membership: 'ಸದಸ್ಯತ್ವ', market_title: 'ಸ್ಮಾರ್ಟ್ ಫಿಲ್ಟರ್‌ಗಳೊಂದಿಗೆ ಕೋರ್ಸ್ ವೀಕ್ಷಣೆ', journey_title: 'ಪಾತ್ರಾಧಾರಿತ ಪ್ರೀಮಿಯಂ ಅನುಭವ', flow_title: 'ಸರಳ 4 ಹಂತಗಳ ಬೆಳವಣಿಗೆ' }
    };
    const apply = (lang) => {
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const k = el.dataset.i18n;
        if (dict[lang]?.[k]) el.textContent = dict[lang][k];
      });
      localStorage.setItem('agrifit_lang', lang);
    };
    sel.value = localStorage.getItem('agrifit_lang') || 'en';
    apply(sel.value);
    sel.addEventListener('change', () => apply(sel.value));
  };

  renderCourseCatalog();
  renderCourseDetail();
  initPayment();
  initLanguageDropdown();
  injectSevaBot();
});
