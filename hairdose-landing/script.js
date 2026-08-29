const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const salonSearch = document.getElementById('salonSearch');
const waitlistForm = document.getElementById('waitlistForm');
const formMessage = document.getElementById('formMessage');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
});

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

salonSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('early-access').scrollIntoView({ behavior: 'smooth' });
});

waitlistForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email');
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  formMessage.textContent = `Thanks — ${email.value} has been added to the hairDose launch list.`;
  formMessage.classList.add('success');
  email.value = '';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
