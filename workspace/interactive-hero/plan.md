# Interactive hero detection scene

## Objective

Implement the approved explorable warehouse hero while preserving the photograph, copy, CTA, entrance motion and resting viewport geometry. This is illustrative content, with no backend or live detection claims.

## Current state

Complete. Implementation, owning documentation and applicable checks are verified. Baseline desktop/mobile captures are under `playwright/runs/hero-scene-baseline/`; final visual evidence is under `playwright/runs/hero-scene-final/` and `playwright/runs/hero-scene-motion-final/`. The compatible user-managed development server on port 3200 (PID 19984) was preserved. No dependencies, staging, commits or deployment were introduced.

## Stages / milestones

1. Extract the client scene and typed geometry/content; retain server-rendered hero text.
2. Add aligned strokes, tracking accents, bounded camera movement, spotlight, hover/focus/pinning and responsive details/disclosure.
3. Update owners and verify behavior, geometry, accessibility, motion lifecycle and production compilation.

## Progress

- Grounding complete: current source, original photograph, browser baseline, existing hero tests and project/skill requirements inspected.
- Stages 1–2 complete: twelve targets, aligned camera/spotlights, native fallback, selection controls and responsive callouts implemented.
- Stage 3 complete: product/design/engineering owners and landing brief updated; static checks, unit tests, production compilation and applicable three-engine verification passed, with aggregate versus focused outcomes below.

## Validation criteria

- Twelve individually reachable detections: truck, four people, forklift, five pallet areas and route. Person hit regions win over enclosing vehicles.
- Focus overrides hover; pin overrides both. Graceful pointer crossing; switch/toggle, Escape, Close and background dismissal.
- Shared photograph/SVG cover geometry, <=6px camera travel, fixed route endpoints and <=3px wave. Approximately 180ms selection feedback.
- Desktop callouts inside scene and clear of copy; mobile panel below image with no camera. Native disclosure exposes all descriptions without JavaScript.
- Pause/resume, offscreen/hidden suspension and immediate static reduced-motion behavior.
- Three-engine focused tests plus existing hero/entrance coverage, mobile/tablet/desktop/wide/enlarged views, Chromium real 200% zoom (other engines have no equivalent zoom harness).
- Applicable lint, types, formatting, documentation links, unit checks, build and Impeccable detector.

## Validation results

- Baseline captures: 1440×900 and 390×844 Chromium, reduced motion. Photograph inspected at original 1672×941 resolution.
- Initial Chromium runs: 17/17 hero geometry and 8/8 scene interaction cases passed.
- Screenshot review corrected the mobile panel taking space from the photograph and a callout overlapping its selected person. Mobile detail now extends the hero; callout placement uses subject bounds.
- Broad run `playwright/runs/A8cRQmS8EQlD0udj/`: 132/138 passed. The route callout intercepted one click (fixed by anchoring the route callout beside its local anchor); Firefox exposed the fractional 720–721px CSS breakpoint gap (fixed by matching the exact desktop media condition). A 67% Chromium zoom case timed out at 90 seconds, and three WebKit cases missed five-second hydration/startup waits. All six passed in the subsequent focused run; the broad run itself remains 132/138.
- `playwright/runs/hero-scene-final/`: 43/44 passed, including all prior failures, every target's direct hit region, touch, accessibility, responsive/enlarged views, hero geometry/entrances and real 200% Chromium zoom selection. A newly strengthened wave assertion exposed WebKit's CSS path-geometry limitation. Native SVG wave animation now shares the visibility/pause lifecycle with CSS dashes, with no continuous JavaScript loop.
- `playwright/runs/hero-scene-motion-final/`: 10/12 passed, including wave geometry, fixed endpoints, paused timelines, reduced motion, no-JavaScript and normal-motion selection in all engines. Extended keyboard traversal exposed a Firefox scroll-container tab stop and stationary-pointer hover reopening after Escape in WebKit. Hydrated directory traversal now goes directly to its native controls; the no-JavaScript directory remains keyboard-scrollable. Dismissal ignores layout-induced pointer entry until real pointer movement.
- `playwright/runs/hero-scene-keyboard-final/`: 6/6 passed across Chromium, Firefox and WebKit after those fixes, covering the full Tab sequence, hover/callout crossing, keyboard/pin precedence, Escape, route wave/endpoints, frozen pause, offscreen/controlled-hidden suspension and reduced motion. No failing acceptance case remains from the runs above.
- Final `npm run check` passed (lint, types, formatting, 97 local Markdown links); `npm run test:unit` passed 17/17; final `npm run build` passed. Scoped diff and whitespace review passed. JSX-only scene rendering remains below the component-size review threshold; the hook keeps selection and independent native lifecycle effects together without shared application state.
- Impeccable detector ran once over all six changed UI sources: 13 advisory findings, no blocking findings. Three concern unchanged hero font ramps already documented in DESIGN; the remaining local scene colour/radius advisories are now explicitly documented in its design contract. No detector settings were changed.
- Final focused coverage adds direct hits for every subject, route endpoint/wave checks, frozen paused timelines, normal-motion clicking, browser error capture, selected mobile text enlargement and selection at real 200% Chromium zoom.
- Final desktop idle/selected, mobile selected and real 200% zoom captures were inspected. The original copy and layout remain intact; the brighter strokes are aligned, the selected person is clear of the callout, and mobile details extend below the photograph without reducing its height.

## Important context

The focal interaction isolates one detection while its details explain the subject. Camera travel and perimeter/route accents remain subordinate and suspend when unavailable. CSS owns looping perimeter/dash accents; native SVG animation owns the route wave. Pointer camera writes are scheduled with animation frames, never React renders per pointer move. Hero text remains server rendered and precedes the interactive scene in document reading order.

## Remaining work

No implementation or applicable automated verification remains. Evidence limits: hidden-document tests use controlled visibility notifications, not an operating-system tab switch; Firefox/WebKit have responsive and enlarged-text coverage, while real browser zoom uses the existing Chromium-only extension harness. Browser evidence uses the reused development server; production compilation is a separate check. Real-device touch, manual screen-reader operation and production-server runtime were not exercised.
