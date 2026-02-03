document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     HELPERS
  ========================================================= */
  const root = document.documentElement;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
    };
  };

  /* =========================================================
     RADIAL TECHNICAL SKILLS
  ========================================================= */
  document.querySelectorAll(".skills-soft li").forEach((li, i) => {
    const pct = Number(li.dataset.percent || 0);
    const cbar = li.querySelector(".cbar");
    const small = li.querySelector("small");
    if (!cbar) return;

    const r = Number(cbar.getAttribute("r")) || 45;
    const circumference = 2 * Math.PI * r;

    cbar.style.strokeDasharray = `${circumference}`;
    cbar.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
      cbar.style.strokeDashoffset = `${((100 - pct) / 100) * circumference}`;
    }, i * 140);

    if (small) {
      let current = 0;
      const duration = 900;
      const start = performance.now() + i * 140;

      const tick = (t) => {
        if (t < start) return requestAnimationFrame(tick);
        const p = Math.min((t - start) / duration, 1);
        const val = Math.round(p * pct);

        if (val !== current) {
          current = val;
          small.textContent = `${val}%`;
        }
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  });

  /* =========================================================
     PROJECT HIGHLIGHT CHIPS
  ========================================================= */
  const clearClasses = (selector, ...classes) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove(...classes));
  };

  document.querySelectorAll(".highlight-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      clearClasses(".project-block", "focus");
      clearClasses(".highlight-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("focus");
      void target.offsetWidth;
      target.classList.add("focus");

      setTimeout(() => target.classList.remove("focus"), 1200);
    });
  });

  /* =========================================================
     LEADERSHIP CHIPS
  ========================================================= */
  document.querySelectorAll(".lead-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(`.lead-block[data-lead="${btn.dataset.lead}"]`);
      if (!target) return;

      clearClasses(".lead-block", "focus");
      clearClasses(".lead-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("focus");
      void target.offsetWidth;
      target.classList.add("focus");

      setTimeout(() => target.classList.remove("focus"), 1200);
    });
  });

  /* =========================================================
     INTEREST MODAL
  ========================================================= */
  const modal = document.getElementById("interestModal");
  if (modal) {
    const title = modal.querySelector(".interest-modal__title");
    const text = modal.querySelector(".interest-modal__text");
    const closeBtn = modal.querySelector(".interest-modal__close");
    const backdrop = modal.querySelector(".interest-modal__backdrop");

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".interest-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (title) title.textContent = btn.dataset.title || "";
        if (text) text.textContent = btn.dataset.text || "";
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* =========================================================
     FEEDBACK FORM (FORMSPREE)
  ========================================================= */
  const form = document.querySelector(".feedback-form");
  const status = document.getElementById("feedbackStatus");

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "Sending…";
      status.style.opacity = "0.9";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          status.textContent = "Thank you for your feedback. Your message has been sent.";
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
        }
      } catch {
        status.textContent = "Network error. Please try again later.";
      }
    });
  }

  /* =========================================================
     GREETING + TYPING (ONE SINGLE CONTROLLER)
     - Types normal greeting on load
     - If scroll >= 90%: types thank-you message
     - If scroll < 90%: types time greeting again
  ========================================================= */
  const greetingEl = document.getElementById("time-greeting");

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Prevent “retyping” if same message requested repeatedly
  let lastGreetingText = "";
  let typingTimer = null;

  const typeText = (el, text, speed = 35) => {
    if (!el) return;
    if (text === lastGreetingText) return;

    lastGreetingText = text;

    // stop any existing typing
    if (typingTimer) clearTimeout(typingTimer);

    el.textContent = "";
    el.classList.add("typing");

    let i = 0;
    const step = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        typingTimer = setTimeout(step, speed);
      } else {
        el.classList.remove("typing");
        typingTimer = null;
      }
    };
    step();
  };

  const normalGreeting = () => `${getTimeGreeting()}, welcome to my portfolio!`;
  const endGreeting = () => `Thank you for visiting my page!`;

  if (greetingEl) {
    typeText(greetingEl, normalGreeting(), 35);
  }

  /* =========================================================
     THEME: AUTO + TOGGLE (3 modes)
     - Auto: light (morning), graphite (afternoon), dark (evening/night)
     - Toggle cycles light -> graphite -> dark
     - Saves override; right-click / long-press resets to auto
  ========================================================= */
  const themeBtn = document.getElementById("theme-toggle");
  const STORAGE_KEY = "theme-override"; // "light" | "graphite" | "dark" | null

  const getAutoTheme = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "light";
    if (h >= 12 && h < 17) return "graphite";
    return "dark";
  };

  const resolvedTheme = () => root.getAttribute("data-theme") || "graphite";

  const applyTheme = (theme) => {
    if (theme === "graphite") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);

    if (themeBtn) {
      const label = theme === "graphite" ? "GRAPHITE" : theme.toUpperCase();
      themeBtn.title = `Theme: ${label} (click to change)`;
      themeBtn.setAttribute("aria-label", `Theme: ${label}. Click to change.`);
    }
  };

  const saveOverride = (theme) => localStorage.setItem(STORAGE_KEY, theme);

  const clearOverride = () => {
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(getAutoTheme());
  };

  // Init theme
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "graphite") {
    applyTheme(saved);
  } else {
    applyTheme(getAutoTheme());
  }

  // Auto updates only when no override
  setInterval(() => {
    const hasOverride = !!localStorage.getItem(STORAGE_KEY);
    if (hasOverride) return;

    const next = getAutoTheme();
    const cur = resolvedTheme();
    if (cur !== next) applyTheme(next);
  }, 60_000);

  // Toggle click
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = resolvedTheme();
      const next = cur === "light" ? "graphite" : cur === "graphite" ? "dark" : "light";
      applyTheme(next);
      saveOverride(next);
    });

    // Reset to auto: right click
    themeBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      clearOverride();
    });

    // Reset to auto: long press
    let pressTimer = null;
    themeBtn.addEventListener(
      "touchstart",
      () => {
        pressTimer = setTimeout(() => clearOverride(), 550);
      },
      { passive: true }
    );
    themeBtn.addEventListener("touchend", () => {
      if (pressTimer) clearTimeout(pressTimer);
    });
  }

  /* =========================================================
     SCROLL PROGRESS BAR + GREETING SYNC
     - Green -> Yellow -> Red
     - At >=90% scroll: switch greeting to thank-you
  ========================================================= */
  const bar = document.getElementById("scroll-progress");
  let endShown = false;

  const updateScroll = () => {
    if (!bar) return;

    const scrollTop = window.scrollY || 0;
    const height = document.documentElement.scrollHeight - window.innerHeight;

    // Avoid divide-by-zero
    const progress = height > 0 ? clamp((scrollTop / height) * 100, 0, 100) : 0;

    bar.style.width = `${progress}%`;

    if (progress < 50) {
      bar.style.background = "#2ecc71";
      bar.style.boxShadow = "none";
    } else if (progress < 90) {
      bar.style.background = "#fdd835";
      bar.style.boxShadow = "none";
    } else {
      bar.style.background = "#e53935";
      bar.style.boxShadow = "0 0 10px rgba(229,57,53,.6)";
    }

    // Greeting sync
    if (greetingEl) {
      if (progress >= 90 && !endShown) {
        typeText(greetingEl, endGreeting(), 28);
        endShown = true;
      } else if (progress < 90 && endShown) {
        typeText(greetingEl, normalGreeting(), 35);
        endShown = false;
      }
    }
  };

  const onScroll = rafThrottle(updateScroll);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();
});
/* =========================================
   SCROLL: progress bar + traffic lights
========================================= */
(function () {
  const fill = document.getElementById("scroll-progress");
  const traffic = document.getElementById("scroll-traffic");
  if (!fill || !traffic) return;

  const green = traffic.querySelector('.bulb[data-color="green"]');
  const yellow = traffic.querySelector('.bulb[data-color="yellow"]');
  const red = traffic.querySelector('.bulb[data-color="red"]');

  function setLights(stage){
    // clear all
    [green, yellow, red].forEach(b => b && b.classList.remove("is-on"));
    // stage on
    if (stage === "green" && green) green.classList.add("is-on");
    if (stage === "yellow" && yellow) yellow.classList.add("is-on");
    if (stage === "red" && red) red.classList.add("is-on");
  }

  function update(){
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0;

    fill.style.width = `${progress}%`;

    // stage thresholds
    if (progress < 50) {
      fill.style.background = "#2ecc71";
      setLights("green");
    } else if (progress < 90) {
      fill.style.background = "#fdd835";
      setLights("yellow");
    } else {
      fill.style.background = "#e53935";
      setLights("red");
    }
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", update);
  update();
})();
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     HELPERS
  ========================================================= */
  const root = document.documentElement;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
    };
  };

  /* =========================================================
     RADIAL TECHNICAL SKILLS
  ========================================================= */
  document.querySelectorAll(".skills-soft li").forEach((li, i) => {
    const pct = Number(li.dataset.percent || 0);
    const cbar = li.querySelector(".cbar");
    const small = li.querySelector("small");
    if (!cbar) return;

    const r = Number(cbar.getAttribute("r")) || 45;
    const circumference = 2 * Math.PI * r;

    cbar.style.strokeDasharray = `${circumference}`;
    cbar.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
      cbar.style.strokeDashoffset = `${((100 - pct) / 100) * circumference}`;
    }, i * 140);

    if (small) {
      let current = 0;
      const duration = 900;
      const start = performance.now() + i * 140;

      const tick = (t) => {
        if (t < start) return requestAnimationFrame(tick);
        const p = Math.min((t - start) / duration, 1);
        const val = Math.round(p * pct);

        if (val !== current) {
          current = val;
          small.textContent = `${val}%`;
        }
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  });

  /* =========================================================
     PROJECT HIGHLIGHT CHIPS
  ========================================================= */
  const clearClasses = (selector, ...classes) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove(...classes));
  };

  document.querySelectorAll(".highlight-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      clearClasses(".project-block", "focus");
      clearClasses(".highlight-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("focus");
      void target.offsetWidth;
      target.classList.add("focus");

      setTimeout(() => target.classList.remove("focus"), 1200);
    });
  });

  /* =========================================================
     LEADERSHIP CHIPS
  ========================================================= */
  document.querySelectorAll(".lead-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(`.lead-block[data-lead="${btn.dataset.lead}"]`);
      if (!target) return;

      clearClasses(".lead-block", "focus");
      clearClasses(".lead-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("focus");
      void target.offsetWidth;
      target.classList.add("focus");

      setTimeout(() => target.classList.remove("focus"), 1200);
    });
  });

  /* =========================================================
     INTEREST MODAL
  ========================================================= */
  const modal = document.getElementById("interestModal");
  if (modal) {
    const title = modal.querySelector(".interest-modal__title");
    const text = modal.querySelector(".interest-modal__text");
    const closeBtn = modal.querySelector(".interest-modal__close");
    const backdrop = modal.querySelector(".interest-modal__backdrop");

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".interest-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (title) title.textContent = btn.dataset.title || "";
        if (text) text.textContent = btn.dataset.text || "";
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* =========================================================
     FEEDBACK FORM (FORMSPREE)
  ========================================================= */
  const form = document.querySelector(".feedback-form");
  const status = document.getElementById("feedbackStatus");

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "Sending…";
      status.style.opacity = "0.9";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          status.textContent = "Thank you for your feedback. Your message has been sent.";
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
        }
      } catch {
        status.textContent = "Network error. Please try again later.";
      }
    });
  }

  /* =========================================================
     GREETING + TYPING (ONE SINGLE CONTROLLER)
     - Types normal greeting on load
     - If scroll >= 90%: types thank-you message
     - If scroll < 90%: types time greeting again
  ========================================================= */
  const greetingEl = document.getElementById("time-greeting");

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Prevent “retyping” if same message requested repeatedly
  let lastGreetingText = "";
  let typingTimer = null;

  const typeText = (el, text, speed = 35) => {
    if (!el) return;
    if (text === lastGreetingText) return;

    lastGreetingText = text;

    // stop any existing typing
    if (typingTimer) clearTimeout(typingTimer);

    el.textContent = "";
    el.classList.add("typing");

    let i = 0;
    const step = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        typingTimer = setTimeout(step, speed);
      } else {
        el.classList.remove("typing");
        typingTimer = null;
      }
    };
    step();
  };

  const normalGreeting = () => `${getTimeGreeting()}, welcome to my portfolio!`;
  const endGreeting = () => `Thank you for visiting my page!`;

  if (greetingEl) {
    typeText(greetingEl, normalGreeting(), 35);
  }

  /* =========================================================
     THEME: AUTO + TOGGLE (3 modes)
     - Auto: light (morning), graphite (afternoon), dark (evening/night)
     - Toggle cycles light -> graphite -> dark
     - Saves override; right-click / long-press resets to auto
  ========================================================= */
  const themeBtn = document.getElementById("theme-toggle");
  const STORAGE_KEY = "theme-override"; // "light" | "graphite" | "dark" | null

  const getAutoTheme = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "light";
    if (h >= 12 && h < 17) return "graphite";
    return "dark";
  };

  const resolvedTheme = () => root.getAttribute("data-theme") || "graphite";

  const applyTheme = (theme) => {
    if (theme === "graphite") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);

    if (themeBtn) {
      const label = theme === "graphite" ? "GRAPHITE" : theme.toUpperCase();
      themeBtn.title = `Theme: ${label} (click to change)`;
      themeBtn.setAttribute("aria-label", `Theme: ${label}. Click to change.`);
    }
  };

  const saveOverride = (theme) => localStorage.setItem(STORAGE_KEY, theme);

  const clearOverride = () => {
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(getAutoTheme());
  };

  // Init theme
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "graphite") {
    applyTheme(saved);
  } else {
    applyTheme(getAutoTheme());
  }

  // Auto updates only when no override
  setInterval(() => {
    const hasOverride = !!localStorage.getItem(STORAGE_KEY);
    if (hasOverride) return;

    const next = getAutoTheme();
    const cur = resolvedTheme();
    if (cur !== next) applyTheme(next);
  }, 60_000);

  // Toggle click
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = resolvedTheme();
      const next = cur === "light" ? "graphite" : cur === "graphite" ? "dark" : "light";
      applyTheme(next);
      saveOverride(next);
    });

    // Reset to auto: right click
    themeBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      clearOverride();
    });

    // Reset to auto: long press
    let pressTimer = null;
    themeBtn.addEventListener(
      "touchstart",
      () => {
        pressTimer = setTimeout(() => clearOverride(), 550);
      },
      { passive: true }
    );
    themeBtn.addEventListener("touchend", () => {
      if (pressTimer) clearTimeout(pressTimer);
    });
  }

  /* =========================================================
     SCROLL PROGRESS BAR + GREETING SYNC
     - Green -> Yellow -> Red
     - At >=90% scroll: switch greeting to thank-you
  ========================================================= */
  const bar = document.getElementById("scroll-progress");
  let endShown = false;

  const updateScroll = () => {
    if (!bar) return;

    const scrollTop = window.scrollY || 0;
    const height = document.documentElement.scrollHeight - window.innerHeight;

    // Avoid divide-by-zero
    const progress = height > 0 ? clamp((scrollTop / height) * 100, 0, 100) : 0;

    bar.style.width = `${progress}%`;

    if (progress < 50) {
      bar.style.background = "#2ecc71";
      bar.style.boxShadow = "none";
    } else if (progress < 90) {
      bar.style.background = "#fdd835";
      bar.style.boxShadow = "none";
    } else {
      bar.style.background = "#e53935";
      bar.style.boxShadow = "0 0 10px rgba(229,57,53,.6)";
    }

    // Greeting sync
    if (greetingEl) {
      if (progress >= 90 && !endShown) {
        typeText(greetingEl, endGreeting(), 28);
        endShown = true;
      } else if (progress < 90 && endShown) {
        typeText(greetingEl, normalGreeting(), 35);
        endShown = false;
      }
    }
  };

  const onScroll = rafThrottle(updateScroll);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();
});
/* =========================================
   SCROLL: progress bar + traffic lights
========================================= */
(function () {
  const fill = document.getElementById("scroll-progress");
  const traffic = document.getElementById("scroll-traffic");
  if (!fill || !traffic) return;

  const green = traffic.querySelector('.bulb[data-color="green"]');
  const yellow = traffic.querySelector('.bulb[data-color="yellow"]');
  const red = traffic.querySelector('.bulb[data-color="red"]');

  function setLights(stage){
    // clear all
    [green, yellow, red].forEach(b => b && b.classList.remove("is-on"));
    // stage on
    if (stage === "green" && green) green.classList.add("is-on");
    if (stage === "yellow" && yellow) yellow.classList.add("is-on");
    if (stage === "red" && red) red.classList.add("is-on");
  }

  function update(){
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0;

    fill.style.width = `${progress}%`;

    // stage thresholds
    if (progress < 50) {
      fill.style.background = "#2ecc71";
      setLights("green");
    } else if (progress < 90) {
      fill.style.background = "#fdd835";
      setLights("yellow");
    } else {
      fill.style.background = "#e53935";
      setLights("red");
    }
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", update);
  update();
})();
