const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme) {
    const isDark = theme === 'dark';

    document.documentElement.dataset.theme = theme;
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    themeToggle?.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );

}

applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark'
        ? 'light'
        : 'dark';

    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
});

const sectionLinks = Array.from(
    document.querySelectorAll('.page-nav a[href^="#"]')
);
const trackedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function setActiveSection(sectionId) {
    sectionLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('is-active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function updateActiveSection() {
    if (!trackedSections.length) return;

    const readingLine = window.scrollY + Math.min(window.innerHeight * 0.3, 220);
    let activeSection = trackedSections[0];

    trackedSections.forEach((section) => {
        if (section.offsetTop <= readingLine) {
            activeSection = section;
        }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        activeSection = trackedSections[trackedSections.length - 1];
    }

    setActiveSection(activeSection.id);
}

let scrollUpdateQueued = false;

function queueActiveSectionUpdate() {
    if (scrollUpdateQueued) return;

    scrollUpdateQueued = true;
    window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollUpdateQueued = false;
    });
}

sectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));

        if (target instanceof HTMLDetailsElement) {
            target.open = true;
        }
    });
});

window.addEventListener('scroll', queueActiveSectionUpdate, { passive: true });
window.addEventListener('resize', queueActiveSectionUpdate);
updateActiveSection();
