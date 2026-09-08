/* UTAS — hand-drawn control layer, via drawably (vendored in /vendor/drawably).

   EXPERIMENT. Everything here is additive and reversible: `git checkout` the
   working tree and the site returns to its printed-rule state.

   The idea being tested: a single sketched button next to machine-crisp hairlines
   reads as a mistake, so either every rule and control is drawn by the same pen
   or none is. Headings stay Bodoni — the pen is for the furniture, not the type.

   Loaded as a module on purpose. Anything that cannot run ESM never executes it
   and keeps the printed rules, which are a complete design on their own. The
   sketch is decoration layered over working markup, never a replacement for it.

   Attach first, class second: if drawably throws we want the element to keep the
   border it already had rather than end up with nothing. */

import { drawablyButton, drawablyDivider, drawablyCircle }
  from '/vendor/drawably/index.js';

var root = getComputedStyle(document.documentElement);
function token(name, fallback) {
  return (root.getPropertyValue(name) || '').trim() || fallback;
}

var SAND = token('--sand', '#E4D8C0');
var BLUE = token('--blue', '#002FA7');

/* The printed rules sit at 18–22% of the text colour. A full-strength pen line
   in their place shouts, so the drawn ones are held back to roughly match. */
var RULE_ON_BLUE = 'rgba(228,216,192,.55)';
var RULE_ON_SAND = 'rgba(0,47,167,.55)';

function onBlue(el) {
  return !!el.closest('.plate--blue, .banner, .hero');
}

function each(sel, fn) {
  Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
}

function attach(fn, el, opts) {
  try {
    fn(el, opts);
    return true;
  } catch (err) {
    return false;
  }
}

/* ── Controls ─────────────────────────────────────────────────
   Both the big CTAs and the small "next" links, so the page has one
   button language rather than two. */
each('.btn, .next a', function (el) {
  var blue = onBlue(el);
  var ink = blue ? SAND : BLUE;
  if (attach(drawablyButton, el, {
    variant: 'outline',
    stroke: ink,
    fill: ink,
    paper: blue ? BLUE : SAND,
    width: 2
  })) el.classList.add('is-sketched');
});

/* ── Rules ────────────────────────────────────────────────────
   drawably will not draw onto a CSS border, so each printed rule is
   switched off and a real element put in its place for the pen. */
function rule(host, placement, variant) {
  var div = document.createElement('div');
  div.className = 'sketch-rule sketch-rule--' + variant;
  div.setAttribute('aria-hidden', 'true');

  if (placement === 'after') host.after(div);
  else if (placement === 'before') host.before(div);
  else if (placement === 'append') host.append(div);
  else host.prepend(div);

  if (attach(drawablyDivider, div, {
    stroke: onBlue(host) ? RULE_ON_BLUE : RULE_ON_SAND,
    width: 2
  })) {
    host.classList.add('is-sketched');
  } else {
    div.remove();
  }
}

each('.plate__head',  function (el) { rule(el, 'after',   'head'); });
each('.next',         function (el) { rule(el, 'before',  'next'); });
/* Cards, columns and verticals are grid items, so their rule goes inside
   rather than alongside — a sibling would become a stray cell and break
   the columns. Each of these wears its rule on top. */
each('.card',         function (el) { rule(el, 'prepend', 'card'); });
each('.compare__col', function (el) { rule(el, 'prepend', 'card'); });
each('.vert',         function (el) { rule(el, 'prepend', 'card'); });

/* List rows. The rule is appended inside each row and pulled down by the
   row's own bottom padding so it lands exactly where the border was. The
   first row of a set also needs the rule that used to sit on top of it. */
each('.weeks, .roles', function (list) {
  Array.prototype.forEach.call(list.children, function (row, i) {
    if (i === 0) rule(row, 'prepend', 'row-top');
    rule(row, 'append', 'row');
  });
});
each('.foot__grid',   function (el) { rule(el, 'append',  'foot'); });

/* ── One annotation ───────────────────────────────────────────
   The thesis line gets looped, the way you would ring a phrase in a proof.
   Only ever one per page; the gesture stops meaning anything if repeated. */
var thesis = document.querySelector('[data-sketch-circle]');
if (thesis) {
  attach(drawablyCircle, thesis, {
    stroke: onBlue(thesis) ? SAND : BLUE,
    width: 2
  });
}
