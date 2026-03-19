const typedPhrases = [
  "Full-Stack Developer",
  "React and Node.js Engineer",
  "Content Creator | 1M+ Reach",
  "Problem Solver",
  "Open Source Enthusiast"
];

const identityPhrases = [
  "< Developer />",
  "Content Creator",
  "Builder"
];

const typedOutput = document.getElementById("typed-output");
const identityText = document.getElementById("identity-text");
const menuToggle = document.querySelector(".menu-toggle");
const mobileDrawer = document.getElementById("mobile-drawer");
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const moreSectionIds = new Set(["skills", "experience", "achievements", "socials", "contact"]);
const navLinks = [...document.querySelectorAll(".nav-link"), ...document.querySelectorAll(".drawer-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealElements = document.querySelectorAll(".reveal");
const counterElements = document.querySelectorAll("[data-counter]");
const skillBars = document.querySelectorAll(".skill-bar");
const magneticButtons = document.querySelectorAll(".magnetic");
const particlesRoot = document.getElementById("hero-particles");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const heroSection = document.querySelector(".hero-section");
const heroGrid = document.querySelector(".hero-grid");
const heroCopy = document.querySelector(".hero-copy");
const heroVisual = document.querySelector(".hero-visual");
const heroStats = document.querySelector(".hero-stats");
const photoFrame = document.querySelector(".photo-frame");

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let identityIndex = 0;

function typeLoop() {
  const currentPhrase = typedPhrases[phraseIndex];
  typedOutput.textContent = deleting
    ? currentPhrase.slice(0, charIndex--)
    : currentPhrase.slice(0, charIndex++);

  let delay = deleting ? 45 : 80;

  if (!deleting && charIndex > currentPhrase.length) {
    deleting = true;
    delay = 1600;
  } else if (deleting && charIndex < 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
    delay = 260;
  }

  window.setTimeout(typeLoop, delay);
}

function rotateIdentity() {
  identityIndex = (identityIndex + 1) % identityPhrases.length;
  identityText.style.opacity = "0";

  window.setTimeout(() => {
    identityText.textContent = identityPhrases[identityIndex];
    identityText.style.opacity = "1";
  }, 220);
}

function toggleMenu(forceState) {
  const open = typeof forceState === "boolean" ? forceState : !mobileDrawer.classList.contains("open");
  mobileDrawer.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileDrawer.setAttribute("aria-hidden", String(!open));
}

function toggleDropdown(forceState) {
  const open = typeof forceState === "boolean" ? forceState : !dropdown.classList.contains("open");
  dropdown.classList.toggle("open", open);
  dropdownToggle.setAttribute("aria-expanded", String(open));
}

function updateActiveNav() {
  const headerOffset = 130;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (window.scrollY + headerOffset >= section.offsetTop) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentSection.id}`);
  });

  dropdown.classList.toggle("more-active", moreSectionIds.has(currentSection.id));
}

function animateCounter(element) {
  if (element.dataset.counted === "true") {
    return;
  }

  const target = Number(element.dataset.counter);
  const duration = 1500;
  const start = performance.now();
  element.dataset.counted = "true";

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    let value = Math.round(target * eased);

    if (target >= 1000000) {
      value = Math.round((target * eased) / 1000) * 1000;
      element.textContent = value >= 1000000 ? "1M" : `${Math.max(1, value / 1000)}K`;
    } else {
      element.textContent = `${value}`;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (target >= 1000000) {
      element.textContent = "1M";
    } else {
      element.textContent = `${target}`;
    }
  }

  requestAnimationFrame(step);
}

function buildParticles() {
  const particleCount = 42;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${6 + Math.random() * 7}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.opacity = `${0.3 + Math.random() * 0.7}`;
    particle.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
    particlesRoot.appendChild(particle);
  }
}

function attachImageFallback(imgId, fallbackId) {
  const image = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);

  if (!image || !fallback) {
    return;
  }

  image.addEventListener("error", () => {
    image.hidden = true;
    fallback.hidden = false;
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("visible");

    if (entry.target.matches("[data-counter]")) {
      animateCounter(entry.target);
    }

    if (entry.target.classList.contains("skill-bar")) {
      const fill = entry.target.querySelector(".bar-fill");
      fill.style.width = `${entry.target.dataset.fill}%`;
    }
  });
}, {
  threshold: 0.2
});

revealElements.forEach((element) => observer.observe(element));
counterElements.forEach((element) => observer.observe(element));
skillBars.forEach((element) => observer.observe(element));

menuToggle.addEventListener("click", () => toggleMenu());

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleMenu(false);
    toggleDropdown(false);
  });
});

dropdownToggle.addEventListener("click", () => toggleDropdown());

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    toggleDropdown(false);
  }
});

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);

magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const bounds = button.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);

    button.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.08}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

if (heroSection && window.matchMedia("(pointer:fine)").matches) {
  heroSection.addEventListener("mousemove", (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const offsetX = (x - 50) / 50;
    const offsetY = (y - 50) / 50;

    heroSection.style.setProperty("--spot-x", `${x}%`);
    heroSection.style.setProperty("--spot-y", `${y}%`);

    heroGrid.style.transform = `translate3d(${offsetX * 4}px, ${offsetY * 3}px, 0)`;
    heroCopy.style.transform = `translate3d(${offsetX * -7}px, ${offsetY * -6}px, 0)`;
    heroVisual.style.transform = `translate3d(${offsetX * 7}px, ${offsetY * 6}px, 0)`;
    heroStats.style.transform = `translate3d(${offsetX * 3}px, ${offsetY * 4}px, 0)`;
    photoFrame.style.transform = `rotateX(${offsetY * -2.5}deg) rotateY(${offsetX * 3}deg)`;
  });

  heroSection.addEventListener("mouseleave", () => {
    heroGrid.style.transform = "";
    heroCopy.style.transform = "";
    heroVisual.style.transform = "";
    heroStats.style.transform = "";
    photoFrame.style.transform = "";
    heroSection.style.setProperty("--spot-x", "50%");
    heroSection.style.setProperty("--spot-y", "35%");
  });
}

if (window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    cursorRing.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  document.querySelectorAll("a, button, input, textarea").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorRing.style.width = "58px";
      cursorRing.style.height = "58px";
      cursorRing.style.borderColor = "rgba(6, 182, 212, 0.85)";
    });

    element.addEventListener("mouseleave", () => {
      cursorRing.style.width = "36px";
      cursorRing.style.height = "36px";
      cursorRing.style.borderColor = "rgba(124, 58, 237, 0.8)";
    });
  });
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  formStatus.hidden = false;
  formStatus.textContent = `Thanks ${name}. Your message is staged in the UI and ready to connect to a real inbox endpoint.`;
  contactForm.reset();
});

attachImageFallback("profile-photo", "photo-fallback");
buildParticles();
typeLoop();
window.setInterval(rotateIdentity, 2800);
