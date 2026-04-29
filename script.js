// ENTER SITE FROM SPLASH
function enterSite() {
  const splash = document.getElementById('splash');
  if (splash) splash.classList.add('hidden');
  document.body.classList.remove('has-splash'); // Remove to show navbar immediately
  
  revealMainContent();
}

function revealMainContent() {
  setTimeout(() => {
    const nav = document.querySelector('.navbar');
    const homeSection = document.getElementById('home');
    
    if(nav) {
      nav.style.opacity = '1';
      nav.style.transform = 'translateY(0)';
    }
    
    if(homeSection) {
      homeSection.classList.add('revealed');
    }
    
    document.querySelectorAll('.hero-content > *').forEach((el, i) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 400);
}

// AUTO SKIP SPLASH IF RETURNING
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('skipSplash') === 'true') {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
    document.body.classList.remove('has-splash');
    revealMainContent();
    
    // Clear the parameter so it shows again on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// PROGRESS BAR
const progressBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (total > 0) {
    progressBar.style.width = (scrolled / total * 100) + '%';
  }
});

// ACTIVATE SECTION
function activateSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-links li').forEach(li => {
    li.classList.toggle('active-nav', li.dataset.section === id);
  });
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.toggle('active-bottom', item.dataset.section === id);
  });
}

// FOCUS SECTION
function focusSection(id) {
  activateSection(id);
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const labels = {
    home: 'Home 🏠', profil: 'Profil 👤', akademik: 'Akademik 🎓',
    organisasi: 'Organisasi 🤝', prestasi: 'Prestasi 🏆', skill: 'Skill 💡'
  };
  showToast('✦ ' + (labels[id] || id));
  closeMobileMenu();
}

// TOAST
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

// RIPPLE
function addRipple(e, el) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// GALLERY REVEAL (Fallback for older browsers)
if (!window.CSS || !CSS.supports('animation-timeline', 'view()')) {
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-item').forEach(item => galleryObserver.observe(item));
}

// INTERSECTION OBSERVER
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      if (entry.intersectionRatio >= 0.25) { // Faster trigger
        activateSection(entry.target.id);
      }
    }
  });
}, { threshold: [0, 0.25] });
sections.forEach(s => observer.observe(s));

// 3D TILT (Smoother)
document.querySelectorAll('.org-card, .prestasi-card, .akademik-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-10px) scale(1.03) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    card.style.transition = 'transform 0.1s ease-out'; // Fast response
  });
  card.addEventListener('mouseleave', () => { 
    card.style.transform = ''; 
    card.style.transition = 'transform 0.5s ease'; // Smooth return
  });
});

// MOBILE MENU
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('menuOverlay').classList.toggle('show');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('menuOverlay').classList.remove('show');
}

// LOAD
window.addEventListener('load', () => {
  activateSection('home');
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
});