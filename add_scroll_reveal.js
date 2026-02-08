// Scroll Reveal for Insight Pillars
(function() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: Stop observing once revealed
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all insight pillars
  document.addEventListener('DOMContentLoaded', () => {
    const pillars = document.querySelectorAll('.insight-pillar');
    pillars.forEach(pillar => observer.observe(pillar));
  });
})();
