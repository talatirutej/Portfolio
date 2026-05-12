/* ═══════════════════════════════════════════════════════════
   interactions.js
   · Interest modal
   · Project filter chips
   · Card ripple effect
   · Feedback form (Formspree)
═══════════════════════════════════════════════════════════ */
(function () {

  /* ══════════════════════════════════════
     INTEREST MODAL
  ══════════════════════════════════════ */
  const modal     = document.getElementById('interest-modal');
  const modalTitle = modal?.querySelector('.modal-card__title');
  const modalText  = modal?.querySelector('.modal-card__text');
  const modalClose = modal?.querySelector('.modal-card__close');

  function openModal(title, text) {
    if (!modal) return;
    modalTitle.textContent = title || '';
    modalText.textContent  = text  || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-title]').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.modalTitle, btn.dataset.modalText);
    });
  });

  modalClose?.addEventListener('click', closeModal);

  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  /* ══════════════════════════════════════
     PROJECT FILTER CHIPS
  ══════════════════════════════════════ */
  const filterBtns  = document.querySelectorAll('[data-filter]');
  const projCards   = document.querySelectorAll('[data-tags]');

  function applyFilter(active) {
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === active);
    });

    projCards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
      const show = active === 'all' || tags.includes(active);
      card.style.display = show ? '' : 'none';

      /* Animate in if newly shown */
      if (show) {
        card.classList.remove('is-visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('is-visible'));
        });
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  /* Default: show all */
  applyFilter('all');

  /* ══════════════════════════════════════
     CARD RIPPLE EFFECT
  ══════════════════════════════════════ */
  document.querySelectorAll('.ripple-host').forEach(host => {
    host.addEventListener('pointerdown', e => {
      const rect  = host.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height) * 1.8;
      const x     = e.clientX - rect.left - size / 2;
      const y     = e.clientY - rect.top  - size / 2;

      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      Object.assign(wave.style, {
        width:  size + 'px',
        height: size + 'px',
        left:   x    + 'px',
        top:    y    + 'px',
      });

      host.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });

  /* ══════════════════════════════════════
     FEEDBACK FORM
  ══════════════════════════════════════ */
  const form       = document.getElementById('feedback-form');
  const statusEl   = document.getElementById('feedback-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;

      btn.disabled    = true;
      btn.textContent = 'Sending…';
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'feedback-status'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.reset();
          if (statusEl) {
            statusEl.textContent = '✓ Message sent — thank you!';
            statusEl.className   = 'feedback-status success';
          }
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong. Try emailing directly.';
          statusEl.className   = 'feedback-status error';
        }
      } finally {
        btn.disabled    = false;
        btn.textContent = original;
      }
    });
  }

  /* ══════════════════════════════════════
     EXP CARD EXPAND / COLLAPSE
     Cards can have a .exp-card__more section toggled
  ══════════════════════════════════════ */
  document.querySelectorAll('[data-expand-btn]').forEach(btn => {
    const targetId = btn.dataset.expandBtn;
    const target   = document.getElementById(targetId);
    if (!target) return;

    target.style.display = 'none';
    let open = false;

    btn.addEventListener('click', () => {
      open = !open;
      target.style.display = open ? '' : 'none';
      btn.textContent = open ? 'Show less ↑' : btn.dataset.expandLabel || 'Read more ↓';
      btn.setAttribute('aria-expanded', open);

      if (open) {
        requestAnimationFrame(() =>
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        );
      }
    });
  });

  /* ══════════════════════════════════════
     FOCUS HIGHLIGHT for project chips → cards
  ══════════════════════════════════════ */
  document.querySelectorAll('[data-focus-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.focusTarget);
      if (!target) return;

      /* Remove highlight from any existing focused card */
      document.querySelectorAll('.card.is-focused, .proj-card.is-focused')
        .forEach(el => el.classList.remove('is-focused'));

      target.classList.add('is-focused');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => target.classList.remove('is-focused'), 1800);
    });
  });

})();
