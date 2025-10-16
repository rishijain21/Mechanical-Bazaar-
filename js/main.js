// Initialize
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const goHome = document.getElementById('goHome');
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
if(mobileToggle) {
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('mobile-open');
    const icon = mobileToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      mobileToggle.querySelector('i').classList.remove('fa-times');
      mobileToggle.querySelector('i').classList.add('fa-bars');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if(!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('mobile-open');
      mobileToggle.querySelector('i').classList.remove('fa-times');
      mobileToggle.querySelector('i').classList.add('fa-bars');
    }
  });
}

// Logo click
if(goHome) {
  goHome.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Header scroll
let ticking = false;
window.addEventListener('scroll', () => {
  if(!ticking) {
    window.requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 80);
      ticking = false;
    });
    ticking = true;
  }
});

// ==================== TESTIMONIAL SLIDER ====================
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.tn-dot');
const prevBtn = document.getElementById('prevTest');
const nextBtn = document.getElementById('nextTest');
let currentSlide = 0;
let autoplayInterval;

// Move to target slide
function goToSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i]?.classList.remove('active');
  });

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');
}

// Navigation
function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

// Autoplay
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 6000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Controls
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetAutoplay();
  });
});

// Swipe gestures
let touchStartX = 0;
let touchEndX = 0;

const track = document.querySelector('.testimonial-track');
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) { 
      nextSlide(); 
      resetAutoplay(); 
    }
    else if (touchEndX - touchStartX > 50) { 
      prevSlide(); 
      resetAutoplay(); 
    }
  }, { passive: true });
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { 
    nextSlide(); 
    resetAutoplay(); 
  }
  if (e.key === 'ArrowLeft') { 
    prevSlide(); 
    resetAutoplay(); 
  }
});

// Pause autoplay when tab is not visible
document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    clearInterval(autoplayInterval);
  } else {
    startAutoplay();
  }
});

// Initialize testimonial slider
if (slides.length > 0) {
  goToSlide(0);
  startAutoplay();
}
// ==================== END TESTIMONIAL SLIDER ====================

// Contact Form
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

if(contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
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
      
      if(!field.validate(value)) {
        isValid = false;
        if(errorMsg && errorMsg.classList.contains('error-msg')) {
          errorMsg.style.display = 'block';
        }
        field.el.style.borderColor = '#ff6b6b';
      } else {
        if(errorMsg && errorMsg.classList.contains('error-msg')) {
          errorMsg.style.display = 'none';
        }
        field.el.style.borderColor = '';
      }
    });

    if(!isValid) {
      const firstInvalid = fields.find(f => !f.validate(f.el.value || ''));
      if(firstInvalid) firstInvalid.el.focus();
      return;
    }

    showToast('✓ Thank you! Message received — we will respond soon.');
    contactForm.reset();
  });

  contactForm.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
      const errorMsg = this.nextElementSibling;
      if(errorMsg && errorMsg.classList.contains('error-msg')) {
        errorMsg.style.display = 'none';
      }
      this.style.borderColor = '';
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if(href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Active nav based on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if(window.scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if(link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--secondary)';
    }
  });
});

// Prevent body scroll when mobile menu is open
const style = document.createElement('style');
style.textContent = `
  body.menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
`;
document.head.appendChild(style);

if(mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    });
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.product-card, .connect-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const number = entry.target.querySelector('.stat-number');
      const text = number.textContent;
      const value = parseInt(text.replace(/[^0-9]/g, ''));
      
      if(!isNaN(value)) {
        let current = 0;
        const increment = value / 50;
        const timer = setInterval(() => {
          current += increment;
          if(current >= value) {
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

document.querySelectorAll('.stat-card').forEach(card => {
  statsObserver.observe(card);
});

// Performance optimization - lazy load images if needed
if('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.loading = 'lazy';
  });
}

// Add smooth button interactions
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('touchstart', function() {
    this.style.transform = 'scale(0.95)';
  }, { passive: true });
  
  btn.addEventListener('touchend', function() {
    this.style.transform = '';
  }, { passive: true });
});

// Optimize scroll performance
let lastKnownScrollPosition = 0;
let scrollTicking = false;

function updateOnScroll(scrollPos) {
  // Update any scroll-dependent elements here
}

window.addEventListener('scroll', () => {
  lastKnownScrollPosition = window.scrollY;

  if(!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateOnScroll(lastKnownScrollPosition);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.scrollTo(window.scrollX, window.scrollY);
  }, 200);
});

// Add loading state to submit button
const submitBtn = contactForm?.querySelector('button[type="submit"]');
if(submitBtn) {
  contactForm.addEventListener('submit', function() {
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 2000);
  });
}

// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if(prefersReducedMotion.matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}

// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

const keyboardNavStyles = document.createElement('style');
keyboardNavStyles.textContent = `
  body.keyboard-nav *:focus {
    outline: 2px solid var(--secondary) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(keyboardNavStyles);

// Add viewport height fix for mobile browsers
const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', () => {
  setTimeout(setVh, 100);
});

// Service Worker Registration (optional - for PWA capabilities)
if('serviceWorker' in navigator) {
  // Uncomment to enable service worker
  // navigator.serviceWorker.register('/sw.js').catch(() => {});
}