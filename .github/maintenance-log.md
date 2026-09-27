# Maintenance log

## 2026-09-27 — Resilient promise persistence

- **Rationale:** Browser storage can be unavailable or throw in privacy-restricted and embedded contexts. Direct storage access could interrupt the promise acceptance flow or page initialization.
- **Files changed:** `index.html`, `script.js`, `promise-storage.js`, `package.json`, and `test/promise-storage.test.js`.
- **Validation:** `npm test`, `npm run check`, HTML script-order assertion, and `git diff --check`.
- **Risk:** Low. Successful storage behavior is unchanged; failures now fall back to a session-only experience.
- **Rollback:** Revert this maintenance commit to restore direct `localStorage` access.
