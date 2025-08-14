/* ---------- MOBILE NAV ---------- */
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav ul');
hamburger?.addEventListener('click', () => nav.classList.toggle('active'));

/* ---------- ON CONTENT LOAD ---------- */
window.addEventListener('DOMContentLoaded', () => {
  /* ---------- PARTICLES ENGINE CONFIG ---------- */
  tsParticles.load({
    id: "particles-js",
    options: {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ["#ff6b00", "#4dabf7"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
          path: {
            enable: true,
            delay: {
              random: { enable: true, minimumValue: 0.5 },
              value: 1
            },
            generator: "perlinNoise",
            options: {
              width: 100,
              height: 100,
              increment: 0.004,
              type: "simplex",
              frequency: 0.05,
              amplitude: 1
            }
          }
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_opacity: 0.5 },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
      background: {
        color: "#121212",
      },
    },
  });

  /* ---------- TYPEWRITER ---------- */
  const typeEl = document.querySelector('#typewrite');
  if (!typeEl) return;
  const roles = ["AI Engineer","Agentic AI Researcher", "Ethical AI Advocate", "KaggleX Advisor", "Kaggle Grandmaster"];
  let i = 0, j = 0, forward = true;
  function tick() {
    const cur = roles[i];
    typeEl.textContent = forward ? cur.slice(0, ++j) : cur.slice(0, --j);
    if (forward && j === cur.length) {
      setTimeout(tick, 1500);
      forward = false;
    } else if (!forward && j === 0) {
      i = (i + 1) % roles.length;
      forward = true;
      setTimeout(tick, 300);
    } else {
      setTimeout(tick, 80);
    }
  }
  tick();
});

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();