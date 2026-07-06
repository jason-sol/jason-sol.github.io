# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED: pick one Phase 4 implementer based on harness capabilities and coordination needs — `hai-agentic-dev:agent-teams-development` (when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set and tasks need inter-agent coordination), `hai-agentic-dev:subagent-driven-development` (default for Claude Code with subagents), or `hai-agentic-dev:executing-plans` (separate-session or non-Claude-Code execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `Jason Solanki - Monolith.dc.html` design export as a production-grade static site (Vite + React + TypeScript) deployed to GitHub Pages at the root URL.

**Architecture:** Ten Sections composed in `App.tsx`, fed one-way from a typed Content model. Effects are page-level decorations gated by Reduced-motion mode. All scroll/motion logic lives in Animation hooks and pure functions so it is unit-testable without a browser.

**Tech Stack:** Vite 7, React 19, TypeScript 5 (strict), CSS Modules + Design tokens, Vitest 3 + Testing Library, Playwright + @axe-core/playwright, GitHub Actions → GitHub Pages.

**Compliance:** None — personal site, no Class B / medical-device testing obligations.

**Visual source of truth:** `Jason Solanki - Monolith.dc.html` (untracked, repo root). Section tasks cite its line ranges instead of duplicating 900 lines of markup here. Copy all inline styles' values into CSS Modules, replacing hardcoded colors/fonts with Design tokens and `style-hover` attributes with `:hover` rules.

**Glossary:** `UBIQUITOUS_LANGUAGE.md` — use canonical terms (Section, Effect, Hero phase, Reveal, Content model, …) in all identifiers.

**Prior solutions:** none exist (fresh repo).

**Commit policy (overrides the per-task commit steps below):** Jason's global rules forbid commits without his explicit instruction in-session. The executor must ask once at execution start: "Plan prescribes a commit per task — OK to commit as I go on this branch?" If yes, follow the commit steps; if no, stage per task and stop at the end of each work group for review.

**Known decisions already made (do not re-litigate):**
- Nav WORK link → `#experience` (fixes export bug where `#work` sat on About); About uses `#about`.
- Contact email `jassol2013@gmail.com` as a plain `mailto:`; no phone number anywhere.
- Base path `/` (repo already renamed to `jason-sol.github.io`).
- Portrait already processed at `src/assets/jason.jpg` (880×1100, EXIF-stripped).
- Repo visibility flip to public happens only in Task 21 with Jason's explicit OK.

---

## File structure

```
index.html                          # meta/OG, Google Fonts (display=swap), favicon
package.json / tsconfig.json / vite.config.ts / eslint.config.js / playwright.config.ts
.github/workflows/ci.yml            # lint → typecheck → unit → build → e2e → deploy (main only)
public/favicon.svg
src/
  main.tsx                          # React root
  App.tsx                           # Section composition + Effects mount
  content/site.ts                   # Content model (types + data)
  content/site.test.ts              # invariants
  styles/tokens.css                 # Design tokens
  styles/global.css                 # reset, selection, shared keyframes
  hooks/useScrollProgress.ts(+.test.ts)
  hooks/useReveal.ts(+.test.ts)
  hooks/useCountUp.ts(+.test.ts)
  hooks/useMediaQuery.ts(+.test.ts) # useReducedMotion + usePrefersFinePointer
  lib/heroPhases.ts(+.test.ts)      # pure Hero-phase visibility math
  lib/easing.ts(+.test.ts)
  lib/dissolve.ts(+.test.ts)        # cell thresholds for Dissolve portrait
  lib/splitWords.ts(+.test.ts)
  lib/orbPath.ts(+.test.ts)         # waypoint segment interpolation
  components/ui/{SectionLabel,Tag,Card,LinkButton,Marquee,StatCounter}.tsx (+ .module.css, tests)
  components/effects/{IntroOverlay,CursorTrail,Orb,DissolvePortrait,HeroBackdrop}.tsx (+ tests)
  components/sections/{Nav,Hero,Ticker,About,Stack,Experience,Projects,Education,Contact,Footer}.tsx
  assets/jason.jpg
e2e/{smoke,a11y,reduced-motion}.spec.ts
```

