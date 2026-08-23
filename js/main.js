/* UTAS — scroll reveals and link configuration */

(function () {
  'use strict';

  /* ── Scroll-triggered reveals ──────────────────────────────
     Elements carry .reveal; a data-delay attribute staggers
     siblings within the same section. */
  var reveals = document.querySelectorAll('.reveal');

  reveals.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--rd', d);
  });

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  reveals.forEach(function (el) { io.observe(el); });

  /* ── Links ────────────────────────────────────────────────
     Set these once and every reference on the page updates. */
  var LINKS = {
    form:      'https://docs.google.com/forms/d/e/1FAIpQLScoNAQEb1oxcmf0iBlPzaquhxd-byqO6hXU1oGvO8vaZvx2Hw/viewform',
    email:     'utas.uoft@gmail.com',   // club address, not anyone's personal inbox
    instagram: 'https://instagram.com/utas.uoft',
    github:    ''                       // society GitHub org
  };

  function apply(selector, fn) {
    document.querySelectorAll(selector).forEach(fn);
  }

  if (LINKS.form) {
    apply('[data-form-link]', function (a) {
      a.href = LINKS.form;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  if (LINKS.email) {
    apply('[data-email]', function (a) {
      a.href = 'mailto:' + LINKS.email;
      a.textContent = LINKS.email;
    });
  }

  apply('[data-instagram]', function (a) {
    if (LINKS.instagram) { a.href = LINKS.instagram; a.target = '_blank'; a.rel = 'noopener'; }
  });

  apply('[data-github]', function (a) {
    if (LINKS.github) { a.href = LINKS.github; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.remove(); }
  });
})();
