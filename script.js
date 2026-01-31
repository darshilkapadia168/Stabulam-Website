gsap.registerPlugin(ScrollTrigger);


 window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });


const typewriterEl = document.getElementById("typewriter");
const cursorEl = document.querySelector(".typing-cursor");
const paraEl = document.getElementById("para");
const scrollHint = document.getElementById("scrollHint");

const fullText = "— Digital Marketing & AI Development";

let i = 0;
let isDeleting = false;
let pauseTime = 0;

function typeWriter() {
  if (!isDeleting) {
    // Typing forward
    if (i < fullText.length) {
      typewriterEl.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriter, 60); // typing speed
    } else {
      // Finished typing — pause then start deleting
      isDeleting = true;
      setTimeout(typeWriter, 2000); // pause 2s before delete starts
    }
  } else {
    // Deleting backward
    if (i > 0) {
      typewriterEl.textContent = fullText.substring(0, i - 1);
      i--;
      setTimeout(typeWriter, 30); // delete speed (faster than typing)
    } else {
      // Fully deleted — pause then type again
      isDeleting = false;
      setTimeout(typeWriter, 1000); // pause 1s before typing again
    }
  }
}

// Show para + scroll hint only once after first typing completes
let firstComplete = false;

function typeWriterLoop() {
  if (!isDeleting) {
    if (i < fullText.length) {
      typewriterEl.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriterLoop, 60);
    } else {
      // First time typing done — show para & scroll hint
      if (!firstComplete) {
        firstComplete = true;
        paraEl.classList.add("visible");
        scrollHint.classList.add("visible");
      }
      // Pause then delete
      isDeleting = true;
      setTimeout(typeWriterLoop, 2000);
    }
  } else {
    if (i > 0) {
      typewriterEl.textContent = fullText.substring(0, i - 1);
      i--;
      setTimeout(typeWriterLoop, 30);
    } else {
      // Pause then type again
      isDeleting = false;
      setTimeout(typeWriterLoop, 1000);
    }
  }
}

window.addEventListener("load", () => {
  setTimeout(typeWriterLoop, 800);
});


window.addEventListener('load', function () {

    var tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".detailscards",
            scroller: "body",
            start: "top 70%",
            end: "top 10%",
            scrub: 3,
        }
    })

    tl3.from(".header", {
        y: 20,
        opacity: 0,
    })

    // tl3.from(".detailscards .cards", {
    //     y: 100,
    //     opacity: 0,
    //     stagger: 0.1,
    //     ease: "power2.out",
    // })
});


//Scroll-reveal or Parallax effect
// ============================================
// UPDATED SERVICES SECTION ANIMATION
// Replace the existing card animation code with this
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.cards');
    cards.forEach(card => cardObserver.observe(card));

    // Optional: Add subtle tilt effect on mouse move
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;
            
            card.style.transform = `
                translateY(-8px) 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .cards {
    position: relative;
    overflow: visible !important;
  }
`;
document.head.appendChild(style);

// ============================================
// UPDATED STATS SECTION ANIMATION (PAGE 3)
// Add this to your script.js file
// ============================================

// Counter animation for numbers
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Intersection Observer for stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate the number when card becomes visible
            const numberElement = entry.target.querySelector('.stat-number');
            if (numberElement && !numberElement.dataset.animated) {
                numberElement.dataset.animated = 'true';
                const targetText = numberElement.textContent;
                const hasPlus = targetText.includes('+');
                const targetNumber = parseInt(targetText.replace('+', ''));
                
                numberElement.textContent = '0' + (hasPlus ? '+' : '');
                
                setTimeout(() => {
                    animateCounter(numberElement, targetNumber, 2000);
                }, 200);
            }
            
            // Unobserve after animation
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-50px'
});

// Observe all stat cards
document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => statsObserver.observe(card));
    
    // Add interactive tilt effect
    statCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `
                translateY(-12px) 
                scale(1.02)
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

let p4tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".page4",
        scroller: "body",
        start: "top 70%",
        end: "top 25%",
        scrub: 2
    }
})

p4tl.from(".p4left", {
    x: -300,
    opacity: 0,
    duration: 1
}, "anim1")

p4tl.from(".p4right", {
    x: 300,
    opacity: 0,
    duration: 1
}, "anim1")


// let lodtl = gsap.timeline()

// lodtl.from("#loader h2", {
//     x: 100,
//     opacity: 0,
//     duration: 1.5,
//     delay: 0.6,
//     stagger: 0.2
// })

// lodtl.to("#loader h2", {
//     opacity: 0,
//     x: -100,
//     duration: 1,
//     stagger: 0.1
// })

// lodtl.to("#loader", {
//     opacity: 0
// })

// lodtl.to("#loader", {
//     display: "none"
// })

// Smooth mainlogo clip animation with scale + fade
const logoTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".home",
    start: "top top",
    end: "300vh top",
    scrub: 1.5  // Higher number = smoother, more lag-behind feel
  }
});

logoTl
  .to(".mainlogo", {
    "--clip": "0%",
    ease: "power2.inOut"  // Starts slow, speeds up middle, slows at end
  }, 0)
  .to(".mainlogo img", {
    scale: 0.85,          // Logo shrinks slightly as it disappears
    opacity: 0.6,         // Fades out too
    ease: "power2.inOut"
  }, 0);

// Pin .main so it doesn't scroll while clip animates
ScrollTrigger.create({
  trigger: ".home",
  start: "top top",
  end: "300vh top",
  pin: ".main",
  pinSpacing: true
});



