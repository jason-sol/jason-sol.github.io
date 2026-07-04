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
- [ ] WG3 About + Stack (tasks 10–13) — parallel with WG2/WG4
- [ ] WG4 Experience + Projects + Education (tasks 14–16) — parallel with WG2/WG3
- [ ] WG5 Page-level Effects (tasks 17–19) — after WG2–4
- [ ] WG6 Launch hardening (tasks 20–21)

## Pre-launch (pending)

- [ ] Flip repo visibility private → public at deploy time (needs Jason's explicit OK)
- [ ] Merge/commit/push authorization — Jason's explicit instruction required per his global rules
