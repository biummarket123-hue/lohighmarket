/* ============================================
   LOHIGH MARKET — Main JavaScript
   - Navbar scroll effect
   - Mobile menu toggle
   - Counter animation
   - Particles (Bium section)
   - Countdown timer
   - Email signup form
   - AOS init
   ============================================ */

'use strict';

// ── AOS Init ──────────────────────────────
AOS.init({
  duration: 900,
  once: true,
  easing: 'ease-out-cubic',
  offset: 60
});

// ── Navbar Scroll ─────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();

// ── Counter Animation ─────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const duration = 2200;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);

      // Format with comma for numbers >= 1000
      el.textContent = value >= 1000
        ? value.toLocaleString('ko-KR')
        : value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target >= 1000
          ? target.toLocaleString('ko-KR')
          : target;
      }
    };
    requestAnimationFrame(update);
  };

  // IntersectionObserver to trigger when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
})();

// ── Bium Particles ────────────────────────
(function initParticles() {
  const container = document.getElementById('biumParticles');
  if (!container) return;

  const COUNT = 35;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 1.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur = Math.random() * 8 + 6;
    const opacity = Math.random() * 0.35 + 0.05;

    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      left: x + '%',
      top: y + '%',
      borderRadius: '50%',
      background: Math.random() > 0.5
        ? `rgba(13,148,136,${opacity})`
        : `rgba(201,168,76,${opacity * 0.7})`,
      animation: `float ${dur}s ${delay}s ease-in-out infinite`
    });
    container.appendChild(p);
  }

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: var(--op, .15); }
      33%       { transform: translate(${randRange(-20, 20)}px, ${randRange(-30, 30)}px) scale(1.2); }
      66%       { transform: translate(${randRange(-15, 15)}px, ${randRange(-20, 20)}px) scale(0.85); }
    }
  `;
  document.head.appendChild(style);

  function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();

// ── Countdown Timer ───────────────────────
(function initCountdown() {
  // Target: 90 days from now (adjust as needed)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 90);

  const pad = n => String(n).padStart(2, '0');

  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');

  if (!daysEl) return;

  const tick = () => {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      secsEl.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    daysEl.textContent  = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent  = pad(mins);
    secsEl.textContent  = pad(secs);
  };

  tick();
  setInterval(tick, 1000);
})();

// ── Email Signup Form ─────────────────────
(function initSignup() {
  const form    = document.getElementById('signupForm');
  const input   = document.getElementById('emailInput');
  const msgEl   = document.getElementById('signupMsg');

  if (!form) return;

  // Simple email validation
  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      showMsg('올바른 이메일 주소를 입력해 주세요.', 'error');
      input.focus();
      return;
    }

    // Simulate async save (replace with real API if available)
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    await delay(1000);

    showMsg('✓ 등록되었습니다! 런칭 소식을 가장 먼저 알려드릴게요 🎉', 'success');
    input.value = '';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
  });

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'signup-note ' + type;
    setTimeout(() => { msgEl.textContent = ''; msgEl.className = 'signup-note'; }, 5000);
  }
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
})();

// ── Smooth anchor scroll with offset ──────
(function initSmoothScroll() {
  const OFFSET = 80; // navbar height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Parallax subtle effect on Hero ────────
(function initHeroParallax() {
  const overlay = document.querySelector('.hero-overlay');
  const pattern = document.querySelector('.fabric-pattern');
  if (!overlay || !pattern) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      overlay.style.transform = `translateY(${y * 0.18}px)`;
      pattern.style.transform = `translateY(${y * 0.08}px)`;
    }
  }, { passive: true });
})();

// ── Card hover tilt effect ─────────────────
(function initTilt() {
  const cards = document.querySelectorAll('.stat-card, .value-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -3;
      const rotY = ((x - cx) / cx) * 3;
      card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
