// === Typing animation with dynamic greeting (no cursor) ===
const hour = new Date().getHours();
let greeting;

if (hour < 12) {
  greeting = "Good morning!";
} else if (hour < 18) {
  greeting = "Good afternoon!";
} else {
  greeting = "Good evening!";
}

const lines = [
  greeting,
  "Welcome to my portfolio!",
  
];

let lineIndex = 0, charIndex = 0;

function fadeInLine(el) {
  el.style.opacity = "0";
  el.style.transition = "opacity 0.6s ease";
  setTimeout(() => (el.style.opacity = "1"), 100);
}

function typeLine() {
  if (lineIndex < lines.length) {
    const el = document.getElementById(`line${lineIndex + 1}`);
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

// === Theme toggle (white <-> black only) ===
let currentTheme = "white";
const themeToggleTop = document.getElementById("themeToggleTop");
themeToggleTop.addEventListener("click", () => {
  if (currentTheme === "white") {
    document.body.classList.add("black");
    currentTheme = "black";
  } else {
    document.body.classList.remove("black");
    currentTheme = "white";
  }
});



/* === FUN FACTS BUTTON WITH CELEBRATION === */
const funFactsBtn = document.getElementById("funFactsBtn");

if (funFactsBtn) {
  funFactsBtn.addEventListener("click", () => {
    const funFacts = [
      "🏎️ Published two research papers analyzing the aerodynamic wake flow of 2026-spec Formula 1 cars.",
      "🌏 Collaborated with Shanghai Jiao Tong University on drivetrain stress optimization for heavy-duty vehicles.",
      "🥋 Achieved a Black Belt in Karate which taught me balance, discipline, and precision under pressure.",
      "🧠 Built CFD models comparing rear-wing downforce effects across 4 different diffuser geometries.",
      "⚙️ Modeled a complete electric motorcycle drivetrain for vibration and NVH optimization.",
      "📊 Conducted benchmarking for Caterpillar and Tata-Hitachi to improve hydraulic efficiency by 7%.",
      "🚀 Created a MATLAB-based flow simulation tool used for my Penn State turbine-cooling lab analysis.",
      "🎯 Designed a low-cost RedBot line-following robot integrating IR and encoder feedback for autonomous control.",
      "💡 Believe great engineering blends creativity, computation, and curiosity.",
      "📚 Penn State Mechanical Engineering senior — always chasing the next design challenge."
    ];

    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    showFunFact(randomFact);
    firecrackerEffect(funFactsBtn, 50); // larger celebration (more particles)
  });
}

/* === FUN FACT POPUP === */
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

/* === FIRECRACKER CELEBRATION EFFECT === */
function firecrackerEffect(element, count = 25) {
  const rect = element.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.classList.add("firecracker");
    document.body.appendChild(particle);

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 180 + 80; // increased range for larger burst
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const colors = ["#ff3b3b", "#ffeb3b", "#00e676", "#1a73e8", "#ff9800", "#9c27b0"];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
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
/* === THEME TOGGLE BUTTON LIGHT BURST === */
const themeToggleBtn = document.getElementById("themeToggleTop");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    // Toggle theme
    document.body.classList.toggle("black");

    // Create a soft burst of light around the button
    const burst = document.createElement("div");
    burst.classList.add("theme-burst");
    const rect = themeToggleBtn.getBoundingClientRect();
    burst.style.left = `${rect.left + rect.width / 2}px`;
    burst.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 800);
  });
}
// === SCROLL PROGRESS BAR ===
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  document.getElementById("scrollProgressBar").style.height = scrollPercent + "%";
});

// === EXPERIENCE / LEADERSHIP CARD EXPAND / COLLAPSE ===
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".learn-more");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const details = button.nextElementSibling;
      if (!details) return;

      // Toggle visibility with smooth animation
      if (details.classList.contains("visible")) {
        details.style.maxHeight = "0";
        details.classList.remove("visible");
        details.classList.add("hidden");
        button.textContent = "Learn More";
      } else {
        details.classList.remove("hidden");
        details.style.maxHeight = details.scrollHeight + "px";
        details.classList.add("visible");
        button.textContent = "Show Less";
      }
    });
  });
});

// === TIMELINE REVEAL ON SCROLL ===
window.addEventListener("scroll", () => {
  const items = document.querySelectorAll(".timeline-item");
  const triggerBottom = window.innerHeight * 0.85;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      item.classList.add("visible");
    }
  });
});

// === SECTION FADE-IN ON SCROLL ===
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const triggerBottom = window.innerHeight * 0.9;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      section.classList.add("visible");
    }
  });
});
// === CONTACT BUTTON TOGGLE ===
document.querySelectorAll(".contact-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.parentElement;
    card.classList.toggle("active");
  });
});

