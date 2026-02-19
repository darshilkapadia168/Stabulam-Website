gsap.registerPlugin(ScrollTrigger);

// ============================================
// MOBILE DETECTION
// ============================================
const isMobile = () => window.innerWidth <= 768 || 
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ============================================
// NAVBAR SCROLL
// ============================================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true }); // passive improves mobile scroll performance

// ============================================
// TYPEWRITER
// ============================================
const typewriterEl = document.getElementById("typewriter");
const paraEl = document.getElementById("para");
const scrollHint = document.getElementById("scrollHint");

const fullText = "— Digital Marketing & AI Development";
let i = 0;
let isDeleting = false;
let firstComplete = false;

function typeWriterLoop() {
  if (!isDeleting) {
    if (i < fullText.length) {
      typewriterEl.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriterLoop, 60);
    } else {
      if (!firstComplete) {
        firstComplete = true;
        paraEl.classList.add("visible");
        scrollHint.classList.add("visible");
      }
      isDeleting = true;
      setTimeout(typeWriterLoop, 2000);
    }
  } else {
    if (i > 0) {
      typewriterEl.textContent = fullText.substring(0, i - 1);
      i--;
      setTimeout(typeWriterLoop, 30);
    } else {
      isDeleting = false;
      setTimeout(typeWriterLoop, 1000);
    }
  }
}

window.addEventListener("load", () => {
  setTimeout(typeWriterLoop, 800);
});

// ============================================
// MOBILE CSS OVERRIDE
// Removes hover-triggered transforms that
// cause snap/jump when touch ends on mobile
// ============================================
if (isMobile()) {
  const mobileStyle = document.createElement("style");
  mobileStyle.textContent = `
    .stat-card.animate-in {
      animation: none !important;
    }
    .cards.animate-in:hover {
      animation: none !important;
    }
    .cards:hover,
    .stat-card:hover,
    .rightcard:hover {
      transform: none !important;
    }
    .stat-card:hover .stat-icon {
      animation: none !important;
      transform: none !important;
    }
    .left-content p:hover {
      transform: none !important;
    }
  `;
  document.head.appendChild(mobileStyle);
}

// ============================================
// GSAP LOGO CLIP ANIMATION
// FIX: Skip pin on mobile entirely — this is
// the ROOT CAUSE of the scroll reset bug
// ============================================
const logoTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".home",
    start: "top top",
    end: "300vh top",
    scrub: 1.5
  }
});

logoTl
  .to(".mainlogo", {
    "--clip": "0%",
    ease: "power2.inOut"
  }, 0)
  .to(".mainlogo img", {
    scale: 0.85,
    opacity: 0.6,
    ease: "power2.inOut"
  }, 0);

// KEY FIX: Only pin on desktop
// On mobile, pin causes scroll position to snap
// back to pinned section start when scroll stops
if (!isMobile()) {
  ScrollTrigger.create({
    trigger: ".home",
    start: "top top",
    end: "300vh top",
    pin: ".main",
    pinSpacing: true
  });
} else {
  // On mobile: simpler version with no pin
  // Just let it scroll naturally
  ScrollTrigger.create({
    trigger: ".home",
    start: "top top",
    end: "150vh top", // shorter range on mobile
    scrub: 1
  });
}

// ============================================
// PAGE 2 - SERVICES GSAP HEADER
// ============================================
window.addEventListener("load", () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: ".detailscards",
      scroller: "body",
      start: "top 70%",
      end: "top 10%",
      scrub: 3,
    }
  }).from(".header", {
    y: 20,
    opacity: 0,
  });
});

// ============================================
// PAGE 2 - CARDS INTERSECTION OBSERVER
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".cards").forEach(card => {
    cardObserver.observe(card);

    // Mouse tilt — desktop only
    if (!isMobile()) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -4;
        const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 4;
        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    }
  });
});

// ============================================
// PAGE 3 - STATS COUNTER + OBSERVER
// ============================================
function animateCounter(element, target, duration = 2000) {
  const hasPlus = element.textContent.includes("+");
  let current = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (hasPlus ? "+" : "");
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? "+" : "");
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");

      const numberEl = entry.target.querySelector(".stat-number");
      if (numberEl && !numberEl.dataset.animated) {
        numberEl.dataset.animated = "true";
        const hasPlus = numberEl.textContent.includes("+");
        const targetNum = parseInt(numberEl.textContent.replace("+", ""));
        numberEl.textContent = "0" + (hasPlus ? "+" : "");
        setTimeout(() => animateCounter(numberEl, targetNum, 2000), 200);
      }

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3, rootMargin: "-50px" });

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".stat-card").forEach(card => {
    statsObserver.observe(card);

    // Mouse tilt — desktop only
    if (!isMobile()) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -6;
        const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 6;
        card.style.transform = `translateY(-12px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    }
  });
});

// ============================================
// PAGE 4 - GSAP SLIDE IN
// ============================================
gsap.timeline({
  scrollTrigger: {
    trigger: ".page4",
    scroller: "body",
    start: "top 70%",
    end: "top 25%",
    scrub: 2
  }
})
.from(".p4left", { x: isMobile() ? -80 : -300, opacity: 0, duration: 1 }, "anim1")
.from(".p4right", { x: isMobile() ? 80 : 300, opacity: 0, duration: 1 }, "anim1");

// ============================================
// REFRESH SCROLLTRIGGER ON RESIZE
// ============================================
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});