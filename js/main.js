

    // Initialize
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    const goHome = document.getElementById('goHome');
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu
    if(mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.style.display === 'flex';
        if(!isActive) {
          navMenu.style.display = 'flex';
          navMenu.style.flexDirection = 'column';
          navMenu.style.position = 'absolute';
          navMenu.style.top = '100%';
          navMenu.style.left = '0';
          navMenu.style.right = '0';
          navMenu.style.background = 'rgba(7, 15, 28, 0.98)';
          navMenu.style.backdropFilter = 'blur(20px)';
          navMenu.style.padding = '32px 24px';
          navMenu.style.borderRadius = '0 0 24px 24px';
          navMenu.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
          navMenu.style.gap = '20px';
          navMenu.style.alignItems = 'stretch';
          mobileToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
        } else {
          navMenu.style.display = '';
          mobileToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
      });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if(navMenu.style.display === 'flex') {
          navMenu.style.display = '';
          mobileToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
      });
    });

    // Logo click - scroll to top
    if(goHome) {
      goHome.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Header scroll effect
    let scrolling = false;
    window.addEventListener('scroll', () => {
      if(!scrolling) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 80);
          scrolling = false;
        });
        scrolling = true;
      }
    });

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal, .product-card, .connect-card').forEach(el => {
      observer.observe(el);
    });

    // Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.tn-dot');
    const prevBtn = document.getElementById('prevTest');
    const nextBtn = document.getElementById('nextTest');
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Testimonial controls
    if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
      if(e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    });

    // Initialize slider
    goToSlide(0);
    startAutoplay();

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    function showToast(message) {
      toast.textContent = message;
      toast.style.display = 'block';
      toast.style.opacity = '1';
      
      setTimeout(() => {
        toast.style.transition = 'opacity 500ms';
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.style.display = 'none';
        }, 500);
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

        // Success
        showToast('✓ Thank you! Message received — we will respond soon.');
        contactForm.reset();
      });

      // Clear error on input
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

    // Lazy load images
    if('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }

    // Smooth scroll for anchor links
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

    // Add stagger animation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 100}ms`;
    });

    // Add stagger animation to stats
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 80}ms`;
    });

    // Counter animation for stats
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const number = entry.target.querySelector('.stat-number');
          const text = number.textContent;
          const value = parseInt(text.replace(/[^0-9]/g, ''));
          
          if(!isNaN(value)) {
            number.textContent = '0';
            setTimeout(() => {
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
            }, 200);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
      statsObserver.observe(card);
    });

    // Add entrance animation to hero elements
    window.addEventListener('load', () => {
      const heroElements = document.querySelectorAll('.hero-badge, .hero h1, .hero p, .hero-cta, .stats');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 150);
      });
    });

    // Parallax effect for hero
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroContent = document.querySelector('.hero-content');
      
      if(heroContent && scrollY < window.innerHeight) {
        const speed = 0.5;
        heroContent.style.transform = `translateY(${scrollY * speed}px)`;
        heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
      }
      
      lastScrollY = scrollY;
    });

    // Add micro-interactions to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
      
      btn.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(0) scale(0.98)';
      });
      
      btn.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
    });

    // Add hover effect to social links
    document.querySelectorAll('.social-links a').forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) rotate(5deg)';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });

    // Enhanced WhatsApp float interaction
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if(whatsappFloat) {
      whatsappFloat.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
      });
      
      whatsappFloat.addEventListener('mouseleave', function() {
        this.style.animation = 'floatPulse 3s infinite';
      });
    }

    // Performance optimization - reduce animations on slower devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(prefersReducedMotion.matches) {
      document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
      });
    }

    // Add active state to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(window.scrollY >= (sectionTop - 200)) {
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

    // Add loading state to form submit button
    const submitBtn = contactForm?.querySelector('button[type="submit"]');
    if(submitBtn) {
      contactForm.addEventListener('submit', function() {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }, 2000);
      });
    }

 