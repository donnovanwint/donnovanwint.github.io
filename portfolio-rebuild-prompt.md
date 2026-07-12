# Portfolio Rebuild — Cursor Agent Prompt

Copy everything below the line into Cursor as your task prompt.

---

## Role & Objective

You are a principal-level web designer/engineer rebuilding my personal portfolio site for a **Senior Full Stack Software Engineer**. The bar is **Awwwards Site of the Day** quality — but recruiter-usable. Visual ambition can never come at the cost of speed, clarity, or a hiring manager finding my resume and work in under 10 seconds.

Before writing code, read every resume in `/assets` (`resume.pdf`, plus the QA and Backend variants) and extract real content — skills, tools, years, project details. Do not invent experience. Ask me if something is ambiguous rather than guessing.

## Hard Constraints

- **Hosting: GitHub Pages (static only).** No server, no build-time SSR, no API routes, no serverless functions. Everything must run as static HTML/CSS/JS (or a static build output committed to the repo — e.g. Vite build artifacts). Do not propose Next.js/Nuxt/Vercel-only patterns.
- **Recommended stack:** Vanilla HTML/CSS + modern JS (or Vite for bundling/minification if it meaningfully helps), **GSAP** (+ ScrollTrigger) for animation, no heavy frontend framework needed for a single-page portfolio — avoid React/Vue overhead unless you have a strong performance-neutral reason.
- **Performance budget (non-negotiable):**
  - Lighthouse Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile).
  - First Contentful Paint < 1.5s, Largest Contentful Paint < 2.0s on a throttled 4G profile.
  - Total page weight (excluding the downloadable resume PDF) under ~1.5MB.
  - All images optimized/compressed and served in modern formats (WebP/AVIF with fallback), lazy-loaded below the fold.
  - GSAP animations must be GPU-friendly (transform/opacity only where possible), respect `prefers-reduced-motion`, and never block scroll or input.
  - No layout shift (CLS ~0). No render-blocking web fonts — use `font-display: swap` and preload critical fonts.
- **No UX that punishes recruiters:** no forced intro animation that can't be skipped, no scroll-jacking that traps the user, no infinite parallax that delays reaching content, no cursor-follow effects that interfere with clicking, no autoplay audio/video, no modal/popup interruptions. Every interactive flourish must be skippable or fast (<600ms) and must not delay access to the resume download or contact info.
- **Accessibility:** semantic HTML, proper heading hierarchy, keyboard navigable, visible focus states, sufficient color contrast (WCAG AA minimum), alt text on all images, animations respect `prefers-reduced-motion: reduce`.

## Design Direction

- Principal-designer level visual system: a real typographic hierarchy (pair a distinctive display typeface with a clean workhorse text face), an intentional color palette (not default dark-mode-gradient-purple cliché), consistent spacing scale, and a clear grid.
- GSAP should be used purposefully, not decoratively for its own sake:
  - A confident, fast landing sequence (hero text/name reveal) — under 1 second, skippable via scroll/click.
  - Scroll-triggered reveals for section entrances (subtle, staggered, fast).
  - Micro-interactions on hover for project cards / nav / buttons that feel premium (magnetic buttons, smooth underline reveals, image scale/tilt on hover) — tasteful, not gimmicky.
  - Smooth scrolling is optional and only if it doesn't hurt scroll performance or accessibility (must remain scrollable via keyboard/trackpad without feeling laggy).
- Avoid generic "AI portfolio" tropes: no stock gradient blobs, no generic Bootstrap-card grids, no cliché typing-effect hero text spelling out "Full Stack Engineer."
- Should feel senior/premium and *human* — like a designer sat down and made real decisions, not a template.

## Site Structure / Content

1. **Hero** — name, title (Senior Full Stack Software Engineer), a sharp one-line value prop, fast entrance animation, clear path to scroll or jump to work/resume.
2. **About** — concise, written from `resume.pdf` as the primary source; should read as full-stack-first but implicitly support the adjacent QA/Backend framing (see resume logic below).
3. **Skills/Stack** — organized by category (Frontend, Backend, CMS/WordPress, Testing/QA, DevOps/Monitoring, etc.), pulled from all three resumes so it's comprehensive, but weighted/ordered toward full-stack.
4. **Selected Work** — case-study style cards/sections for each project below. Each entry: role (sole developer), real stack, and 1–2 sentences on impact/complexity. Use GSAP hover/reveal treatment on these cards — this is the section that should feel most "portfolio piece."
5. **Resume / Download** — primary CTA downloads `resume.pdf` explicitly (not the QA or Backend versions). Label clearly (e.g., "Download Resume (PDF)").
6. **Contact** — simple, fast, no unnecessary form friction (mailto/LinkedIn/etc. as applicable).

### Resume Handling Logic
- `resume.pdf` = the one and only resume linked/downloaded from any "Download Resume" button on the site.
- `resume-qa.pdf` and `resume-backend.pdf` (adjust filenames to whatever's actually in `/assets`) are **not** linked as downloads, but their content should inform the site copy so a QA-focused or Backend-focused hiring manager still sees relevant, accurate language in the Skills and Selected Work sections (e.g., testing frameworks, QA methodology, backend architecture depth) without contradicting or diluting the primary full-stack narrative.

### Selected Work — Per-Project Notes (use these exactly, don't default to whatever's in old copy)
- **Greenwald** — WordPress site. Do NOT describe as Vue.js.
- **TradeCentric** — WordPress.
- **John Vena** — WordPress used as the CMS/backend; Vue/Nuxt as the frontend. Convey both explicitly (headless WordPress + Vue/Nuxt frontend).
- **AlphaSense** — React/Next.js frontend with a WordPress backend. Convey both layers in addition to whatever other stack details are already in the original copy — don't drop the React/Next + WordPress framing.
- **NASCAR** — De-emphasize cloud/infra aspects. Instead emphasize WordPress, PHP, testing, and Datadog (monitoring/observability), plus any other relevant tools called out in the resumes.

Pull additional accurate technical detail for each project from the resumes where the existing copy is thin — don't leave a project under-described if the resume has more specific detail to offer.

## Technical Approach

- Set up a clean, componentized file structure even in static HTML (e.g., partials or a lightweight templating/build step via Vite if it improves maintainability) — but confirm the final build output is plain static files GitHub Pages can serve with no server-side processing.
- Inline-critical-CSS or otherwise ensure first paint isn't blocked by a large CSS bundle.
- Use `<picture>`/responsive `srcset` for hero/project images.
- Add proper `<meta>` tags (OpenGraph, Twitter cards, description) so shared links preview well.
- Add a favicon and basic PWA-friendly meta (not necessarily a full PWA).
- Include a sitemap.xml and robots.txt for SEO.
- Set up GitHub Pages deployment correctly (confirm whether this repo publishes from `/root`, `/docs`, or a `gh-pages` branch, and structure output accordingly — ask if unclear).

## Process

1. First, read all resumes in `/assets` and summarize back to me: key skills by category, and a proposed content outline for each Selected Work project — before writing any code.
2. Propose a color palette + typography pairing (with rationale) before building.
3. Build in stages: structure/content → base styles/layout → GSAP interactions/polish → performance pass (image optimization, Lighthouse audit, reduced-motion support) → final QA.
4. At the end, report actual/estimated Lighthouse scores and flag anything that couldn't hit the performance budget and why.

Ask me clarifying questions before starting if anything above is ambiguous (e.g., which resume file is which, exact project list, whether there's an existing brand color to preserve).
