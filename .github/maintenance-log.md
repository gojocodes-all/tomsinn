# Maintenance log

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