## Cross-cutting section requirements (apply to every task in WG1–WG4)

The export has **no heading elements and no focus styles** — do not copy that.
- Hero renders the page's only `<h1>` (the name); its test asserts `getByRole('heading', { level: 1 })`.
- Content Sections (About, Stack, Experience, Projects, Education, Contact) each render an `<h2>` (the display title; where the design's only title is the Section label, render the label text inside the `<h2>` styled identically) and assert `getByRole('heading', { level: 2 })` in their test.
- **Exempt: Nav, Ticker, Footer** — they have no display title (glossary exempts them from Section labels). Nav/Footer are landmarks (`nav`/`contentinfo`) needing no heading; Ticker gets `aria-label="Highlights"` on its container instead.
- Interactive elements rely on the `:focus-visible` style from Task 2 — never `outline: none` without a replacement.
- Task 20's smoke assertion reads accordingly: h1 in Hero + one visible h2 per content Section.

---

## Work Group 1: Walking skeleton + CI → PR: `feat/wg1-walking-skeleton`

**Source:** spec §Architecture, §Decisions
**Tasks:** 1–5
**Depends on:** None
**Can parallelize with:** None (everything depends on this)
**Ships:** a live-buildable page with Nav, Contact, Footer rendered from the Content model, full toolchain and CI.

### Task 1: Toolchain scaffold

**Files:** Create `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `.gitignore`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

Config-only task — TDD exception per `using-hai-agentic-dev` (pure config). Verification is the build/dev commands.

- [x] **Step 1:** Write `package.json`:

```json
{
  "name": "jason-sol.github.io",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src e2e",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

- [x] **Step 2:** Install deps (creates lockfile):

```bash
npm i react react-dom
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom \
  vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [x] **Step 3:** Write `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

`src/test-setup.ts`: `import '@testing-library/jest-dom/vitest'`

- [x] **Step 4:** Write `tsconfig.json` (strict, bundler resolution, `"jsx": "react-jsx"`), `eslint.config.js` (typescript-eslint recommended + react-hooks + jsx-a11y), `.gitignore` (`node_modules`, `dist`, `test-results`, `playwright-report`), `index.html` with `<div id="root">`, fonts link from export line 12 (`display=swap` already in URL), `<title>Jason Solanki — Full-Stack Engineer</title>`, meta description, OG tags (og:title, og:description, og:url `https://jason-sol.github.io/`). `src/main.tsx` renders `<App/>`; `App.tsx` returns `<main>placeholder</main>`.

- [x] **Step 5:** Verify: `npm run build` → exits 0, `dist/` produced. `npm run lint` → 0 errors.

- [x] **Step 6:** Commit — `chore: scaffold vite react-ts toolchain` (see Commit policy).

### Task 2: Design tokens + global styles

**Files:** Create `src/styles/tokens.css`, `src/styles/global.css`; modify `src/main.tsx` (import both)

Values extracted from the export (lines 13–27): bg `#0b0b0e`, surface `#0e0e12`, line `#1c1c22`, line-strong `#26262e`, text `#e8e6e1`, text-mid `#a8a8b2`, text-dim `#8a8a93`, text-faint `#5a5a64`, accent `#57e6e0`; font stacks Unbounded / Space Grotesk / Instrument Serif / IBM Plex Mono.

- [x] **Step 1:** `tokens.css` — `:root { --bg: …; --accent: #57e6e0; … --font-display: 'Unbounded', sans-serif; … }` (one token per value above).
- [x] **Step 2:** `global.css` — margin reset, `background: var(--bg)`, `::selection`, `html { scroll-behavior: smooth }`, keyframes `rise|marquee|gridMove|driftA|driftB|glowPulse|blink|hintLine` copied from export lines 17–24, plus `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }`, plus visible focus styles the export lacks: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` and a `.skip` link rule (visually hidden until focused).
- [x] **Step 3:** Verify: `npm run dev`, page background is `#0b0b0e`. Commit — `feat: add design tokens and global styles`.

### Task 3: Content model (test-first)

**Files:** Create `src/content/site.test.ts`, then `src/content/site.ts`

- [x] **Step 1: Write the failing test** `src/content/site.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { site } from './site'

describe('Content model invariants', () => {
  it('has exactly 4 hero phases', () => expect(site.heroPhases).toHaveLength(4))
  it('nav WORK link targets the experience section', () => {
    const work = site.nav.find((l) => l.label === 'WORK')
    expect(work?.href).toBe('#experience')
  })
  it('contact email is a valid mailto target', () =>
    expect(site.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
  it('ticker stat items reference the shared stats entity (single-sourced)', () => {
    const statItems = site.ticker.filter((t) => 'statKey' in t)
    expect(statItems.length).toBeGreaterThanOrEqual(3)
    for (const t of statItems) expect(site.stats).toHaveProperty(t.statKey)
  })
  it('contains no phone number anywhere', () =>
    expect(JSON.stringify(site)).not.toMatch(/\d{4}\s?\d{3}\s?\d{3}/))
  it('external links are https', () => {
    for (const l of [site.contact.github, site.contact.linkedin]) expect(l).toMatch(/^https:\/\//)
  })
  it('every project has 1+ tags and non-empty blurb', () => {
    for (const p of site.projects) {
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.blurb.length).toBeGreaterThan(20)
    }
  })
})
```

- [x] **Step 2:** Run `npm test -- site` → FAIL (module not found).
- [x] **Step 3:** Write `src/content/site.ts`: interfaces `NavLink`, `HeroPhase`, `Stat`, `StackGroup`, `Role`, `Project`, `Education`, `Contact`, `Site`; shared `stats` record (pull requests, repositories, clinicians, sites, services, risks) that Ticker, Hero phases and the Experience impact log reference rather than restating (glossary "Stats duplication" resolution); ticker items are a discriminated union `{ statKey: keyof Site['stats'] } | { text: string }` so single-sourcing is type-enforced; export `const site: Site` with ALL copy transcribed from the export — nav (line 54–62, WORK→`#experience`), hero phases (81–120), ticker stats (139–144), about statement + 3 stats (146–172), stack groups (174–242), roles (244–303), projects (305–338), education (340–353), contact (355–373: email `jassol2013@gmail.com`, GitHub `https://github.com/jason-sol`, LinkedIn URL from line 365, **no phone**), footer strings.
- [x] **Step 4:** Run `npm test -- site` → PASS.
- [x] **Step 5:** Commit — `feat: add typed content model with invariant tests`.

### Task 4: Nav, Contact, Footer sections + first UI primitives

**Files:** Create `src/components/ui/{SectionLabel,LinkButton}.tsx` (+ module.css + tests), `src/components/sections/{Nav,Contact,Footer}.tsx` (+ module.css + tests); modify `src/App.tsx`

- [x] **Step 1: Write failing tests.** Exemplar `Nav.test.tsx` (same pattern for Contact/Footer):

```tsx
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

it('renders all nav links from the content model with correct anchors', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: /work/i })).toHaveAttribute('href', '#experience')
  expect(screen.getByRole('link', { name: /stack/i })).toHaveAttribute('href', '#stack')
  expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
})
it('is a nav landmark', () => {
  render(<Nav />)
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})
```

Contact test asserts: `mailto:` href from content model, GitHub/LinkedIn links with `target="_blank"` + `rel="noreferrer"`. Footer test asserts: © line present, no phone-number pattern in rendered text.

- [x] **Step 2:** Run → FAIL. **Step 3:** Implement from export (Nav 53–62, Contact 355–366, Footer 368–372; footer drops the phone span). Add skip-link (`<a class="skip" href="#about">Skip to content</a>`) as first element in Nav. **Step 4:** Run → PASS. **Step 5:** Compose in `App.tsx` (`<Nav/><main>…</main>` with Contact inside main, Footer after). Verify visually with `npm run dev`. Commit — `feat: add nav, contact and footer sections`.

### Task 5: CI + deploy workflow + Playwright smoke

**Files:** Create `.github/workflows/ci.yml`, `playwright.config.ts`, `e2e/smoke.spec.ts`

- [x] **Step 1:** `playwright.config.ts` — `webServer: { command: 'npm run preview', port: 4173, reuseExistingServer: true }`, project chromium, `use: { baseURL: 'http://localhost:4173' }`.
- [x] **Step 2: Write failing smoke test** `e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('page renders nav and contact', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
})
```

- [x] **Step 3:** `npm run build && npm run e2e` → PASS (smoke is green already at this point; it becomes the regression net for later groups).
- [x] **Step 4:** `.github/workflows/ci.yml`:

```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
permissions: { contents: read }
jobs:
  checks:
    runs-on: ubuntu-latest
    concurrency: { group: "ci-${{ github.ref }}", cancel-in-progress: true }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install chromium --with-deps
      - run: npm run e2e
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: checks
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    concurrency: { group: pages, cancel-in-progress: false }
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [x] **Step 5:** Commit — `ci: add lint/test/build/e2e pipeline with pages deploy`.

---

## Work Group 2: Hero + Ticker → PR: `feat/wg2-hero-scroll-story`

**Source:** spec §Architecture; export lines 64–144
**Tasks:** 6–9
**Depends on:** WG1
**Can parallelize with:** WG3, WG4

### Task 6: Hero-phase visibility math (pure, test-first)

**Files:** Create `src/lib/heroPhases.test.ts`, `src/lib/heroPhases.ts`

- [x] **Step 1: Failing test:**

```ts
import { describe, expect, it } from 'vitest'
import { phaseStyle, activePhaseIndex } from './heroPhases'

describe('phaseStyle', () => {
  it('phase 0 fully visible at p=0', () => expect(phaseStyle(0, 0).opacity).toBe(1))
  it('phase 0 gone by p=0.29', () => expect(phaseStyle(0, 0.29).opacity).toBe(0))
  it('phase 1 hidden at p=0.27, visible at p=0.40', () => {
    expect(phaseStyle(1, 0.27).opacity).toBe(0)
    expect(phaseStyle(1, 0.4).opacity).toBe(1)
  })
  it('phase 3 stays visible at p=1 (out-range beyond scroll)', () =>
    expect(phaseStyle(3, 1).opacity).toBe(1))
})
describe('activePhaseIndex', () => {
  it.each([[0.1, 0], [0.3, 1], [0.6, 2], [0.9, 3]])('p=%f → %i', (p, i) =>
    expect(activePhaseIndex(p)).toBe(i))
})
```

- [x] **Step 2:** Run → FAIL. **Step 3:** Implement — port ranges table and `sm`/`clamp` from export lines 557–588: `phaseStyle(i, p)` returns `{ opacity, translateY, scale, blur }`; `activePhaseIndex(p)` returns 0–3 via the 0.255/0.505/0.755 breakpoints. **Step 4:** PASS. **Step 5:** Commit — `feat: add hero phase visibility math`.

### Task 7: useScrollProgress (test-first)

**Files:** Create `src/hooks/useScrollProgress.test.ts`, `src/hooks/useScrollProgress.ts`

- [x] **Step 1: Failing test** (jsdom): `renderHook`, mock `ref.current.getBoundingClientRect` (`top: -1000, height: 4 * innerHeight`), dispatch `scroll` event, assert returned progress ≈ `1000 / (height - innerHeight)`; assert rAF throttling (two scroll events, one rAF flush → one recompute) and listener removal on unmount (`removeEventListener` spy).
- [x] **Step 2:** FAIL. **Step 3:** Implement: `useScrollProgress(ref): number` — passive scroll listener + rAF tick guard (port of export lines 565–575), recompute on `resize` too, cleanup both. **Step 4:** PASS. **Step 5:** Commit — `feat: add scroll progress hook`.

### Task 8: Hero section + HeroBackdrop

**Files:** Create `src/components/effects/HeroBackdrop.tsx`, `src/components/sections/Hero.tsx` (+ module.css + test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** renders all 4 Hero phases' headline text from the Content model; container has `id="top"`; progress-rail dots = 4; backdrop wrapper `aria-hidden="true"`.
- [x] **Step 2:** FAIL. **Step 3:** Implement from export 64–136: sticky 380vh wrapper; phases positioned absolute, styles driven by `phaseStyle(i, useScrollProgress(ref))`; HeroBackdrop = grid + light-lines (export 68–78), pure CSS animation, `display: none` when Reduced-motion (via `useReducedMotion` — if WG5 not merged yet, use the CSS `@media (prefers-reduced-motion)` in module.css; do not block on WG5). Blur transitions skipped under reduced motion (export line 586 behaviour). **Step 4:** PASS + visual check at 3 scroll depths. **Step 5:** Commit — `feat: add hero scroll story`.

### Task 9: Ticker + Marquee primitive

**Files:** Create `src/components/ui/Marquee.tsx` (+ module.css + test), `src/components/sections/Ticker.tsx` (+ test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** Marquee renders children twice (loop copy) with the duplicate `aria-hidden="true"`; Ticker shows each stat from the Content model exactly once accessibly (`getAllByText(/180\+ pull requests/i)` visible-copy assertion).
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 138–144); `animation-play-state: paused` under reduced motion. **Step 4:** PASS. **Step 5:** Commit — `feat: add stat ticker`.

---

## Work Group 3: About + Stack → PR: `feat/wg3-about-stack`

**Source:** export lines 146–242
**Tasks:** 10–13
**Depends on:** WG1
**Can parallelize with:** WG2, WG4

### Task 10: easing + useCountUp + useReveal (test-first)

**Files:** Create `src/lib/easing.ts(+.test.ts)`, `src/hooks/useCountUp.ts(+.test.ts)`, `src/hooks/useReveal.ts(+.test.ts)`

- [x] **Step 1: Failing tests:** `easeOutCubic(0)=0, (1)=1, (0.5)=0.875`; `useCountUp(70)` with mocked rAF/`performance.now` reaches 70 at t≥1400ms and is monotonic; returns 70 immediately under reduced motion (do not block on WG5's `useReducedMotion` — inline a `matchMedia('(prefers-reduced-motion: reduce)')` check here, refactor to the hook when WG5 merges). `useReveal` flips `visible` when the mocked IntersectionObserver fires, honours `delay`, unobserves after reveal.
- [x] **Step 2:** FAIL. **Step 3:** Implement (port export 451–469, 430–449). IntersectionObserver mocked globally in `src/test-setup.ts`. **Step 4:** PASS. **Step 5:** Commit — `feat: add reveal and count-up animation hooks`.

### Task 11: Dissolve cells (pure) + DissolvePortrait

**Files:** Create `src/lib/dissolve.ts(+.test.ts)`, `src/components/effects/DissolvePortrait.tsx(+.test.tsx)`

- [x] **Step 1: Failing tests:** `makeDissolveCells(16, 20, rng)` returns 320 cells, thresholds in [0, ~1.5], deterministic for a seeded rng, radially biased (corner cell threshold > center cell on average). Component: renders `<canvas aria-hidden>`; on image `error` event renders the styled fallback frame (assert via test id) — **About never breaks** (spec).
- [x] **Step 2:** FAIL. **Step 3:** Implement — port export 515–554; component props `{ src: string; progress: number }`; drawing guarded (`img.complete`, delta ≥ 0.004). **Step 4:** PASS. **Step 5:** Commit — `feat: add dissolve portrait effect with image fallback`.

### Task 12: splitWords (pure) + About section

**Files:** Create `src/lib/splitWords.ts(+.test.ts)`, `src/components/ui/StatCounter.tsx` (+ test; wraps `useCountUp`, renders value + caption), `src/components/sections/About.tsx` (+ module.css + test); modify `src/App.tsx`

- [x] **Step 1: Failing tests:** `litWordCount(fraction, total)` clamps 0..total; About renders statement words as spans, `id="about"`, three StatCounters with values from Content model, portrait wrapped in `<figure>` with FIG. 01 caption.
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 146–172): word spans opacity driven by scroll fraction (React state, no direct DOM writes); grid collapses to 1 column below 1150px via media query (replaces export's JS patching, lines 491–508). **Step 4:** PASS + visual scroll check. **Step 5:** Commit — `feat: add about section with dissolve portrait and word reveal`.

### Task 13: Stack section + Tag primitive

**Files:** Create `src/components/ui/Tag.tsx` (+ module.css + test), `src/components/sections/Stack.tsx` (+ test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** renders one row per StackGroup from Content model, all tag labels present, `id="stack"`; testing row uses accent variant.
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 174–242; hover styles via `:hover`). **Step 4:** PASS. **Step 5:** Commit — `feat: add stack section`.

---

## Work Group 4: Experience + Projects + Education → PR: `feat/wg4-experience-projects`

**Source:** export lines 244–353
**Tasks:** 14–16
**Depends on:** WG1
**Can parallelize with:** WG2, WG3

### Task 14: Experience timeline

**Files:** Create `src/components/sections/Experience.tsx` (+ module.css + test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** renders all roles (company, title, period) from Content model; `id="experience"` (nav WORK target — regression-locks the bug fix); impact-log rows match content stats; timeline SVG `aria-hidden`.
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 244–303): SVG line progress via `useScrollProgress` on the section (`strokeDashoffset = 1000 * (1 - progress)`, export 607–612); responsive collapse in CSS. **Step 4:** PASS. **Step 5:** Commit — `feat: add experience timeline`.

### Task 15: Projects grid + Card primitive

**Files:** Create `src/components/ui/Card.tsx` (+ module.css + test), `src/components/sections/Projects.tsx` (+ test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** renders 4 project Cards with kicker/title/blurb/tags from Content model; `id="projects"`; grid collapses <880px (class assertion); cards with no URL render as `<article>` not `<a>` (the export used `cursor:pointer` with no href — fix: only linkify when the Content model has a `url`).
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 305–338). **Step 4:** PASS. **Step 5:** Commit — `feat: add projects section`.

### Task 16: Education section

**Files:** Create `src/components/sections/Education.tsx` (+ test); modify `src/App.tsx`

- [x] **Step 1: Failing test:** degree, university, period, and the systems-thinking pull-quote render from Content model.
- [x] **Step 2:** FAIL. **Step 3:** Implement (export 340–353). **Step 4:** PASS. **Step 5:** Commit — `feat: add education section`.

---

## Work Group 5: Page-level Effects → PR: `feat/wg5-effects`

**Source:** export lines 619–933
**Tasks:** 17–19
**Depends on:** WG2–WG4 (Orb Waypoints span all Sections)
**Can parallelize with:** None

### Task 17: Media-query hooks (test-first)

**Files:** Create `src/hooks/useMediaQuery.ts(+.test.ts)`

- [x] **Step 1: Failing test:** `useReducedMotion()` / `usePrefersFinePointer()` reflect mocked `matchMedia`, update on `change` event, remove listener on unmount.
- [x] **Step 2:** FAIL. **Step 3:** Implement one `useMediaQuery(query)` + the two named wrappers. **Step 4:** PASS. **Step 5:** Commit — `feat: add media query hooks`.

### Task 18: IntroOverlay + CursorTrail

**Files:** Create `src/components/effects/IntroOverlay.tsx(+.test.tsx)`, `src/components/effects/CursorTrail.tsx(+.test.tsx)`; modify `src/App.tsx`

- [x] **Step 1: Failing tests:** IntroOverlay — not rendered when Reduced-motion or `location.hash` present; click calls `onDone`; **Escape keydown calls `onDone`** (spec addition); body overflow restored after done (assert style cleanup); auto-finishes at 3340ms (fake timers). CursorTrail — mounts canvas only when fine pointer AND no reduced motion; cancels rAF + removes listeners on unmount; **pauses its rAF loop while `document.hidden` (spec §Accessibility) — assert no new frames after a mocked `visibilitychange` to hidden, resumes on visible.**
- [x] **Step 2:** FAIL. **Step 3:** Implement — port export `_playIntro` (811–933) using Web Animations API as in export; CursorTrail from 619–669. **Step 4:** PASS. **Step 5:** Commit — `feat: add intro overlay and cursor trail effects`.

### Task 19: Orb (pure path math + component)

**Files:** Create `src/lib/orbPath.ts(+.test.ts)`, `src/components/effects/Orb.tsx(+.test.tsx)`; modify `src/App.tsx`, section components (add `data-orb-anchor` per export)

- [x] **Step 1: Failing tests (pure fn):** `orbSegment(scrollY, waypointYs)` picks the last waypoint ≤ scrollY; `orbLerp(a, b, u)` applies the cubic ease and sine lateral swing (port export 744–775); u clamped; alternating swing direction by segment parity.
- [x] **Step 2:** FAIL. **Step 3:** Implement pure fns; then Orb component: measures Waypoints (`data-orb-anchor`, export waypoint list 675–686), rAF loop drives transform, ghost trail, morphs into Contact's final period; disabled entirely under Reduced-motion; re-measure on resize and after intro completes; **pause the rAF loop on `visibilitychange` → hidden, resume on visible (spec §Accessibility), with a component test asserting it.** **Step 4:** PASS + visual check full-page scroll. **Step 5:** Commit — `feat: add scroll-following orb effect`.

---

## Work Group 6: Launch hardening → PR: `feat/wg6-launch`

**Source:** spec §Accessibility, §Testing, §Remaining pre-launch step
**Tasks:** 20–21
**Depends on:** WG2–WG5

### Task 20: E2E — a11y + reduced-motion + full smoke

**Files:** Create `e2e/a11y.spec.ts`, `e2e/reduced-motion.spec.ts`; modify `e2e/smoke.spec.ts`

- [x] **Step 1: Extend smoke (failing first):** the Hero h1 plus one visible h2 per content Section (About, Stack, Experience, Projects, Education, Contact) after scroll; nav WORK click lands on Experience (`await expect(page.locator('#experience')).toBeInViewport()`).
- [x] **Step 2:** `a11y.spec.ts` — `new AxeBuilder({ page }).analyze()` after intro dismissed → `expect(violations).toEqual([])`. Run, fix any violations (likely: contrast on `#5a5a64` small text → bump token toward `#6b6b76`; document any token change in the PR).
- [x] **Step 3:** `reduced-motion.spec.ts` — `test.use({ contextOptions: { reducedMotion: 'reduce' } })`: intro overlay never appears, all four Hero phase texts reachable, counters show final values immediately, no orb canvas in DOM.
- [x] **Step 4:** All e2e green locally + in CI. **Step 5:** Commit — `test: add axe and reduced-motion e2e coverage`.

### Task 21: Meta, README, go-live

**Files:** Create `public/favicon.svg`, `README.md`; modify `index.html`

- [x] **Step 1:** Favicon (accent "JS." mark), verify OG/meta tags, add `<meta name="theme-color" content="#0b0b0e">`.
- [x] **Step 2:** Rewrite `README.md`: what the site is, architecture sketch, how to run/test, link to spec + plan (recruiter-facing — this file is part of the portfolio).
- [ ] **Step 3: GATE — ask Jason explicitly:** "Flip repo public and enable Pages?" Only on his OK: `gh repo edit --visibility public --accept-visibility-change-consequences` then `gh api repos/jason-sol/jason-sol.github.io/pages -X POST -f build_type=workflow` (or confirm Pages source = GitHub Actions in settings).
- [ ] **Step 4:** Merge to main (explicit instruction required), watch CI deploy, verify `https://jason-sol.github.io/` live, run Lighthouse (target ≥95 performance, 100 a11y). **Step 5:** Commit any fixes — `fix: post-launch polish`.

---

## Definition of done

- All unit + e2e tests green in CI; site live at the root URL.
- Visual parity with the export at 1440px, sensible collapse at 880/760px checked manually.
- Reduced-motion run shows full content, no Effects.
- No phone number in DOM; email/GitHub/LinkedIn links correct.
