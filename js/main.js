/* UTAS — scroll reveals, nav state, and link configuration */

(function () {
  'use strict';

  /* ── Links ────────────────────────────────────────────────
     Set these once and every page updates. */
  var LINKS = {
    form:      'https://docs.google.com/forms/d/e/1FAIpQLScoNAQEb1oxcmf0iBlPzaquhxd-byqO6hXU1oGvO8vaZvx2Hw/viewform',
    email:     'utas.uoft@gmail.com',   // club address, not anyone's personal inbox
    instagram: 'https://instagram.com/utas.uoft',
    github:    ''                       // empty removes the footer link
  };

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  if (LINKS.form) {
    each('[data-form-link]', function (a) {
      a.href = LINKS.form;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  if (LINKS.email) {
    each('[data-email]', function (a) {
      a.href = 'mailto:' + LINKS.email;
      // Only swap the label when it is itself an address, so links
      // reading "Email" keep their word.
      if (a.textContent.indexOf('@') !== -1) a.textContent = LINKS.email;
    });
  }

  each('[data-instagram]', function (a) {
    if (LINKS.instagram) { a.href = LINKS.instagram; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.remove(); }
  });

  each('[data-github]', function (a) {
    if (LINKS.github) { a.href = LINKS.github; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.remove(); }
  });

  /* ── Nav state ────────────────────────────────────────────
     The bar is transparent over the hero or banner, then fills
     with blue once past it, so sand text never lands on sand. */
  var nav = document.getElementById('nav');
  var top = document.querySelector('.hero, .banner');
  if (nav) {
    var trigger = function () {
      return top ? Math.max(top.offsetHeight - nav.offsetHeight, 10) : 10;
    };
    var update = function () {
      nav.classList.toggle('is-stuck', window.scrollY > trigger());
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // If the tab strip ever does overflow, keep the current tab in view.
    var current = nav.querySelector('[aria-current="page"]');
    if (current && current.scrollIntoView) {
      current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /* ── Scroll-triggered reveals ─────────────────────────────
     data-delay staggers siblings within a section. */
  var reveals = document.querySelectorAll('.reveal');

  each('.reveal', function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--rd', d);
  });

  if (!('IntersectionObserver' in window)) {
    each('.reveal', function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
})();
