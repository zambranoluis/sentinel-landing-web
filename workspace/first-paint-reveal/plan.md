# First-paint reveal startup

## Current state

Complete. Startup bootstrap, font gate, synchronous controller handoff, regressions and owning documentation are implemented and verified against a rebuilt production application. The before probe with hydration scripts blocked showed hero opacity 1 (`playwright/startup-before.png`). Production verification used task-owned port 3201; the user's development server on 3200 is preserved. Changes remain unstaged and uncommitted.

## Decisions

- Preserve all existing markers, geometry, copy, hero artwork, navigation and animation timings. Only marked information starts concealed, with layout retained.
- A head script arms normal-motion startup before paint. Reduced motion, keyboard focus, fragments and restored views bypass concealment. The controller loads Roboto 400/500/700 explicitly, waits for font layout, prepares all targets and then releases bootstrap CSS in the same frame.
- The bootstrap owns a four-second watchdog independent of hydration. Font failure or timeout releases static content permanently for that document; late font or hydration completion cannot start motion. Other motion owners remain separate.
- No dependencies, public APIs, staging, commits or service replacement are authorized. Generated evidence stays under `/playwright`.

## Checks

- Existing Chromium development motion: 18/18 passed. The initial startup harness used ambiguous warehouse/header selectors and tried to capture stalled fonts with Playwright's default font-readiness wait. Fixed selectors and disabled that wait for this pending-font capture suite. The interrupted development run and its failure evidence remain in `playwright/runs/BimEc3-vPwUwIvty`.
- First production run: 90/96 passed in `playwright/runs/RCZyigerzBmzZR_-`. All 54 existing motion regressions and 36 startup cases passed across Chromium, Firefox and WebKit. Six delayed-script captures failed on an ambiguous header selector, corrected to `#top`; no product failures were observed. Added three startup-interaction/late-font bypass regressions per engine.
- Corrected production run: 138/138 passed in `playwright/runs/bh8bnp2a7euV-W_B`: 51 startup cases plus 87 hero, workflow/cube, FAQ, navigation, responsive, enlarged-text and no-JavaScript cases across the three engines. Together with the 54 existing motion cases, all 192 unique selected cases passed across these runs; this is not a single 192-case invocation.
- Added cold/warm heading geometry and native scroll-position assertions: 6/6 passed in `playwright/runs/hNqx1HnYZARbCuG3`. Earlier WebKit mobile settled screenshots had inconsistent framing after viewport resizing despite stable browser geometry. Create contexts at their final capture size; final startup suite and regenerated captures passed 51/51 in `playwright/runs/x1rNCSyPhNg8yIZW`. Inspected corrected WebKit desktop/mobile settled captures with navigation and artwork visible.
- Desktop/mobile cold/warm initial, intermediate and settled captures inspected in the production run: information is absent initially while navigation and artwork remain visible, then reveals with Roboto and settles in the approved geometry.
- Production build, aggregate `npm run check` (lint, strict types, formatting, 119 local links), 17/17 unit tests and `git diff --check` passed. Final lint and strict types passed after the capture harness correction; final record formatting, links and whitespace checks also passed.
- Task-owned production listeners on 3201 were cleaned up by Playwright. Port 3200 still belongs to the original user-managed development process, PID 12692.

## Remaining work

None within the authorized scope. Generated reports and captures remain under `/playwright`. The full repository browser suite and remote CI were not part of this focused verification.
