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

## Deferred follow-ups (non-blocking, post-launch)

- Orb imperatively mutates DOM owned by Experience/Contact (opacity save/restore) — Mode B flagged; make declarative via data-attr + host CSS. Parked intentionally.
- Nav overflows at 375px (brand wraps, CONTACT clips) — below spec's supported widths; clean mobile nav adaptation.
- Minor review nits already logged in PRs (DPR mid-session change, data-hook for the axe exclusion selector).
