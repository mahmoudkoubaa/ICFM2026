/**
 * MATERIAUX 2025 – enhanced UX: nav, smooth scroll, back-to-top, mobile menu
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ----- Cinematic Preloader
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('loaded');
      // Optional: remove it from DOM after transition completes to save memory
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 1000); // 1s matches the 0.8s transition + buffer
    }
  });

  // ----- Active nav link (current page)
  function setActiveNavLink() {
    var path = (window.location.pathname || window.location.href || '').replace(/\\/g, '/');
    var segments = path.split('/').filter(Boolean);
    var page = segments.pop() || 'index.html';
    if (page === '') page = 'index.html';
    document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace(/\\/g, '/');
      if (!href || href === '#') return;
      var linkPage = href.split('/').pop();
      if (linkPage === page) {
        a.classList.add('active');
        var parent = a.closest('.dropdown');
        if (parent) parent.querySelector(':scope > a').classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // ----- Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          var nav = document.querySelector('.nav-links');
          if (nav && nav.classList.contains('open')) nav.classList.remove('open');
        });
      }
    });
  }

  // ----- Back to top button
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    var ticking = false;
    function updateVisibility() {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });
    updateVisibility();
  }

  // ----- Mobile menu: hamburger + close on outside click / Escape
  function createHamburgerIfMissing() {
    var nav = document.querySelector('.navbar .container');
    var links = document.querySelector('.nav-links');
    if (!nav || !links || document.querySelector('.hamburger')) return;

    var btn = document.createElement('button');
    btn.className = 'hamburger';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    function open() {
      links.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (links.classList.contains('open')) close();
      else open();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !nav.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) close();
    });
  }

  // ----- Interactive committee cards (flip)
  function initCommitteeCards() {
    document.querySelectorAll('.interactive-card').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', function () {
        card.classList.toggle('flipped');
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }

  // Removed Custom Cursor as requested

  // ----- 3D Tilt Effect
  function initTiltEffect() {
    var cards = document.querySelectorAll('.about-card, .committee-card, .key-link-card, .date-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
        var rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s, border-color 0.3s';
      });
    });
  }

  // ----- Enhanced Scroll Reveal (Staggered)
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sections = document.querySelectorAll('.about-card, .committee-card, .abstract-download-section, .hotel-info-card, .hotel-details, .hotel-visuals, .key-link-card, .date-card');
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Add a small delay based on the element's position relative to others in the viewport
            var delay = (entry.boundingClientRect.left / window.innerWidth) * 0.2 + (Math.random() * 0.1);
            entry.target.style.transitionDelay = delay + 's';
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
            setTimeout(function () { entry.target.style.transitionDelay = ''; }, 1000);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach(function (el) {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  // ----- Mouse Tracking Glow
  function initMouseTrackingGlow() {
    document.addEventListener('mousemove', function (e) {
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }

  // ----- Hero Canvas Particles (Interactive Physics Constellation)
  function initHeroParticles() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];

    // Track mouse specifically for the canvas
    var mouse = { x: null, y: null, radius: 150 };

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseVx = (Math.random() - 0.5) * 0.8;
      this.baseVy = (Math.random() - 0.5) * 0.8;
      this.vx = this.baseVx;
      this.vy = this.baseVy;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(14, 165, 233, ' : 'rgba(103, 232, 249, ';
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    Particle.prototype.update = function () {
      // Mouse magnetic/repulsion physics
      if (mouse.x != null && mouse.y != null) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          var forceDirectionX = dx / distance;
          var forceDirectionY = dy / distance;
          var maxDistance = mouse.radius;
          var force = (maxDistance - distance) / maxDistance;
          var directionX = forceDirectionX * force * 5;
          var directionY = forceDirectionY * force * 5;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Slowly return to base velocity after being pushed
      this.vx += (this.baseVx - this.vx) * 0.05;
      this.vy += (this.baseVy - this.vy) * 0.05;
    };

    Particle.prototype.draw = function (ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    };

    // Increase particle count for a denser constellation
    for (var i = 0; i < 110; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.update();
        p.draw(ctx);
      });

      // Draw constellation connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var distSq = dx * dx + dy * dy;

          // Connect if close
          if (distSq < 13000) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            var opacity = 0.2 * (1 - distSq / 13000);
            ctx.strokeStyle = 'rgba(14, 165, 233, ' + opacity + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  ready(function () {
    setActiveNavLink();
    initSmoothScroll();
    initBackToTop();
    createHamburgerIfMissing();
    initCommitteeCards();
    initScrollReveal();
    initMouseTrackingGlow();
    initHeroParticles();
  });
})();
