# Maintenance log

## 2026-10-26 — Make promise acceptance a stable one-time state

- **Rationale:** The answer controls remained active after accepting the promise,
  so repeated activation could write the same state again, schedule duplicate
  scrolling, and start overlapping confetti animation loops.
- **Files changed:** `script.js` centralizes the accepted state, locks both
  answer buttons, publishes clear live feedback, and prevents repeated side
  effects; `styles.css` preserves the intended accepted-button appearance and
  suppresses disabled hover behavior; `test/promise-acceptance.test.js` covers
  repeated activation; the restored-state test, validation script, README, and
  this maintenance log are updated.
- **Validation:** `npm run check`, `npm test`, and a complete diff review
  covering pointer and keyboard behavior, reduced motion, restored visits,
  mobile layout, privacy, backward compatibility, and the dependency-free
  architecture.
- **Risk:** Low. The first acceptance still persists the promise, reveals and
  scrolls to the ending, and launches confetti when motion is allowed. Only
  repeated answer activation is prevented.
- **Rollback:** Revert the pull request's squash commit to restore reusable
  answer controls and remove the new regression coverage.

## 2026-10-19 — Keep note-card state accessible

- **Rationale:** The flippable note buttons did not expose an initial pressed
  state, and both their visible and hidden faces remained available to assistive
  technology. This made the control's state and current content ambiguous until
  the first activation.
- **Files changed:** `index.html` defines the initial pressed state and hides
  each back face semantically; `script.js` keeps the visible face,
  `aria-hidden`, and `aria-pressed` synchronized; the new
  `test/note-accessibility.test.js` covers initialization and repeated toggles;
  `package.json` and `README.md` include the new validation coverage; this
  log records the maintenance decision.
- **Validation:** `npm run check`, `npm test` (6 passing tests), and a complete
  diff review covering keyboard behavior, assistive-technology state, reduced
  motion, mobile layout, privacy, backward compatibility, and the
  dependency-free architecture.
- **Risk:** Low. Visual styling, personal content, storage, downloads, and
  deployment remain unchanged. The change only makes the already-visible
  note-card state match its programmatic state.
- **Rollback:** Revert the pull request's squash commit to restore the previous
  note markup and click handler and remove the regression test.

## 2026-10-11 — Restore the complete accepted-promise view

- **Rationale:** On a return visit, stored acceptance unhid the final promise
  section but left its parent story container hidden. The remembered ending was
  therefore still invisible despite successful persistence.
- **Files changed:** `script.js` centralizes the letter reveal path and uses it
  for both first-time opening and restored visits;
  `test/restored-promise.test.js` covers the complete restored DOM state;
  `package.json` syntax-checks both tests; `README.md` documents the coverage;
  `.github/maintenance-log.md` records the work.
- **Validation:** `npm run check`, `npm test`, `git diff --check`, and a complete
  diff review covering behavior, accessibility, privacy, reduced motion,
  backward compatibility, and the dependency-free architecture.
- **Risk:** Low. First-time opening, storage format, personal content, image
  export, and deployment remain unchanged. Only visitors with an already
  accepted promise now see the state that was intended to be restored.
- **Rollback:** Revert the pull request's squash commit to restore the previous
  partial restoration behavior and remove its regression test.

## 2026-10-04 — Document the project and contribution workflow

- **Rationale:** The repository contained a complete interactive site and validation scripts but no README explaining its purpose, local usage, browser-only persistence, image export, structure, deployment contract, or contribution checks.
- **Files changed:** `README.md` and `.github/maintenance-log.md`.
- **Validation:** `npm test`, `npm run check`, documented-path verification, command verification, and full documentation diff review against the current HTML, CSS, JavaScript, tests, and repository tree.
- **Risk:** Low. Documentation and maintenance history only; site behavior, personal content, dependencies, storage, and deployment files are unchanged.
- **Rollback:** Revert this documentation commit to remove the guide and log entry; runtime behavior and stored browser data are unaffected.

## 2026-09-27 — Resilient promise persistence

- **Rationale:** Browser storage can be unavailable or throw in privacy-restricted and embedded contexts. Direct storage access could interrupt the promise acceptance flow or page initialization.
- **Files changed:** `index.html`, `script.js`, `promise-storage.js`, `package.json`, and `test/promise-storage.test.js`.
- **Validation:** `npm test`, `npm run check`, HTML script-order assertion, and `git diff --check`.
- **Risk:** Low. Successful storage behavior is unchanged; failures now fall back to a session-only experience.
- **Rollback:** Revert this maintenance commit to restore direct `localStorage` access.
