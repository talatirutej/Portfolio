/* ═══════════════════════════════════════════════════════════
   scroll.js — progress bar · nav highlight · scroll reveal
═══════════════════════════════════════════════════════════ */
(function () {

  /* ── Progress bar ── */
  const fill    = document.getElementById('scroll-progress-fill');
  const topbar  = document.querySelector('.topbar');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const height    = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = height > 0 ? (scrollTop / height) * 100 : 0;
    if (fill) fill.style.width = pct + '%';
    if (topbar) topbar.classList.toggle('scrolled', scrollTop > 20);
  }

  /* ── Active nav link ── */
  const navLinks = document.querySelectorAll('.topbar__nav a[href^="#"]');
  const sections = [];

  navLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, a });
  });

  function updateNav() {
    const mid = window.scrollY + window.innerHeight / 3;
    let current = null;
    sections.forEach(({ id, el }) => {
      if (el.offsetTop <= mid) current = id;
    });
    navLinks.forEach(a => a.classList.remove('active'));
    if (current) {
      const link = sections.find(s => s.id === current);
      if (link) link.a.classList.add('active');
    }
  }

  /* ── Smooth scroll for all #hash nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Scroll-reveal via IntersectionObserver ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        /* Unobserve after reveal for performance */
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
  });

  document.querySelectorAll('.reveal, .reveal--left, .reveal--scale')
    .forEach(el => revealObserver.observe(el));

  /* ── Throttled scroll handler ── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
  updateNav();

  /* ── Greeting typewriter in topbar ── */
  const greetEl = document.getElementById('topbar-greeting');
  if (greetEl) {
    const h = new Date().getHours();
    const greeting =
      h >= 5  && h < 12 ? 'Good morning'   :
      h >= 12 && h < 17 ? 'Good afternoon' :
                          'Good evening';
    const full = `${greeting} — welcome`;
    let i = 0;
    greetEl.classList.add('type-cursor');
    const tick = () => {
      if (i < full.length) {
        greetEl.textContent = full.slice(0, ++i);
        setTimeout(tick, 38);
      } else {
        /* Remove cursor after typing completes */
        setTimeout(() => greetEl.classList.remove('type-cursor'), 1800);
      }
    };
    setTimeout(tick, 400);
  }

  /* ── Stat counter animation ── */
  function animateCount(el, target, suffix = '', duration = 900) {
    const start     = performance.now();
    const isDecimal = target !== Math.floor(target);
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      const current  = eased * target;
      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.round(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Trigger counters when hero stats enter view */
  const statNums = document.querySelectorAll('[data-count]');
  if (statNums.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObs.observe(el));
  }

})();
