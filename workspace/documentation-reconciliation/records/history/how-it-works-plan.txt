# How it works

## Current state

Implemented and verified at `http://localhost:3001/#how-it-works`. Supplied `references/sections/2-how-it-works/preview.png`, background and cube HTML establish the section. User confirmed the supplied cube motion, with reduced-motion support. The [finish review](records/finish-review.md) records a scoped ship verdict using Impeccable's documented in-thread reviewer/documenter fallback. Existing Sentinel server verified at localhost:3001; port 3000 belongs to another project and was excluded from evidence. No user-managed server was stopped; the temporary production probe on 3188 was stopped after verification.

## Decisions

- Extend the existing landing with exact reference copy, warehouse background, radial five-step diagram and supplied SVG cube geometry. Preserve originals and reuse the existing stack without dependencies.
- Keep section text and SVG server rendered; isolate pause/visibility/reduced-motion behavior in a small client wrapper. Pause animation offscreen and when the document is hidden; retain playback position and user pause preference. Without JavaScript, show the complete static illustration.
- Enable the existing navbar/footer destination at `/#how-it-works`; close the mobile disclosure and focus the section on activation.
- Retain radial composition on desktop, put diagram below copy on tablet, and reflow steps into a readable list on mobile/enlarged text.
- Generated browser artifacts stay in the external OS-temp `sentinel-landing-web-qa/how-it-works` directory. Text records are shareable; nothing is staged or committed.

## Direction contract

THESIS: Make the five stages of turning video into human action legible in the supplied warehouse composition.

OWN-WORLD: Inherit Sentinel's dark field, Roboto, controlled borders, white hierarchy and reference-local blue/cyan illustration accents.

STORY: Evaluation audiences read the value statement, understand Observe, Interpret, Flag, Review and Respond, then continue exploring the page.

FIRST VIEWPORT: Large left-hand headline and supporting paragraph occupy about 40% of the inner width; five labeled icon panels surround a central luminous cube on the right. The supplied background spans the section. No new commercial CTA.

FORM: Precisely supplied local extension; no concept seed or identity replacement applies. Implement reference assets directly in code; no generated alternative comps are needed. Cube motion is the single animated illustration, with a quiet pause control.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Checks

- Production build passed; `/` remains statically prerendered. Lint, strict types, formatting, 3 unit tests and diff whitespace checks passed.
- Final complete browser run: **51/52 passed**, with all **15/15 new section checks** passing across Chromium, Firefox and WebKit. The existing WebKit tablet burger-reversal sample landed at its 45-degree endpoint instead of mid-transition; its unchanged isolated rerun passed **1/1**. This is not represented as an uninterrupted 52/52 run. Full evidence: external `sentinel-landing-web-qa/how-it-works/verified/`; isolated rerun: `menu-rerun/`.
- Coverage: 320/390/720/721/834/1279/1280/1440/1910px, overlap/overflow and exact workflow order, loaded image, axe, pause/resume with timeline continuity, offscreen reentry, dynamic reduced motion/focus, mobile fragment navigation, no JavaScript and 200% text. Existing real 200% browser zoom check also passed and includes the new section. Desktop/tablet/mobile production captures and whole-page desktop/mobile captures received rendered review.
- A controlled visibility-event probe passed pause/resume on the production page; OS-level tab backgrounding was not separately exercised. No real-device or field-performance claim is made.
- Local unthrottled production probe at 1440px: optimized background 95,422 body bytes / 95,722 transfer bytes, 20ms resource duration; document DOMContentLoaded 199.2ms. These are one local sample, not benchmarks or a user-perceived speed guarantee. No added runtime dependencies or JavaScript animation loop.
- Impeccable context loaded successfully. Its single detector pass returned only advisory local color/type differences inherited from the reference; DESIGN records their local scope. Source provenance was embedded in the consumed background; scan: one raster, zero missing. External examples and image generation were unnecessary because supplied composition and source assets settled direction.
- `docs:links` still fails on four **pre-existing** links: two in `AGENTS/ADOPTION.md` to missing adoption records and two in README to missing landing-base/navbar-icon plans. Confirmed against HEAD and absent filesystem targets; no new broken link was reported. `npm run check` therefore does not pass as an aggregate gate.

### Corrections and verification history

- Removed an empty serialized SVG style attribute caught by TypeScript.
- First visual pass corrected headline grouping, cube vertical alignment and an overlong connector.
- Fixed focus handoff when reduced-motion removes the focused pause control, and 320px enlarged-text overflow by allowing title/step reflow and placing the mobile cube above the workflow.
- Corrected no-JavaScript test style injection to use the automation evaluation context; the prior helper waited for a page-script load event.
- First full browser pass was 46/52. Updated the existing image-loading test to scroll lazy images into view and the zoom test to name the intended assessment button. Motion test now awaits the browser's pending pause operation before comparing timeline positions. The next full run and isolated timing rerun are recorded above.

## Remaining work

No section implementation work remains. Repository owners can restore the four missing historical records (or reconcile their owning links), then rerun `npm run docs:links` / `npm run check`. The existing wall-clock navbar reversal probe may still sample an endpoint under WebKit load; this task did not change that unrelated mechanism. No staging, commit, push, deployment or remote CI run was requested or performed.
