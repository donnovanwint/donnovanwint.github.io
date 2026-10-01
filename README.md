# donwint.com

Static, dependency-free portfolio site built from the five Claude Design mockups (Hero, About, Selected Work, Experience, Contact). Ready for GitHub Pages: no build step.

## Structure

```
index.html              single page, semantic sections + JSON-LD (Person / ProfilePage)
404.html                GitHub Pages not-found page
assets/css/styles.css   all styles (mobile-first, desktop reproduces the mocks)
assets/js/main.js       tabs, menu, form, GSAP motion (progressive enhancement)
assets/vendor/          GSAP 3.13 + ScrollTrigger (self-hosted)
assets/fonts/           Archivo + Inter variable fonts, Caveat / JetBrains Mono subsets
assets/img/             AVIF + WebP at multiple widths, icons, OG card
assets/resume.pdf       resume download
site.webmanifest, robots.txt, sitemap.xml, favicon.ico, .nojekyll
```

## Deploy to GitHub Pages

1. Put the contents of this folder at the root of the repository (or in `/docs`).
2. Repository Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/` (or `/docs`).
3. For the custom domain, enter `donwint.com` under Pages → Custom domain (this creates a `CNAME` file) and keep "Enforce HTTPS" on.

All paths are relative, so the site also works at `https://<user>.github.io/<repo>/` before the domain is pointed.

## Preview locally

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/.

## How the layout works

- Below 1200px: fluid, stacked layouts (one column on phones, two on tablets).
- At 1200px and up: each section reproduces its mock. Measurements are in "mock pixels" multiplied by `--u` (viewport width / mock width), so the layout scales proportionally up to the mock's native width (1672px for Hero/About, 1536px for the rest) and is centred above that.

## Performance

- AVIF with WebP fallback through `<picture>`, `srcset` + `sizes`, explicit `width`/`height`.
- Hero portrait preloaded with `fetchpriority="high"`; everything below the fold is `loading="lazy"`.
- Self-hosted, subset WOFF2 fonts with `font-display: swap`; the two display/body fonts are preloaded.
- Scripts are `defer`red; the page renders fully without JavaScript.

## Accessibility

- Skip link, landmarks, one `h1`, logical heading order.
- Project list and timeline are WAI-ARIA tabs (arrow keys, Home/End).
- Mobile menu is a disclosure button with `aria-expanded` and Escape to close.
- Text contrast meets WCAG AA; focus outlines are visible on every control.
- All animation is disabled under `prefers-reduced-motion`; content is never hidden if scripts fail.

## Content to replace

- The NASCAR device render, the hero/Experience/Contact skylines and the Freelance photo were cropped from the design mockups. Swap in originals when available (same filenames, regenerate sizes).
- About image: photo by Christopher Gower on Unsplash (https://unsplash.com/photos/m_HRfLhgABo), free to use under the Unsplash License.
- PriceWeber and Sagefrog images are screenshots of their public homepages (captured 2026-09-30).
- The contact form opens the visitor's email app (`mailto:`). For a real inbox form, point `action` at a form service such as Formspree and remove the `submit` handler in `main.js`.
