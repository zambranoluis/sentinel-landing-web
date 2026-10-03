# Fill the first screen with navigation and hero

## Current state

Implemented and locally verified under the user's supplied plan. Navbar and hero fill at least the first viewport at every breakpoint, with readable scrolling when content needs more height. All 162 discovered browser cases have passed across the broad run and focused reruns. Existing uncommitted width/zoom work and the original port 3000 process are preserved. No implementation or required local verification remains.

## Decisions

- Keep navbar in document flow. `NavbarFrame.tsx` measures immediately in a layout effect, observes border-box size changes and cleans up its observer and inline variable.
- Global `--navbar-height` defaults to 81px. Hero uses `100vh` then `100dvh` minus that value at every breakpoint, without fixed height or clipping.
- Preserve copy, type, gutters, centered desktop composition and existing assets. On mobile, copy stays above the image; the image band retains its original ratio minimum and grows into spare space.
- Allow desktop navigation/action wrapping for enlarged text; ordinary geometry must continue passing the existing width regressions. Disclosure height consumes the same measured navbar value.
- Hero responsive image selection accounts for viewport height on tall screens, so growing/cropped photography receives enough source pixels. The original asset remains unchanged.
- No dependencies, public API changes, commits, publishing or changes to port 3000. Browser evidence uses the existing production harness on port 3187; generated artifacts stay outside the checkout.

## Checks

- Before-state production build passed. Captures across Chromium, Firefox and WebKit at 1440×900, 1440×1400, 834×1112, 390×844 and 390×1200 show the next section entering before the viewport bottom. At 1440×1400 it starts around 762px; at 390×1200 around 717px.
- Final production build, lint, types, formatting, 3/3 unit tests and diff whitespace pass. Browser discovery lists 162 cases. Aggregate `check` fails only on the baseline documentation links below.
- First focused run: 39/51 passed. Remaining failures were desktop enlarged-text overflow (corrected with wrapping), ineffective border override (corrected selector), pre-measurement WebKit assertions (now wait for the inline measurement), and Firefox no-JavaScript promise evaluation (now poll synchronous font status).
- Broad run: 158/162 passed in 15.9 minutes, including all 27 width checks and navigation regressions. Three failures were the resize probe expecting exact height despite legitimate content overflow; it now uses a taller mobile viewport. The fourth was WebKit demo playback sampling time zero; the unchanged isolated rerun reproduced it. Its capture placed the timeline below the viewport. The test now brings the timeline into view and asserts visibility before sampling; demo implementation is unchanged.
- Final focused run: 71/72 passed in 7.0 minutes, including all 51 hero cases, all nine zoom cases, all three corrected demo cases and eight public-entry cases. The remaining WebKit desktop public-entry case exceeded its 30-second deadline at the whole-page capture; its unchanged isolated rerun with `--timeout=90000` passed in 40.7 seconds. All 162 unique cases are therefore verified across runs; no claim of a single clean 162-case run.
- Matched desktop and tall-mobile before/after captures were inspected. Copy/type/positions remain unchanged, and the next section stays below the first screen. Tall mobile showed a 640px image source covering a 703px-high crop; height-aware responsive image selection corrects that resolution mismatch. Final desktop/tall-mobile captures confirm retained composition and sharper mobile photography; the selected source changes from a 640px request to the original asset at a higher requested width.
- Initial browser startup was refused because the task-created baseline service still held port 3187 after shell interruption. Its confirmed Next.js process was stopped; the configured isolated harness then started successfully.
- Impeccable detector reports only three advisory hero font clamps already documented in DESIGN; no new type changes.
- Baseline `docs:links` fails on eight references to six missing records: adoption plan and host verification, desktop-width plan, site-completion plan and finish review, and How it works plan. Preserve those historical references; their owners must recover/reconcile authentic records.
- Required browser acceptance: hero begins exactly at navbar bottom; next section begins at or below viewport bottom; mobile copy precedes a growing aligned image band; short screens and enlarged text scroll to readable controls without horizontal overflow. Exercise desktop, tall desktop, tablet, mobile, 720/721/1279/1280 boundaries, navbar border/content size changes, resize, disclosure, no JavaScript and real 200% browser zoom across supported engines.

External evidence: `C:\Users\MrMonka\AppData\Local\Temp\sentinel-landing-web-qa\hero-viewport-20261002\` (before captures/geometry; `focused/` initial run; `corrected/` broad run; `demo-rerun/` unchanged failure; `final/` final focused verification; `desktop-rerun/` successful 90-second-deadline rerun).

## Remaining work

No scoped implementation or required local check remains. The eight documentation-link failures predate this task and require the historical record owners to recover/reconcile six missing records. Real device testing, remote CI, formal accessibility conformance, staging, commits and deployment were not performed. Task-created test/probe services are stopped; generated evidence remains external.
