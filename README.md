# UTAS — website

A static one-page site. No build step, no dependencies, no framework. Open it and it works.

---

## Before it goes live

Three placeholders live in one place — the `LINKS` object at the bottom of
[`js/main.js`](js/main.js). Set them once and every reference on the page updates:

```js
var LINKS = {
  form:      '',                            // ← interest form URL. Until this is set,
                                            //   both CTA buttons stay inert.
  email:     'hello@example.com',           // ← real contact address
  instagram: 'https://instagram.com/utas.uoft',
  github:    ''                             // ← empty removes the footer link entirely
};
```

**The form URL is the one that matters.** The entire site funnels to it, and every CTA is
dead until it's filled in.

---

## Preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly with a `file://` URL mostly
works, but the webfonts and `<picture>` sources are more reliable over HTTP.

## Deploying

It's plain static files, so anything works. In rough order of ease:

- **GitHub Pages** — push the folder to a repo, enable Pages. Free, and it pairs with the
  society's GitHub org where research pods will publish.
- **Netlify / Vercel** — drag the folder onto the dashboard. Free tier, instant custom domain.
- **U of T hosting** — only available once recognised, so not an option before January.

---

## Design

**Direction: gallery monograph.** The site is built to read like an exhibition catalogue
where the exhibition happens to be a student society — vast Klein blue fields, sand as paper
stock, numbered plates, and the paintings presented with museum labels rather than used as
decorative headers.

### Type

| Role | Face | Why |
|---|---|---|
| Display | **Bodoni Moda** | High-contrast didone. Carries the art-book register the paintings set. |
| Body | **Archivo** | Neutral grotesque that gets out of the way under a loud display face. |
| Labels | **IBM Plex Mono** | Uppercase, letter-spaced. Matches the mono labels on the Instagram posts. |

Loaded from Google Fonts. If you ever need the site fully self-contained (offline, or under
a strict content policy), download the four families into `fonts/` and swap the `<link>` for
`@font-face` rules.

### Colour

Same four tokens as the Instagram kit, defined at the top of `css/styles.css`:
`--blue #002FA7` · `--sand #E4D8C0` · `--ink #14161A` · `--white`.

### Structure

Sections alternate sand and blue, numbered `01`–`06` as plates. The two paintings sit at
`Plate I` (hero) and `Plate II` (full-bleed break between sections 02 and 03) so the reader
hits an image roughly every two screens.

---

## Things worth knowing

**Reveals degrade safely.** Sections fade in on scroll, but the hiding only applies when JS
is running — an inline script in `<head>` adds a `.js` class, and the CSS keys off it. If the
script is blocked or fails, every section stays visible rather than the page rendering blank.
Don't remove that inline script without also removing `.js` from the reveal selectors.

**`prefers-reduced-motion` is honoured** — all animation collapses to near-zero duration.

**The status disclaimer in the footer should stay until recognition comes through.** U of T's
policy requires a group's name and representations to make clear it's a student group, and
the right to use "University of Toronto" in the name comes *with* recognition. The footer
currently states plainly that this is an independent initiative, not yet recognised, and does
not represent the University. Removing that before November is the one edit that could
actually cause a problem.

**Image resolution is the real quality ceiling.** The source paintings are 1393×784 and
1191×671. Full-bleed on a 1440px display that's fine; on a 2560px or retina display the hero
will look soft. If you have higher-resolution exports, drop them in and re-run:

```bash
python3 -c "
from PIL import Image
for n in ['the-frontier','the-loop']:
    Image.open('img/%s.jpg'%n).save('img/%s.webp'%n,'WEBP',quality=86,method=6)
"
```

WebP is served first via `<picture>`, with the JPEG as fallback — currently about a 35%
saving.

---

## Files

```
index.html          the whole page
css/styles.css      design system + layout
js/main.js          scroll reveals, LINKS config
img/                the two paintings, jpg + webp
```
