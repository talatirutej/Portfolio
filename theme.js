/* ═══════════════════════════════════════════════════════════
   theme.js — Material 3 theme system
   Auto theme by time-of-day | Persisted to localStorage
   Left-click cycles: dark → light → dark
   Right-click: reset to auto
═══════════════════════════════════════════════════════════ */
(function () {
  const KEY       = 'rt-theme';
  const THEMES    = ['dark', 'light'];
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('icon-theme');

  /* ── Auto theme based on hour ── */
  function getAutoTheme() {
    const h = new Date().getHours();
    return (h >= 6 && h < 19) ? 'light' : 'dark';
  }

  /* ── Apply theme to <html> ── */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    updateIcon(theme);
  }

  /* ── Sync icon to current theme ── */
  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'light'
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  }

  /* ── Load saved or auto ── */
  const saved = localStorage.getItem(KEY);
  applyTheme(saved && THEMES.includes(saved) ? saved : getAutoTheme());

  /* ── Auto-refresh every minute if no manual override ── */
  setInterval(() => {
    if (!localStorage.getItem(KEY)) applyTheme(getAutoTheme());
  }, 60_000);

  /* ── Toggle on click ── */
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(KEY, next);

      /* ripple feedback on button */
      themeBtn.classList.add('topbar__icon-btn--pressed');
      setTimeout(() => themeBtn.classList.remove('topbar__icon-btn--pressed'), 200);
    });

    /* Right-click = reset to auto */
    themeBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      localStorage.removeItem(KEY);
      applyTheme(getAutoTheme());
    });

    /* Tooltip title updates */
    themeBtn.addEventListener('mouseenter', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      themeBtn.title = `Theme: ${current.toUpperCase()} (click to toggle, right-click for auto)`;
    });
  }

  /* ── Expose for other modules ── */
  window.RT = window.RT || {};
  window.RT.theme = { apply: applyTheme, getAuto: getAutoTheme };
})();
