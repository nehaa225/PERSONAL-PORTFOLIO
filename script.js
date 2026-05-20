document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     THEME TOGGLER
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const themeIcon = themeToggleBtn.querySelector('i');

  // Check stored theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeIcon.className = 'fa-solid fa-moon';
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'dark');
    }
    // Reinitialize particles with the new theme colors if active
    if (typeof initParticles === 'function') {
      initParticles();
    }
  });

  /* ==========================================================================
     INTERACTIVE PARTICLES BACKGROUND (CANVAS)
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const numberOfParticles = 65;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  
  resizeCanvas();

  class Particle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.x = Math.random() * this.width;
      this.y = Math.random() * this.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
    }
    
    update(width, height) {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off walls
      if (this.x > width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw(color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle(canvas.width, canvas.height));
    }
  }

  function connectParticles(lineColor) {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let opacity = 1 - (distance / 110);
          ctx.strokeStyle = lineColor.replace(')', `, ${opacity * 0.12})`).replace('rgb', 'rgba');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Choose particle colors based on active theme
    const isDark = body.classList.contains('dark-theme');
    const particleColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(109, 40, 217, 0.3)';
    const lineColor = isDark ? 'rgb(255, 255, 255)' : 'rgb(109, 40, 217)';
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update(canvas.width, canvas.height);
      particlesArray[i].draw(particleColor);
    }
    connectParticles(lineColor);
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  /* ==========================================================================
     TYPEWRITER EFFECT
     ========================================================================== */
  const typewriterText = document.getElementById('typewriter-text');
  const words = ['Web Developer', 'Data Scientist', 'Problem Solver', 'NSS Volunteer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 120;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typeSpeed = 60; // Delete faster
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeSpeed = 120; // Type normal
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1500; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  if (typewriterText) {
    type();
  }

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = menuToggle.querySelector('i');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuIcon.className = 'fa-solid fa-bars';
    });
  });

  /* ==========================================================================
     INTERSECTION OBSERVER (ACTIVE NAV LINK & SKILLS ANIMATION)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Trigger skill progress bars animation when section is in view
        if (id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function animateSkillBars() {
    const fills = document.querySelectorAll('.level-fill');
    fills.forEach(fill => {
      const parent = fill.parentElement.parentElement;
      if (!parent.classList.contains('fade-out')) {
        // Trigger width animation via width inline property
        const width = fill.getAttribute('style').match(/width:\s*(\d+)%/)[1];
        fill.style.width = width + '%';
      }
    });
  }

  // Pre-initialize skill bar widths to 0, then trigger observers
  const fills = document.querySelectorAll('.level-fill');
  fills.forEach(fill => {
    const targetWidth = fill.style.width;
    fill.setAttribute('style', `width: ${targetWidth}`);
    fill.style.width = '0%';
  });

  /* ==========================================================================
     SKILLS FILTER
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('fade-out');
          // Smooth animate in
          card.style.transform = 'scale(0.8)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            
            // Re-animate the skill bar
            const fill = card.querySelector('.level-fill');
            const targetWidth = fill.getAttribute('style').match(/width:\s*(\d+)%/);
            if (targetWidth) {
              fill.style.width = targetWidth[1] + '%';
            }
          }, 50);
        } else {
          card.classList.add('fade-out');
          // Reset skill bar to 0 when filtered out
          const fill = card.querySelector('.level-fill');
          fill.style.width = '0%';
        }
      });
    });
  });

  /* ==========================================================================
     BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     COPY CONTACT DETAILS TO CLIPBOARD
     ========================================================================== */
  const copyBtn = document.getElementById('copy-contact-btn');
  
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const contactInfo = `Neha Reddy K
Email: nehaareddy02@gmail.com
Phone: +91 7093677995
Location: Hyderabad, India
GitHub: https://github.com/nehaa225
LinkedIn: https://www.linkedin.com/in/neha-reddy-kothinti-3ba901326/`;

      navigator.clipboard.writeText(contactInfo).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        copyBtn.classList.add('btn-primary');
        copyBtn.classList.remove('btn-outline');
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('btn-primary');
          copyBtn.classList.add('btn-outline');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  /* ==========================================================================
     PRINT / RESUME DOWNLOAD
     ========================================================================== */
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     CONTACT FORM VALIDATION & SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      // Simple validations
      if (nameInput.value.trim() === '') {
        nameInput.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('invalid');
      }

      if (subjectInput.value.trim() === '') {
        subjectInput.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        subjectInput.parentElement.classList.remove('invalid');
      }

      if (messageInput.value.trim() === '') {
        messageInput.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('invalid');
      }

      if (isValid) {
        // Mock sending action
        const submitBtn = document.getElementById('btn-submit-form');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

        setTimeout(() => {
          contactForm.classList.add('hidden');
          formFeedback.classList.remove('hidden');
          contactForm.reset();
        }, 1500);
      }
    });

    // Reset error class on input/keypress
    const formControls = contactForm.querySelectorAll('input, textarea');
    formControls.forEach(control => {
      control.addEventListener('input', () => {
        if (control.value.trim() !== '') {
          control.parentElement.classList.remove('invalid');
        }
      });
    });
  }
});
