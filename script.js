// === Run after the document loads ===
document.addEventListener("DOMContentLoaded", () => {
  // === Typing animation with dynamic greeting ===
  const hour = new Date().getHours();
  let greeting =
    hour < 12
      ? "Good morning!"
      : hour < 18
      ? "Good afternoon!"
      : "Good evening!";

  const lines = [greeting, "Welcome to my portfolio!"];
  let lineIndex = 0,
    charIndex = 0;

  function fadeInLine(el) {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.6s ease";
    setTimeout(() => (el.style.opacity = "1"), 100);
  }

  function typeLine() {
    if (lineIndex < lines.length) {
      const el = document.getElementById(`line${lineIndex + 1}`);
      if (!el) return;
      if (charIndex === 0) fadeInLine(el);
      if (charIndex < lines[lineIndex].length) {
        el.textContent += lines[lineIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeLine, 70);
      } else {
        charIndex = 0;
        lineIndex++;
        setTimeout(typeLine, 600);
      }
    }
  }
  typeLine();

  // === FUN FACTS BUTTON WITH CELEBRATION ===
  const funFactsBtn = document.getElementById("funFactsBtn");
  if (funFactsBtn) {
    funFactsBtn.addEventListener("click", () => {
      const funFacts = [
        "🏎️ Published two research papers analyzing the aerodynamic wake flow of 2026-spec Formula 1 cars.",
        "🌏 Collaborated with Shanghai Jiao Tong University on drivetrain stress optimization for heavy-duty vehicles.",
        "🥋 Achieved a Black Belt in Karate — balance, discipline, precision under pressure.",
        "🧠 Built CFD models comparing rear-wing downforce effects across diffuser geometries.",
        "⚙️ Modeled a complete electric motorcycle drivetrain for vibration and NVH optimization.",
        "📊 Conducted benchmarking for Caterpillar and Tata-Hitachi improving hydraulic efficiency by 7%.",
        "🚀 Created a MATLAB-based flow simulation tool for turbine-cooling analysis at Penn State.",
        "🎯 Designed a low-cost RedBot line-following robot with IR + encoder feedback.",
        "💡 Believe great engineering blends creativity, computation, and curiosity.",
        "📚 Penn State Mechanical Engineering senior — always chasing the next design challenge."
      ];

      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      showFunFact(randomFact);
      firecrackerEffect(funFactsBtn, 50);
    });
  }

  // === FUN FACT POPUP ===
  function showFunFact(fact) {
    const popup = document.createElement("div");
    popup.textContent = fact;
    popup.classList.add("fun-fact-popup");
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add("visible"), 50);
    setTimeout(() => {
      popup.classList.remove("visible");
      setTimeout(() => popup.remove(), 400);
    }, 3000);
  }

  // === FIRECRACKER CELEBRATION EFFECT ===
  function firecrackerEffect(element, count = 25) {
    const rect = element.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.classList.add("firecracker");
      document.body.appendChild(particle);

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 180 + 80;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const colors = [
        "#ff3b3b",
        "#ffeb3b",
        "#00e676",
        "#1a73e8",
        "#ff9800",
        "#9c27b0"
      ];

      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;

      particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
        ],
        {
          duration: 1200 + Math.random() * 600,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards"
        }
      );
      setTimeout(() => particle.remove(), 1800);
    }
  }

  // === THEME TOGGLE BUTTON (white → black → funky) ===
  const themeToggleBtn = document.getElementById("themeToggleTop");
  let themeMode = "white";

  if (document.body.classList.contains("black")) themeMode = "black";
  else if (document.body.classList.contains("funky")) themeMode = "funky";

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.querySelectorAll(".polka-dot").forEach(dot => dot.remove());

      if (themeMode === "white") {
        document.body.classList.add("black");
        document.body.classList.remove("funky");
        themeMode = "black";
      } else if (themeMode === "black") {
        enableFunkyTheme();
        themeMode = "funky";
      } else {
        document.body.classList.remove("black", "funky");
        themeMode = "white";
      }

      const burst = document.createElement("div");
      burst.classList.add("theme-burst");
      const rect = themeToggleBtn.getBoundingClientRect();
      burst.style.left = `${rect.left + rect.width / 2}px`;
      burst.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 800);
    });
  }

  // === POLKA DOT GENERATOR + FUNKY THEME ===
  function createPolkaDots(count = 35) {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.classList.add("polka-dot");
      const size = Math.random() * 30 + 10;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.animationDuration = `${15 + Math.random() * 10}s`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dot.style.setProperty("--x", `${Math.random() * 100 - 50}px`);
      dot.style.setProperty("--y", `${Math.random() * 100 - 50}px`);
      document.body.appendChild(dot);
    }
  }

  function enableFunkyTheme() {
    document.body.classList.remove("black");
    document.body.classList.add("funky");
    document.querySelectorAll(".polka-dot").forEach(dot => dot.remove());
    createPolkaDots(40);
  }

  // === BACK TO TOP BUTTON ===
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
