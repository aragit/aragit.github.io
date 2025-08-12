// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('.menu');
hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Theme Toggle
const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
};

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
