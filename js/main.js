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

  /* ── Nav ──────────────────────────────────────────────────
     The bar is a solid sticky band, so it needs no scroll state.
     This only keeps the current tab in view if the strip overflows. */
  var nav = document.getElementById('nav');
  if (nav) {
    var current = nav.querySelector('[aria-current="page"]');
    if (current && current.scrollIntoView) {
      current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /* ── Scroll-triggered reveals ─────────────────────────────
     data-delay staggers siblings within a section. The root box is
     extended past the fold so anything near it reveals immediately,
     rather than a page opening on a heading and an empty field. */
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
  }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });

  Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
})();
