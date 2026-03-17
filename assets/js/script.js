// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-in-delayed, .fade-in-stagger",
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Add subtle parallax effect to hero
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const hero = document.querySelector(".hero");

      if (hero && scrollTop < window.innerHeight) {
        hero.style.transform = `translateY(${scrollTop * 0.3}px)`;
        hero.style.opacity = 1 - (scrollTop / window.innerHeight) * 0.5;
      }

      lastScrollTop = scrollTop;
    },
    { passive: true },
  );

  // Add active state to navigation based on scroll position
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const setActiveNav = () => {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      link.classList.remove("active");

      if (linkHref === currentPage) {
        link.classList.add("active");
      }
    });
  };

  // Run once on page load
  setActiveNav();

  // Add smooth reveal on page load
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// ========================================
// Add subtle cursor effect (optional)
// ========================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor follower
function animateCursor() {
  const diffX = mouseX - cursorX;
  const diffY = mouseY - cursorY;

  cursorX += diffX * 0.1;
  cursorY += diffY * 0.1;

  requestAnimationFrame(animateCursor);
}

animateCursor();
