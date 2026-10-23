const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $('#menuToggle');
const navMenu = $('#navMenu');
menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const themeToggle = $('#themeToggle');
const savedTheme = (() => { try { return localStorage.getItem('cb-portfolio-theme'); } catch { return null; } })();
if (savedTheme === 'light') document.body.classList.add('light-theme');
function updateThemeButton() {
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  try { localStorage.setItem('cb-portfolio-theme', theme); } catch {}
  updateThemeButton();
});

const progress = $('#scrollProgress');
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
$$('main section[id]').forEach(section => sectionObserver.observe(section));

$('#year').textContent = new Date().getFullYear();

const projectDetails = {
  cbflow: {
    eyebrow: 'CAPSTONE · IOT SYSTEM',
    title: 'CBFLOW',
    description: 'An IoT-based hybrid solar-powered automated irrigation system concept for farmers in Brgy. Can-Asuhan, Carcar City, Cebu. The intended system monitors soil moisture and controls watering automatically to support more efficient water management.',
    focus: 'ESP32 control, soil-moisture sensing, pump automation, solar power, and remote monitoring.',
    status: 'Capstone project / development and evaluation.'
  },
  tickify: {
    eyebrow: 'WEB DEVELOPMENT',
    title: 'Tickify — Event Reservation',
    description: 'A student web application project concept that brings event discovery and seat reservation into one workflow. Planned features include user login, event search, event details, and seat reservation.',
    focus: 'Django backend, responsive interface, HTML, CSS, JavaScript, and reservation workflow.',
    status: 'Practice project. Add a live demo or source repository when it is ready.'
  },
  gallery: {
    eyebrow: 'MOBILE APP COURSEWORK',
    title: 'Philippine Presidents Image Gallery',
    description: 'A mobile gallery app concept for organizing and displaying images and information about Philippine presidents. It explores a simple visual browsing experience for educational content.',
    focus: 'Flutter interface design, Firebase concepts, image presentation, and mobile usability.',
    status: 'Coursework / learning project.'
  }
};
const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalEyebrow = $('#modalEyebrow');
const modalDescription = $('#modalDescription');
const modalFocus = $('#modalFocus');
const modalStatus = $('#modalStatus');
let lastFocused = null;
function openModal(key) {
  const detail = projectDetails[key];
  if (!detail) return;
  lastFocused = document.activeElement;
  modalEyebrow.textContent = detail.eyebrow;
  modalTitle.textContent = detail.title;
  modalDescription.textContent = detail.description;
  modalFocus.textContent = detail.focus;
  modalStatus.textContent = detail.status;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}
$$('[data-detail]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.detail)));
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

const toast = $('#toast');
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2300);
}
$('#copyEmail').addEventListener('click', async () => {
  const email = $('#copyEmail').dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    $('#copyFeedback').textContent = 'Email copied to clipboard.';
    showToast('Email address copied!');
  } catch {
    $('#copyFeedback').textContent = `Email: ${email}`;
    showToast('Use the email shown above.');
  }
});

// Small pointer glow for supported desktop devices; disabled for touch and reduced motion.
if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  $$('.skill-card, .project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.backgroundImage = `radial-gradient(320px circle at ${event.clientX - rect.left}px ${event.clientY - rect.top}px, rgba(201,243,107,.045), transparent 70%)`;
    });
    card.addEventListener('pointerleave', () => { card.style.backgroundImage = ''; });
  });
}
