# Still Us — For Tomisin

A personal, interactive friendship letter for Tomisin from Jomiloju. The site opens like a digital envelope, reveals a scroll-based story, lets the reader open note cards, asks for a friendship promise, and can download a keepsake image after the promise is accepted.

The project is a dependency-free static site. It uses plain HTML, CSS, and JavaScript, with no framework, backend, build step, or runtime environment variables.

## Experience

- Animated envelope that reveals the letter
- Scroll-triggered sections and a reading-progress indicator
- Flippable note cards with accessible pressed states
- A playful “No” button that moves within its question area
- Promise acceptance with optional confetti
- Browser-local acceptance state that survives refreshes when storage is available
- A generated 1200 × 675 PNG keepsake downloaded entirely in the browser
- Responsive layouts and reduced-motion behavior

## Requirements

- A modern browser for the site
- Node.js 18 or later only for the repository validation commands

There are no npm dependencies to install.

## Run locally

Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/gojocodes-all/tomsinn.git
cd tomsinn
```

You can open the file directly or serve the directory with any static-file server. Keep `index.html`, `styles.css`, `promise-storage.js`, and `script.js` together because the page loads the three supporting files with relative paths.

## How it works

1. Opening the envelope reveals the hidden story and starts observing its sections.
2. Note buttons toggle their front and back faces and update `aria-pressed`.
3. Choosing **Obviously, yes** reveals the final promise, records acceptance, and starts confetti unless reduced motion is requested.
4. On later visits, the final promise remains visible when the `tomisinFriendshipPromise` key is available in `localStorage`.
5. **Save our promise** draws the keepsake on a canvas and downloads `tomisin-and-jomiloju-promise.png` without uploading personal content.

If browser storage is blocked or unavailable, accepting the promise still works for the current page session; only persistence across refreshes is lost.

## Validation

Run the dependency-free storage tests:

```bash
npm test
```

Check both JavaScript files for syntax errors:

```bash
npm run check
```

The automated tests cover successful persistence and failures while accessing or operating on browser storage. They do not replace manual browser checks for layout, animation, downloads, or the complete interaction flow.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Personal letter content and accessible page structure |
| `styles.css` | Responsive layout, envelope and card effects, and reduced-motion rules |
| `script.js` | Letter interactions, scrolling, confetti, and keepsake generation |
| `promise-storage.js` | Failure-safe wrapper around the acceptance state in `localStorage` |
| `test/promise-storage.test.js` | Node.js tests for the storage wrapper |
| `.github/maintenance-log.md` | Dated maintenance decisions, validation, risk, and rollback notes |

## Privacy and data

The site has no backend, analytics, account system, or network API. Promise acceptance is stored only in the current browser, and the keepsake image is generated locally. Clearing the site's browser storage removes the remembered acceptance state.

## Deployment

Deploy the repository root to any static hosting service with `index.html` as the entry file. No build command, output directory, secret, or environment variable is required.

After deployment, manually verify:

- the envelope reveals the story;
- note cards open with pointer and keyboard input;
- the question buttons remain inside their stage on desktop and mobile;
- accepting the promise reveals the ending and survives a refresh;
- the PNG keepsake downloads;
- reduced-motion mode avoids smooth scrolling and confetti.

## Contributing

Keep changes consistent with the existing personal letter and paper-inspired visual direction. Before opening a pull request:

1. Run `npm test` and `npm run check`.
2. Test the complete interaction flow in a browser at desktop and mobile widths.
3. Check keyboard focus indicators and reduced-motion behavior.
4. Confirm that no personal content is sent to a server or third-party service.
5. Add a dated entry to `.github/maintenance-log.md` describing the rationale, files, validation, risk, and rollback.
