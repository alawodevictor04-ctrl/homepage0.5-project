// script.js: makes the page interactive.
// It does five things: mobile menu, project filter, active nav link, back-to-top button,
// and a light blue glow that follows the mouse.

// 1. Mobile menu: the Menu button opens and closes the nav links.
const menuBtn = document.getElementById('menu-btn');
const siteNav = document.getElementById('site-nav');

menuBtn.addEventListener('click', function () {
    const isOpen = siteNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', isOpen);
});

// Close the menu after tapping a link.
siteNav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        siteNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }
});

// 2. Project filter: each button shows only projects whose data-type matches.
const filterButtons = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const chosen = button.dataset.filter;

        filterButtons.forEach(function (b) {
            const active = b === button;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active);
        });

        projects.forEach(function (project) {
            const show = chosen === 'all' || project.dataset.type === chosen;
            project.hidden = !show;
        });
    });
});

// 3. Active nav link: highlight the link for the section you are reading.
const sections = document.querySelectorAll('main section, #contact');
const navLinks = document.querySelectorAll('.site-nav a');

const watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
                const match = link.getAttribute('href') === '#' + entry.target.id;
                link.setAttribute('aria-current', match ? 'true' : 'false');
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(function (section) {
    watcher.observe(section);
});

// 4. Back-to-top button: appears after scrolling down.
const toTop = document.getElementById('to-top');

window.addEventListener('scroll', function () {
    toTop.hidden = window.scrollY < 600;
});

toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0 });
});

// 5. Cursor glow: a light blue circle follows the mouse.
// The CSS (.glow) draws the circle at --mx and --my. Here we keep updating those two values.
const glow = document.getElementById('glow');
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight * 0.3;
let glowX = targetX;
let glowY = targetY;

function moveGlow() {
    // Move 15% of the way to the mouse each frame, so the glow follows smoothly.
    glowX += (targetX - glowX) * (reduceMotion ? 1 : 0.15);
    glowY += (targetY - glowY) * (reduceMotion ? 1 : 0.15);
    root.style.setProperty('--mx', glowX + 'px');
    root.style.setProperty('--my', glowY + 'px');
    requestAnimationFrame(moveGlow);
}

window.addEventListener('pointermove', function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.classList.add('is-on');
});

// Fade the glow out when the mouse leaves the window.
document.addEventListener('pointerleave', function () {
    glow.classList.remove('is-on');
});

moveGlow();
