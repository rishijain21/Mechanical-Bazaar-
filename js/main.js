// ==================== GLOBAL INITIALIZATION ====================
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const goHome = document.getElementById('goHome');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');

document.getElementById('year').textContent = new Date().getFullYear();

// ==================== MOBILE MENU ====================
if (mobileToggle) {
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('mobile-open');
    document.body.classList.toggle('menu-open');

    const icon = mobileToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      document.body.classList.remove('menu-open');
      mobileToggle.querySelector('i').classList.remove('fa-times');
      mobileToggle.querySelector('i').classList.add('fa-bars');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('mobile-open');
      document.body.classList.remove('menu-open');
      mobileToggle.querySelector('i').classList.remove('fa-times');
      mobileToggle.querySelector('i').classList.add('fa-bars');
    }
  });
}

// ==================== HEADER SCROLL ====================
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 80);
      ticking = false;
    });
    ticking = true;
  }
});

// ==================== LOGO CLICK ====================
if (goHome) {
  goHome.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== TESTIMONIAL SLIDER ====================
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.tn-dot');
const prevBtn = document.getElementById('prevTest');
const nextBtn = document.getElementById('nextTest');
let currentSlide = 0;
let autoplayInterval;

function goToSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i]?.classList.remove('active');
  });

  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() { autoplayInterval = setInterval(nextSlide, 6000); }
function resetAutoplay() { clearInterval(autoplayInterval); startAutoplay(); }

if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => { goToSlide(index); resetAutoplay(); });
});

const track = document.querySelector('.testimonial-track');
if (track) {
  let touchStartX = 0;
  track.addEventListener('touchstart', e => (touchStartX = e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide();
    else if (touchEndX - touchStartX > 50) prevSlide();
    resetAutoplay();
  }, { passive: true });
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
  resetAutoplay();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(autoplayInterval);
  else startAutoplay();
});

if (slides.length > 0) { goToSlide(0); startAutoplay(); }

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==================== ACTIVE NAV HIGHLIGHT ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 150) current = section.id;
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--secondary)';
    }
  });
});

// ==================== INTERSECTION ANIMATIONS ====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.product-card, .connect-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ==================== STATS COUNTER ====================
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const number = entry.target.querySelector('.stat-number');
      const text = number.textContent;
      const value = parseInt(text.replace(/[^0-9]/g, ''));
      if (!isNaN(value)) {
        let current = 0;
        const increment = value / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            number.textContent = text;
            clearInterval(timer);
          } else {
            number.textContent = Math.floor(current) + text.replace(/[0-9]/g, '');
          }
        }, 30);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));

// ==================== EMAIL JS CONFIGURATION ====================
const EMAILJS_CONFIG = {
  serviceID: 'service_ze3v49s',
  templateID: 'template_krzufnq',
  publicKey: 'lwu3SWo8-39AxFZ1C'
};

(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized successfully');
  } else {
    console.error('EmailJS library not loaded');
  }
})();

function showToast(message, isError = false) {
  if (toast) {
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.backgroundColor = isError ? '#ff6b6b' : '#00d4aa';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
  }
}

// ==================== CONTACT FORM HANDLER ====================
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const fields = [
      { el: document.getElementById('name'), validate: v => v.trim().length > 1 },
      { el: document.getElementById('email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { el: document.getElementById('subject'), validate: v => v.trim().length > 2 },
      { el: document.getElementById('message'), validate: v => v.trim().length > 6 }
    ];

    let isValid = true;
    fields.forEach(field => {
      const errorMsg = field.el.nextElementSibling;
      const value = field.el.value || '';
      if (!field.validate(value)) {
        isValid = false;
        if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.style.display = 'block';
        field.el.style.borderColor = '#ff6b6b';
      } else {
        if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.style.display = 'none';
        field.el.style.borderColor = '';
      }
    });

    if (!isValid) {
      fields.find(f => !f.validate(f.el.value || ''))?.el.focus();
      return false;
    }

    if (typeof emailjs === 'undefined') {
      showToast('✗ Email service not loaded. Please try WhatsApp or call us.', true);
      return false;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })
    };

    // Send only main contact email
    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, formData)
      .then(() => {
        showToast('✓ Thank you! Message received — we will respond soon.');
        contactForm.reset();
      })
      .catch(() => {
        showToast('✗ Failed to send message. Please try WhatsApp or email directly.', true);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });

  contactForm.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function () {
      const errorMsg = this.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.style.display = 'none';
      this.style.borderColor = '';
    });
  });
}

// ==================== MISC FIXES ====================
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
});
document.addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));
