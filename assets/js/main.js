/* donwint.com — interactions and motion.
   Progressive enhancement: the page is fully usable without this file.
   GSAP + ScrollTrigger are loaded (deferred) before this script. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('js');

  /* ---------- Header: scrolled state ---------- */
  const header = $('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu (disclosure) ---------- */
  const menuToggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const setMenu = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    menu?.classList.toggle('is-open', open);
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ---------- Active section in the nav ---------- */
  const navLinks = $$('[data-nav-link]');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const hero = $('#top');
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    [hero, ...sections].filter(Boolean).forEach((s) => io.observe(s));
  }

  /* ---------- Tabs (WAI-ARIA tabs pattern, automatic activation) ---------- */
  const tabGroups = [];
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const vertical = list.getAttribute('aria-orientation') === 'vertical';

    const select = (index, { focus = false, animate = true } = {}) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (panels[i]) panels[i].hidden = !active;
      });
      if (focus) tabs[index].focus();
      if (animate && window.gsap && !reduceMotion.matches && panels[index]) {
        window.gsap.fromTo(panels[index].children, { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
      }
      window.ScrollTrigger?.refresh();
    };

    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tabs.indexOf(tab));
    });
    list.addEventListener('keydown', (e) => {
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      const next = { [vertical ? 'ArrowDown' : 'ArrowRight']: 1, [vertical ? 'ArrowUp' : 'ArrowLeft']: -1 };
      let index = null;
      if (e.key in next) index = (current + next[e.key] + tabs.length) % tabs.length;
      else if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = tabs.length - 1;
      if (index === null) return;
      e.preventDefault();
      select(index, { focus: true });
    });

    tabGroups.push({ tabs, select });
  });

  /* Footer "Selected work" links open the matching project tab. */
  $$('[data-open-project]').forEach((link) => {
    link.addEventListener('click', () => {
      const id = `tab-${link.dataset.openProject}`;
      tabGroups.forEach(({ tabs, select }) => {
        const i = tabs.findIndex((t) => t.id === id);
        if (i > -1) select(i, { animate: false });
      });
    });
  });

  /* ---------- Contact form: validate, then hand off to the visitor's mail app ---------- */
  const form = $('[data-contact-form]');
  if (form) {
    const status = $('[data-form-status]', form);
    const fields = $$('.field__control', form);
    const showError = (field, invalid) => {
      const error = document.getElementById(field.getAttribute('aria-describedby'));
      field.setAttribute('aria-invalid', String(invalid));
      if (error) error.hidden = !invalid;
    };
    fields.forEach((f) => f.addEventListener('input', () => {
      if (f.getAttribute('aria-invalid') === 'true') showError(f, !f.checkValidity());
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach((f) => {
        const invalid = !f.checkValidity() || (f.required && !f.value.trim());
        showError(f, invalid);
        if (invalid && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        status.textContent = 'Please fix the highlighted fields.';
        return;
      }
      const data = new FormData(form);
      const subject = `${data.get('subject')} — from ${data.get('name')}`;
      const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
      window.location.href = `mailto:donnovanwint@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your email app with the message filled in. If nothing opens, email donnovanwint@gmail.com directly.';
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Motion (GSAP) ---------- */
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    root.classList.remove('motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    /* Hero intro */
    const intro = gsap.timeline({ delay: 0.05 });
    intro
      .fromTo('[data-hero-item]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0)
      .fromTo('[data-hero-line]', { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, stagger: 0.1, duration: 1 }, 0.05)
      .fromTo('[data-hero-portrait]', { y: 30, scale: 0.985 }, { y: 0, scale: 1, duration: 1.3 }, 0)
      .from('.stats--hero .stat', { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.7 }, 0.6);

    /* Section reveals */
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.08, overwrite: true }),
    });
    ScrollTrigger.batch('[data-reveal-item]', {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.7, overwrite: true }),
    });

    /* Gentle parallax on large imagery */
    $$('[data-parallax]').forEach((el) => {
      const amount = parseFloat(el.dataset.parallax) || -5;
      gsap.fromTo(el, { yPercent: -amount / 2 }, {
        yPercent: amount / 2, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* Experience watermark drift */
    gsap.fromTo('.experience__watermark', { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '.experience', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* Timeline progress line */
    gsap.fromTo('[data-timeline-fill]', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 55%', scrub: true },
    });

    /* Magnetic primary buttons (pointer devices only) */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.btn--primary, .btn--dark').forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.12);
          yTo((e.clientY - r.top - r.height / 2) * 0.2);
        });
        btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
      });
    }

    return () => root.classList.remove('motion');
  });

  /* If motion is reduced (or changes to reduced), make sure nothing stays hidden. */
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.classList.remove('motion');
    gsap.set('[data-reveal], [data-reveal-item], [data-hero-item], [data-hero-line]', { clearProps: 'all' });
  });

  /* Refresh positions once fonts and late images settle. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
