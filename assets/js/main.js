/* =========================================================
   Donnovan Wint Jr. — Portfolio interactions
   Progressive enhancement: content works without JS.
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  var finePointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;
  var canAnimate = !prefersReduced;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Year ---------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scrolled state ---------- */
  var header = doc.getElementById('site-header');
  var onScrollHeader = function () {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuToggle = doc.getElementById('menu-toggle');
  var nav = doc.getElementById('primary-nav');
  var closeMenu = function () {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    doc.body.style.overflow = '';
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });
  }

  /* ---------- Theme toggle ---------- */
  var themeToggle = doc.getElementById('theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var effectiveTheme = function () {
    var attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return systemDark.matches ? 'dark' : 'light';
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      var meta = doc.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0d1013' : '#faf9f7');
    });
  }

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  if (!canAnimate || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Hero entrance ----------
     Handled by a self-completing CSS animation (see .hero [data-hero]),
     so the hero is never dependent on JS to become visible. */

  /* ---------- Magnetic buttons ---------- */
  if (canAnimate && finePointer && hasGsap) {
    doc.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var xTo = window.gsap.quickTo(el, 'x', {
        duration: 0.5,
        ease: 'power3.out',
      });
      var yTo = window.gsap.quickTo(el, 'y', {
        duration: 0.5,
        ease: 'power3.out',
      });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        xTo(mx * 0.28);
        yTo(my * 0.4);
      });
      el.addEventListener('mouseleave', function () {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ---------- Project card tilt ---------- */
  if (canAnimate && finePointer && hasGsap) {
    doc.querySelectorAll('[data-tilt]').forEach(function (card) {
      var rxTo = window.gsap.quickTo(card, 'rotationX', {
        duration: 0.6,
        ease: 'power3.out',
      });
      var ryTo = window.gsap.quickTo(card, 'rotationY', {
        duration: 0.6,
        ease: 'power3.out',
      });
      window.gsap.set(card, { transformPerspective: 1000 });
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        rxTo(-py * 4);
        ryTo(px * 4);
      });
      card.addEventListener('mouseleave', function () {
        rxTo(0);
        ryTo(0);
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(
    doc.querySelectorAll('.nav-link')
  );
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? doc.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = '#' + entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle('active', l.getAttribute('href') === id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }
})();
