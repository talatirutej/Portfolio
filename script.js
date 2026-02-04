console.log("script.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     HELPERS
  ========================================================= */
  const root = document.documentElement;

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
     CHIP NAVIGATION
  ========================================================= */
  const clearClasses = (selector, ...classes) => {
    document.querySelectorAll(selector).forEach((el) =>
      el.classList.remove(...classes)
    );
  };

  document.querySelectorAll(".highlight-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      clearClasses(".project-block", "focus");
      clearClasses(".highlight-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("focus");
      setTimeout(() => target.classList.remove("focus"), 1200);
    });
  });

  document.querySelectorAll(".lead-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(
        `.lead-block[data-lead="${btn.dataset.lead}"]`
      );
      if (!target) return;

      clearClasses(".lead-block", "focus");
      clearClasses(".lead-chip", "active");
      btn.classList.add("active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
      title.textContent = btn.dataset.title || "";
      text.textContent = btn.dataset.text || "";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}
/* =========================================================
   THEME: AUTO + TOGGLE
========================================================= */
const themeBtn = document.getElementById("theme-toggle");
const STORAGE_KEY = "theme-override";

const getAutoTheme = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "light";
  if (h >= 12 && h < 17) return "graphite";
  return "dark";
};

const applyTheme = (theme) => {
  if (theme === "graphite") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

const saved = localStorage.getItem(STORAGE_KEY);
applyTheme(saved || getAutoTheme());

// auto-update every minute if no override
setInterval(() => {
  if (!localStorage.getItem(STORAGE_KEY)) applyTheme(getAutoTheme());
}, 60000);

// toggle click
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "graphite";
    const next = cur === "light" ? "graphite" : cur === "graphite" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // right-click reset to auto
  themeBtn.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(getAutoTheme());
  });
}

  /* =========================================================
     GREETING + TYPING
  ========================================================= */
  const greetingEl = document.getElementById("time-greeting");

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    return "Good evening";
  };

  const typeText = (el, text, speed = 35) => {
    if (!el) return;
    el.textContent = "";
    let i = 0;
    const step = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(step, speed);
      }
    };
    step();
  };

  typeText(greetingEl, `${getTimeGreeting()}, welcome to my portfolio!`);

  /* =========================================================
     SCROLL: progress bar + traffic lights
  ========================================================= */
  const fill = document.getElementById("scroll-progress");
  const traffic = document.getElementById("scroll-traffic");

  if (!fill || !traffic) return;

  const green = traffic.querySelector('[data-color="green"]');
  const yellow = traffic.querySelector('[data-color="yellow"]');
  const red = traffic.querySelector('[data-color="red"]');

  function setLights(stage) {
    [green, yellow, red].forEach((b) => b.classList.remove("is-on"));
    if (stage === "green") green.classList.add("is-on");
    if (stage === "yellow") yellow.classList.add("is-on");
    if (stage === "red") red.classList.add("is-on");
  }

  function updateScroll() {
    const scrollTop = window.scrollY;
    const height =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;

    fill.style.width = `${progress}%`;

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

  window.addEventListener("scroll", () =>
    requestAnimationFrame(updateScroll)
  );
  window.addEventListener("resize", updateScroll);
  updateScroll();
});
