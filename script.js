/* ---------- MOBILE NAV ---------- */
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav ul');
hamburger?.addEventListener('click', () => nav.classList.toggle('active'));

/* ---------- TYPEWRITER ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const typeEl = document.querySelector('#typewrite');
  if (!typeEl) return;

  const roles = ["AI Engineer", "Generative-AI Engineer", "Agentic-AI Researcher", "MLOps Specialist"];
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
