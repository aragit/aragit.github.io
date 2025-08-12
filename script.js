/* ----- mobile nav ----- */
const hamburger  = document.getElementById('hamburger');
const nav        = document.querySelector('nav ul');
hamburger.onclick = () => nav.classList.toggle('active');

/* ----- typewriter ----- */
const typewrite = txt => {
  const el = document.querySelector('.typewrite');
  let i = 0, text = txt[0];
  const tick = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 60);
    else {
      setTimeout(() => {
        i = 0;
        txt.push(txt.shift()); // rotate
        text = txt[0];
        tick();
      }, 2000);
    }
  };
  tick();
};
typewrite(JSON.parse(document.querySelector('.typewrite').dataset.type));

/* ----- current year ----- */
document.getElementById('year').textContent = new Date().getFullYear();
