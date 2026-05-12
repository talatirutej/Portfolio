/* ═══════════════════════════════════════════════════════════════════
   enhancements.js
   M3 Crazy UI enhancements — runs AFTER all other scripts
   · Custom cursor          · Particle hero canvas
   · 3D card tilt           · Magnetic ripple on hover
   · Spotlight project cards · Text scramble on section heads
   · Glitch logo effect     · Staggered chip reveals
   · Section ghost numbers  · Parallax orbs
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ── */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let cx = 0, cy = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  (function animCursor() {
    rx += (cx - rx) * 0.18;
    ry += (cy - ry) * 0.18;
    dot.style.left  = cx + 'px';
    dot.style.top   = cy + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  /* Hovering state */
  document.querySelectorAll('a,button,.chip,.card,.proj-card,.exp-card,.lead-card,.interest-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });


  /* ── 2. PARTICLE HERO CANVAS ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    hero.prepend(canvas);

    const ctx  = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* Get CSS vars for colours */
    const style    = getComputedStyle(document.documentElement);
    const primary  = style.getPropertyValue('--md-primary').trim()  || '#7DD3FC';
    const tertiary = style.getPropertyValue('--md-tertiary').trim() || '#C4BFFF';
    const amber    = style.getPropertyValue('--md-amber').trim()    || '#FCD34D';
    const palette  = [primary, tertiary, amber];

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x  = Math.random() * W;
        this.y  = init ? Math.random() * H : H + 10;
        this.r  = Math.random() * 1.6 + 0.4;
        this.vx = (Math.random() - .5) * 0.3;
        this.vy = -(Math.random() * 0.6 + 0.2);
        this.life = 0;
        this.maxLife = Math.random() * 220 + 120;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.y < -10 || this.life > this.maxLife) this.reset();
      }
      draw() {
        const t = this.life / this.maxLife;
        const a = t < .15 ? t / .15 : t > .8 ? (1 - t) / .2 : 1;
        ctx.globalAlpha = a * 0.55;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    /* Connection lines */
    function drawConnections() {
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = primary;
      ctx.lineWidth   = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = dx * dx + dy * dy;
          if (d < 8000) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animParticles() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      ctx.globalAlpha = 1;
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animParticles);
    }
    animParticles();
  }


  /* ── 3. 3D TILT on cards ── */
  function addTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.classList.add('card-tilt', 'ripple-host');

      /* Add shine layer */
      if (!card.querySelector('.card-tilt__shine')) {
        const shine = document.createElement('div');
        shine.className = 'card-tilt__shine';
        card.appendChild(shine);
      }

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - .5;
        const y = (e.clientY - rect.top)  / rect.height - .5;
        card.style.transform =
          `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateY(-3px)`;

        /* Move spotlight */
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  addTilt('.proj-card');
  addTilt('.exp-card');
  addTilt('.lead-card');
  addTilt('.card');


  /* ── 4. MAGNETIC RIPPLE on interactive elements ── */
  document.querySelectorAll('.btn--filled,.btn--outlined').forEach(btn => {
    btn.addEventListener('mouseenter', e => {
      const rect = btn.getBoundingClientRect();
      const rip  = document.createElement('div');
      rip.className = 'mag-ripple';
      rip.style.left = (e.clientX - rect.left - 30) + 'px';
      rip.style.top  = (e.clientY - rect.top  - 30) + 'px';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(rip);
      rip.addEventListener('animationend', () => rip.remove());
    });
  });


  /* ── 5. TEXT SCRAMBLE on section titles ── */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';

  function scramble(el) {
    const original = el.textContent;
    let frame = 0;
    const totalFrames = 20;
    const interval = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (frame / totalFrames > i / original.length) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame > totalFrames) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 30);
  }

  /* Trigger on intersection */
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => scramble(e.target), 200);
        titleObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.section__title').forEach(el => titleObs.observe(el));


  /* ── 6. GLITCH on topbar logo hover ── */
  const logo = document.querySelector('.topbar__logo');
  if (logo) {
    const text = logo.textContent.trim();
    logo.dataset.text = text.split('').slice(0,2).join(''); /* "RT" part */
    logo.classList.add('glitch-host');
    /* Glitch only on the "RT" initials */
  }


  /* ── 7. PARALLAX ORBS on scroll ── */
  const orbs = document.querySelectorAll('.hero__orb');
  if (orbs.length) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = [0.12, 0.08, 0.15][i] || 0.1;
        orb.style.transform += ` translateY(${sy * speed}px)`;
      });
    }, { passive: true });
  }


  /* ── 8. SPOTLIGHT on project cards (mouse follow) ── */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });


  /* ── 9. SECTION GHOST NUMBERS ── */
  document.querySelectorAll('.section--numbered').forEach(sec => {
    const numEl = sec.querySelector('.section__num');
    if (!numEl) return;
    const ghost = document.createElement('div');
    ghost.className = 'section__ghost-num';
    ghost.textContent = numEl.textContent.replace(/[^0-9]/g, '').padStart(2,'0');
    sec.prepend(ghost);
  });

  const ghostObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('is-visible', e.isIntersecting);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section--numbered').forEach(el => ghostObs.observe(el));


  /* ── 10. STAGGERED chip reveal ── */
  document.querySelectorAll('.proj-card__footer').forEach(footer => {
    const chips = footer.querySelectorAll('.chip');
    chips.forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(8px)';
      chip.style.transition = `opacity .3s ${i * 60}ms, transform .3s ${i * 60}ms var(--ease-spring)`;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        chips.forEach(chip => {
          chip.style.opacity   = '1';
          chip.style.transform = 'translateY(0)';
        });
        obs.unobserve(footer);
      });
    }, { threshold: 0.3 });
    obs.observe(footer);
  });


  /* ── 11. HERO STAT — number roll animation ── */
  document.querySelectorAll('.hero__stat__num').forEach(el => {
    el.style.display = 'block';
    el.style.overflow = 'hidden';
  });


  /* ── 12. REVEAL section rules ── */
  const headObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section__head').forEach(el => headObs.observe(el));


  /* ── 13. FLOATING particles on card click ── */
  function burstParticles(el, x, y) {
    const rect   = el.getBoundingClientRect();
    const colors = ['var(--md-primary)', 'var(--md-tertiary)', 'var(--md-amber)'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.style.cssText = `
        position:fixed;
        left:${x}px; top:${y}px;
        width:6px; height:6px;
        border-radius:50%;
        background:${colors[i % colors.length]};
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        animation: particle-up .7s ${i * 40}ms ease-out forwards;
      `;
      /* Add randomized direction via transform */
      const angle  = (i / 8) * Math.PI * 2;
      const dist   = 40 + Math.random() * 30;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      p.animate([
        { transform: `translate(-50%,-50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], { duration: 600 + i * 50, easing: 'ease-out', fill: 'forwards' });
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  document.querySelectorAll('.btn--filled').forEach(btn => {
    btn.addEventListener('click', e => burstParticles(btn, e.clientX, e.clientY));
  });


  /* ── 14. AMBIENT MOUSE GLOW on hero ── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    document.querySelector('.hero')?.addEventListener('mousemove', e => {
      const rect = document.querySelector('.hero').getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      heroBg.style.background = `
        radial-gradient(ellipse 60% 50% at ${x}% ${y}%,
          color-mix(in srgb, var(--md-primary) 10%, transparent) 0%,
          transparent 55%),
        radial-gradient(ellipse 80% 70% at 70% 30%,
          color-mix(in srgb, var(--md-primary) 5%, transparent) 0%,
          transparent 65%),
        radial-gradient(ellipse 40% 30% at 85% 85%,
          color-mix(in srgb, var(--md-amber) 4%, transparent) 0%,
          transparent 50%)
      `;
    });
  }

})();
