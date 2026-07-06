# Jason Solanki — Portfolio

Personal portfolio site for Jason Solanki, a full-stack engineer shipping production AI on medical imaging at Harrison.ai. Ten sections — Nav, Hero, Ticker, About, Stack, Experience, Projects, Education, Contact, Footer — built as a scroll-driven single-page React app with no backend, deployed as a static site.

## Architecture

- **`src/content/site.ts`** is the single source of truth for all copy, stats, links and project entries. Sections never hardcode content; the same stats (PR count, repos, clinicians served) are referenced from the Ticker, Hero and Experience impact log rather than duplicated.
- **`src/components/sections/`** — one component per page region (Nav, Hero, Ticker, About, Stack, Experience, Projects, Education, Contact, Footer). Sections read from the content model and stay fully readable with every Effect disabled.
- **`src/components/effects/`** — purely decorative, JS-driven enhancements (IntroOverlay, CursorTrail, Orb, HeroBackdrop, DissolvePortrait) that the page never depends on. All respect `prefers-reduced-motion`.
- **`src/hooks/`** — scroll/motion primitives shared across sections and effects (`useScrollProgress`, `useScrollFrame`, `useReveal`, `useCountUp`, `useMediaQuery` for reduced-motion/pointer detection, `usePausableRaf` for a visibility-aware animation-frame loop).
- **`src/lib/`** — pure functions with no DOM dependency (`math`, `easing`, `dissolve`, `splitWords`, `timeline`, `heroPhases`, `orbPath`), each unit-tested in isolation.
- **`src/components/ui/`** — small presentational primitives (`Card`, `Tag`, `LinkButton`, `Marquee`, `StatCounter`, `SectionLabel`, `SegmentedText`) reused across sections.

The codebase was built test-first throughout: 200+ unit tests (Vitest + React Testing Library) and three Playwright end-to-end suites (smoke, accessibility, reduced-motion) — run them yourself with the commands below.

## Running locally

```bash
npm ci
npm run dev
```

## Testing

```bash
npm test          # unit tests (Vitest)
npm run e2e        # end-to-end tests (Playwright; builds and serves the site first)
npm run lint
npm run typecheck
```

## Further reading

- [Design spec](docs/specs/hai-agentic-dev-2026-07-03-portfolio-website-design.md)
- [Implementation plan](docs/plans/hai-agentic-dev-2026-07-03-portfolio-website.md)
- [Domain glossary](UBIQUITOUS_LANGUAGE.md)
