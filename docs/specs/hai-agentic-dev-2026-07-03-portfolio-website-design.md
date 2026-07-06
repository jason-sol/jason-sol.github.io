# Portfolio website — design spec

Rebuild the `Jason Solanki - Monolith.dc.html` design export as a production-grade static site: Vite + React + TypeScript, deployed to GitHub Pages. The export is the visual contract; this spec defines the engineering to make it real.

## Goals

- Ship the export's design 1:1 — intro overlay, four-phase Hero scroll story, Ticker, About with Dissolve portrait, Stack, Experience timeline, Projects, Education, Contact — as a fast, accessible static site.
- Make the repo itself a portfolio artifact: clean component architecture, typed Content model, test-first suite, CI. A recruiter reading the source should find evidence for every claim the site makes.
- Full test showcase: Vitest unit tests for all Animation hooks and logic, Playwright smoke + axe accessibility + Reduced-motion E2E, all in CI.

## Non-goals

- No CMS, no backend, no analytics (can be added later).
- No pixel-perfect fidelity on sub-880px layouts beyond what the export attempted — mobile gets a clean single-column adaptation, not a separate design.
- No blog or additional routes; this is a single page.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Stack | Vite + React + TypeScript | Component architecture showcase; matches Jason's professional stack; static output for Pages |
| Styling | CSS Modules + Design tokens in `src/styles/tokens.css` | Responsive via real CSS (the export patched inline styles from JS); accent themable via one token |
| Animation | Hand-written Animation hooks, no motion library | The custom scroll/canvas work is the skill demo; keeps bundle tiny |
| Content | Typed Content model in `src/content/site.ts` | Single source of truth; stats appear once, referenced by Ticker/Hero/Experience |
| Hosting | GitHub Pages via Actions | Free, next to the code; repo renamed to `jason-sol.github.io` 2026-07-03, so Base path is `/` |
| Testing | Vitest + Testing Library, Playwright (smoke, axe, reduced-motion) | "TEST-FIRST, ALWAYS" claim on the site must be true of the repo |
| Contact details | Phone number removed from Footer | Jason's decision 2026-07-03; email + LinkedIn + GitHub remain |
| Faint-text contrast | `--text-faint` lightened `#5a5a64` → `#82828e` | WCAG AA small-text compliance (2.88:1 → 5.18:1); Jason's decision 2026-07-06 — accessibility over strict export fidelity. The About word-reveal keeps the export's 0.13 dim state via an sr-only copy + documented single-element axe exclusion (pure-decoration exemption, WCAG 1.4.3) |

## Architecture

```
index.html                    # title, meta description, OG tags, fonts (display=swap), favicon
vite.config.ts                # base path, vitest config
.github/workflows/ci.yml      # lint → typecheck → unit → build → e2e → deploy (main only)
src/
  main.tsx
  App.tsx                     # composes the ten Sections in order
  content/site.ts             # Content model: identity, stats, stack groups, roles, projects, education, links
  styles/tokens.css           # Design tokens: --accent, surfaces, text tiers, fonts
  styles/global.css           # reset, selection, keyframes shared across Sections
  hooks/                      # useScrollProgress, useReveal, useCountUp, useReducedMotion, usePrefersFinePointer
  components/ui/              # SectionLabel, Tag, Card, LinkButton, Marquee, StatCounter
  components/effects/         # IntroOverlay, CursorTrail, Orb, DissolvePortrait, HeroBackdrop
  components/sections/        # Nav, Hero, Ticker, About, Stack, Experience, Projects, Education, Contact, Footer
  assets/jason.jpg            # portrait (Jason to supply)
e2e/                          # Playwright: smoke.spec, a11y.spec, reduced-motion.spec
```

Data flow is one-way: Content model → Section props → UI primitives. Effects read scroll/pointer state via Animation hooks and render to canvases/portals; they never own content.

## Accessibility & edge cases

- Semantic landmarks (`header`, `nav`, `main`, `section` with labelled headings, `footer`), skip-link, visible focus styles, real heading hierarchy (the export has none).
- Reduced-motion mode: Intro overlay, Orb, Cursor trail, Hero backdrop animation and blur transitions disabled; Reveals and counters render in final state. Asserted by E2E.
- Cursor trail mounts only for fine pointers; canvases are `aria-hidden`; rAF loops pause when the tab is hidden.
- Dissolve portrait falls back to a styled frame if `jason.jpg` is missing or fails to load — About never breaks.
- Intro overlay: click or Escape to skip; skipped entirely when arriving with a URL hash; body scroll-lock always restored.
- Email is a plain `mailto:` link — the export's Cloudflare obfuscation is dropped.

## Testing

- Unit (written first, per TDD): scroll-phase range math, count-up easing, dissolve cell thresholds, hook mount/unmount hygiene, Content model schema.
- E2E: all Sections render with expected headings and anchor targets; axe scan passes; reduced-motion run shows content without Effects.
- CI gates every push; deploy runs only on `main` after all gates pass.

## Resolved questions (2026-07-03)

1. **Email address**: `jassol2013@gmail.com` — lives in the Content model, rendered as a plain `mailto:` link.
2. **Repo renamed** to `jason-sol.github.io`; Base path `/`.
3. **Nav WORK link**: repointed to the Experience Section (`#experience`); the About Section keeps its own `#about` anchor. Fixes the export bug where `#work` sat on About.
4. **Portrait photo**: supplied, processed (rotated upright, 4:5 crop, 880×1100, EXIF stripped) at `src/assets/jason.jpg`.

## Remaining pre-launch step

- The GitHub repo is currently **private**; GitHub Pages user sites require it to be **public**. Flip visibility at deploy time — needs Jason's explicit go-ahead since it publishes the full git history.
