# Ubiquitous language

## Page structure

| **Term** | **Definition** | **Avoid** |
|---------|---------------|----------|
| Section | A top-level page region rendered by one component in `components/sections/` (Nav, Hero, Ticker, About, Stack, Experience, Projects, Education, Contact, Footer). | block, panel, area |
| Hero phase | One of the four full-viewport statements shown sequentially inside the sticky Hero as the user scrolls. | slide, step, screen |
| Section label | The small monospace eyebrow heading that numbers a Section (e.g. "05 — STACK"). | eyebrow, kicker |
| Ticker | The Section showing the horizontally looping strip of stats; "marquee" is its CSS mechanism, not its name. | marquee, banner |

**Relationships:**
- The page has exactly ten **Section**s in fixed order (1:10).
- The **Hero** contains exactly four **Hero phase**s (1:4).
- Every **Section** except Nav, Ticker and Footer has one **Section label** (1:1).

## Effects

| **Term** | **Definition** | **Avoid** |
|---------|---------------|----------|
| Effect | A purely decorative, JS-driven enhancement in `components/effects/` that the page must remain fully readable without. | animation (too generic), feature |
| Intro overlay | The skippable first-load Effect (counter, letter assembly, column wipe) shown before the Hero. | splash, loader, preloader |
| Orb | The accent-colored shape Effect that travels between Waypoints as the user scrolls. | ball, dot, companion |
| Waypoint | A document position the Orb targets, anchored to an element within a Section. | anchor, stop, marker |
| Dissolve portrait | The scroll-driven canvas Effect in About that reveals the portrait photo cell by cell. | photo reveal, pixelate |
| Cursor trail | The fading accent stroke Effect that follows fine-pointer movement. | mouse trail, pen |
| Hero backdrop | The perspective grid and drifting light-line Effect behind the Hero phases. | background, grid |
| Reveal | The enter-viewport fade-and-rise transition applied to content elements. | fade-in, appear |
| Reduced-motion mode | The state when `prefers-reduced-motion: reduce` is set; all Effects must be disabled or simplified in it. | a11y mode |

**Relationships:**
- An **Effect** attaches to one or more **Section**s (N:M); the Cursor trail and Orb attach to the whole page.
- The **Orb** visits **Waypoint**s in document order (1:N).
- Every **Effect** must respect **Reduced-motion mode** (1:1 obligation).

## Architecture

| **Term** | **Definition** | **Avoid** |
|---------|---------------|----------|
| Content model | The typed data in `src/content/site.ts` that is the single source of truth for all copy, stats, links and project entries. | data file, config, constants |
| Design token | A CSS custom property in `styles/tokens.css` defining a color, font stack, or spacing value. | theme variable, style constant |
| UI primitive | A small reusable presentational component in `components/ui/` (SectionLabel, Tag, Card, LinkButton, Marquee, StatCounter). | widget, atom, element |
| Animation hook | A custom React hook in `src/hooks/` encapsulating scroll/motion logic (useScrollProgress, useReveal, useCountUp, useReducedMotion, usePrefersFinePointer). | helper, util |
| Base path | The URL prefix Vite builds asset links against; `/jason-website/` for the project-pages URL, `/` if the repo is renamed. | subpath, prefix |

**Relationships:**
- The **Content model** feeds every **Section** (1:N); Sections never hardcode copy.
- A **UI primitive** is consumed by many **Section**s (N:M).
- An **Animation hook** is consumed by **Section**s and **Effect**s (N:M); Effects never duplicate hook logic inline.
- Every color/font/spacing decision resolves to a **Design token** (N:1).

## Flagged ambiguities

| **Term** | **Conflict** | **Resolution** |
|---------|-------------|---------------|
| "Work" nav link | In the export, the nav's WORK link targets `#work`, which is the *About* Section (labelled "04 — ABOUT"), not Experience or Projects. | Resolved 2026-07-03: WORK points at `#experience`; About uses `#about`. |
| Stats duplication | The same stats (180+ PRs, 18 repos, 3,500+ clinicians) appear in the Ticker, Hero phases, and the Experience impact log with slightly different framing. | Resolved: stats live once in the Content model and are referenced by all three Sections. |

## Example dialogue

> **Developer:** "Should the Ticker pause when a Hero phase is active?"
> **Designer:** "The Ticker isn't inside the Hero — it's its own Section after it, so no."
> **Developer:** "And the Orb — is it part of the Hero backdrop?"
> **Designer:** "No, the Hero backdrop stays behind the Hero. The Orb is a page-level Effect that visits Waypoints across all Sections."
> **Developer:** "So in Reduced-motion mode I disable the Orb, the Cursor trail, and the Intro overlay, but keep every Section's content visible?"
> **Designer:** "Exactly — Effects are decoration. Sections must stand alone."
