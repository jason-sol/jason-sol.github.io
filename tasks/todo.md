# Portfolio website — brainstorm → design → build

## Brainstorming checklist (hai-agentic-dev:brainstorming)

- [x] 0. Right-sizing assessment (asking user)
- [x] 1. Knowledge search gate — QMD/ColGREP not installed; fresh repo, grep/glob fallback fine
- [x] 2. Issue context — personal project, no Jira ticket
- [x] 3. Prior context — no STRATEGY.md / ideation / solutions (fresh repo)
- [x] 4. Explore project context — read full design export; identified missing runtime (support.js), missing portrait asset, obfuscated email, PII in footer
- [x] 5. Visual companion — skipped; design already exists, remaining questions are architectural
- [x] 6. Clarifying questions — mode: standard · hosting: GitHub Pages · phone: removed · portrait: Jason supplies photo · testing: full showcase
- [x] 7. Approaches proposed — Vite + React + TS chosen over Astro / Next.js
- [x] 8. Design presented — approval question timed out (user AFK); spec drafted, approval still pending
- [x] 9. UBIQUITOUS_LANGUAGE.md written (pending Jason's review)
- [x] 10. hai-spec detection — Mode D (no openspec/, no repos.yaml)
- [x] 11. Spec written: docs/specs/hai-agentic-dev-2026-07-03-portfolio-website-design.md
- [x] 12. Inline self-review — passed
- [x] 13. User review gate — APPROVED 2026-07-03 (with WORK-link fix required)
- [x] 14. Transition to writing-plans

## Resolved by Jason (2026-07-03)

- [x] Design approved (WORK link must be fixed — repointed to #experience)
- [x] Email: jassol2013@gmail.com
- [x] Repo renamed to jason-sol.github.io (base path /)
- [x] Portrait photo supplied → processed → src/assets/jason.jpg (EXIF stripped)

## Implementation (plan: docs/plans/hai-agentic-dev-2026-07-03-portfolio-website.md)

- [x] WG1 Walking skeleton + CI (tasks 1–5)
- [x] WG2 Hero + Ticker (tasks 6–9)
- [x] WG3 About + Stack (tasks 10–13)
- [x] WG4 Experience + Projects + Education (tasks 14–16)
- [x] WG5 Page-level Effects (tasks 17–19)
- [x] WG6 Launch hardening (tasks 20–21) — code complete; go-live steps gated on Jason

## Review status

All six work groups: two-stage reviewed (spec + quality) with fix loops. Mode B architectural review + final whole-implementation review complete. Final gate on `feat/wg6-launch`: 237 unit / 37 files, 14 e2e / 3 specs (cold build), lint/typecheck/build clean, zero console errors. Final-review Critical (hero name clipped to one line) fixed and verified (unit + e2e regression + 1440px screenshot).

## Pre-launch (needs Jason)

- [ ] Merge the PR stack #1→#7 to main (in order, or squash) — needs explicit OK
- [ ] Flip repo visibility private → public + enable Pages (Actions source) — needs explicit OK; deploy job on main fails until Pages is enabled (expected)
- [ ] After go-live: verify https://jason-sol.github.io/ + Lighthouse

## Post-launch polish (done 2026-07-06, branch fix/polish-orb-nav)

- [x] Orb DOM ownership made declarative via `data-orb-hidden` + host CSS (removed opacity save/restore bookkeeping). Mode B item resolved.
- [x] Nav wordmark collapses to the dot at ≤460px (aria-label keeps the link named); no clipping/overflow at 375px.

## Deferred follow-ups (non-blocking)

- Minor review nits logged in PRs (DPR mid-session canvas change, data-hook for the axe exclusion selector).

## Copy refresh from resume (2026-09-20, branch copy/humanize-site-content)

Rewrote all site copy in a plain, declarative voice (Jason's pick) and re-based every fact on `Resume - Jason Solanki.pdf`.

- [x] Voice pass over `src/content/site.ts` — removed the tricolons, em-dash callbacks and grandiose claims that read as LLM-written
- [x] Facts updated: Harrison split into two roles (L2 promotion Jul 2026), Rad Agent Router, FHIR `Promise.all` fix, Zod inference-output validation, monorepo + error-code consolidation, education dates
- [x] `clinicians`/`sites` stats replaced with resume-backed `patients` (6M+) / `facilities` (1,000+); the unsourced "3,500+ clinicians" figure is gone
- [x] Stack expanded to 7 groups (GCP, Kubernetes, .NET, Jest/RTL, PostHog, AI agentic tooling, medical imaging)
- [x] `Experience` role key made unique per period so two roles can share a company
- [x] `index.html` title + meta description rewritten
- [x] 239 unit / 14 e2e green, lint/typecheck/build clean, verified at 1440px and 390px

### Open for Jason

- Seams could be swapped for the Wedding Guest List app (282 tests, Dockerised, self-hosted) — the projects grid is 2x2, so it's a swap not an addition
- No dedicated section for the AI agentic engineering work; it currently only appears as a stack group

### Follow-ups added 2026-09-20 (same branch)

- [x] New `06 — AI ENGINEERING` section (`Agentic.tsx`) with the six agentic-engineering practices from the resume; sections renumbered 04–10 and an `agentic` orb waypoint added between stack and experience
- [x] Footer copyright year derived from `new Date()` instead of a hardcoded 2026 (`footer.copyright` → `footer.copyrightName`)
- [x] Resume request in Contact: a `mailto:` draft prefilled with subject and a name/company/role template, built by a tested `mailtoUrl` helper. Chosen over a form (no backend on Pages) and over hosting the PDF (it carries Jason's phone number)
- [x] "Source on GitHub" link in the hero, dropped from the tab order once the name phase fades (the phase stays `visibility: visible` at opacity 0 for the h1)
- [x] 252 unit / 14 e2e green; the whole-page axe scan needed `test.slow()` — its runtime scales with page height and the extra section pushed it past 30s

### Still open

- Seams vs the Wedding Guest List app in Projects: Jason kept Seams for now
