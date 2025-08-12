/* ---------- MOBILE NAV ---------- */
const hamburger = document.getElementById('hamburger');
const nav       = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('active');
});

/* ---------- TYPEWRITER ---------- */
const typeEl = document.querySelector('.typewrite');
const roles  = ["AI & Generative-AI Engineer", "Agentic-AI Researcher", "MLOps Specialist", "Ethical AI Advocate"];

let i = 0, j = 0, forward = true;

function typeNext() {
  const cur = roles[i];
  typeEl.textContent = forward ? cur.slice(0, ++j) : cur.slice(0, --j);

  if (forward && j === cur.length) {        // finished typing
    setTimeout(typeNext, 1500);
    forward = false;
  } else if (!forward && j === 0) {         // finished deleting
    i = (i + 1) % roles.length;
    forward = true;
    setTimeout(typeNext, 300);
  } else {                                  // still typing / deleting
    setTimeout(typeNext, 80);
  }
}
document.addEventListener('DOMContentLoaded', typeNext);

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
