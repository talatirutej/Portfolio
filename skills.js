/* ═══════════════════════════════════════════════════════════
   skills.js — radial ring draw animation
   Triggered when the skills section enters the viewport
═══════════════════════════════════════════════════════════ */
(function () {

  function initRings() {
    document.querySelectorAll('.skill-ring[data-pct]').forEach((ring, i) => {
      const pct   = Number(ring.dataset.pct) || 0;
      const cbar  = ring.querySelector('.cbar');
      const pctEl = ring.querySelector('.skill-ring__pct');
      if (!cbar) return;

      const r             = Number(cbar.getAttribute('r')) || 44;
      const circumference = 2 * Math.PI * r;

      /* Set initial full-hidden state */
      cbar.style.strokeDasharray  = circumference;
      cbar.style.strokeDashoffset = circumference;

      /* Observer: draw only once when visible */
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          /* Stagger each ring by 80ms */
          const delay = i * 80;

          setTimeout(() => {
            cbar.style.strokeDashoffset =
              ((100 - pct) / 100) * circumference;
          }, delay);

          /* Animate the percentage number */
          if (pctEl) {
            const duration = 900;
            const start    = performance.now() + delay;
            let current    = 0;
            const tick = (t) => {
              if (t < start) return requestAnimationFrame(tick);
              const progress = Math.min((t - start) / duration, 1);
              const eased    = 1 - Math.pow(1 - progress, 3);
              const val      = Math.round(eased * pct);
              if (val !== current) {
                current = val;
                pctEl.textContent = val + '%';
              }
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }

          obs.unobserve(ring);
        });
      }, { threshold: 0.2 });

      obs.observe(ring);
    });
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRings);
  } else {
    initRings();
  }

})();
