# Bidirectional landing motion

## Objective

Implement composed, noticeable full-fade entrances and exits with downward/upward replay, preserving the accepted landing layout, content, assets, native scrolling and existing interaction owners. The user rejected the initial subtle bounce-like result and explicitly selected fuller entrances and exits during implementation.

## Current state

Complete. The user-selected fuller entrances and exits are implemented and visually inspected on desktop/mobile. All 231 browser cases have passing results across the broad and focused runs, including corrected native recordings and retained failure evidence. The broad run itself was 220/231; the final focused three-engine run was 21/21. Final application build, lint, strict types, 17 unit tests and documentation checks pass. Changes remain unstaged and uncommitted; the user service on 3000 was preserved.

## Decisions

- One renderless `LandingMotion` client controller observes explicitly marked server-rendered targets. Individual CSS `translate` preserves existing transforms. Static defaults stay visible.
- Hero: 750ms / 90ms spacing; introductions, content and coherent units: 650ms / 75ms spacing; total delay capped at 180ms. Travel 48px, or 28px through 720px; opacity 0 → 1; exponential entrance easing. Prepare offscreen arrival poses before viewport entry to avoid a visible jump.
- Enter within the central 84% of viewport height; rearm only beyond full layout exit plus 32px. Batch currently entering siblings by visual position and reverse on upward entry. Visible entrances continue through reversal. Departing-edge exits begin in the outer 18% of the viewport: fade to zero and travel 32px (18px mobile) over 280ms with accelerating easing. Reversal recovers from the current exit pose over 320ms without replaying the entrance.
- Reduced motion, focus, fragments, hidden documents and responsive changes settle affected entrances. No packages, public API changes, scroll pinning or new ambient loops.
- Keep cube pause/resume, demo playback, FAQ and navigation with their existing owners. Remove the obsolete deployment controller while retaining its server-rendered container geometry.

## Stages

1. Ground owners and before behavior.
2. Implement controller, markers and owning documentation.
3. Verify three-engine motion/interaction/geometry behavior and inspect desktop/mobile before/during/after full downward/upward passes.
4. Run final quality gates and review the diff.

## Progress

1. Complete: clean starting tree; current source and guidance read; existing production lane runnable.
2. Complete: code, markers and owning documents implemented; initial strict types and production build passed.
3. Complete: three-engine effects, native recordings, interaction/geometry regressions and desktop/mobile visual review.
4. Complete: final lint, types, build, 17 unit tests, formatting, documentation links, whitespace and source/owning-document review.

## Validation criteria

Browser tests must observe direction, timing, reversed order, intermediate opacity/travel and settlement; boundary jitter, complete exit/reentry, fast scroll and reversal; tall mobile progression; initial/hash/focus/restored entry; resizing; startup/dynamic reduced motion; no-JavaScript visibility. Relevant cube, demo, FAQ, navigation, hero and wide geometry regressions run serially in Chromium, Firefox and WebKit. Lint, strict types, units, production build, formatting, local documentation links and whitespace checks pass. Generated evidence stays under `/playwright`.

## Validation results

- Before change: Chromium existing deployment and hero viewport suite, 18/18 passed against the existing production build (`playwright/runs/yornFGCLUy5dwEig`).
- Desktop/mobile before captures: `playwright/motion-before`; inspected desktop deployment and mobile hero. Owned production service on 3188 stopped after capture; user service on 3000 preserved.
- First new Chromium motion run: 10 passed, 2 failed due incorrect existing navbar name/footer fragment selectors; corrected the test selectors. Strict typecheck caught an optional WAAPI timing field in a test; added its zero-delay fallback. These were test harness defects, not product failures.
- Initial three-engine entrance run: 42 passed / 3 failed. Firefox/WebKit pointer fragment activation failed because focus settlement moved the clicked footer link; limit settlement to keyboard-visible focus. Chromium restored-scroll polling hit a navigation context replacement; retry that specific transient evaluation error. All six initial full downward/upward recordings passed, but the user rejected the subtle motion's visual quality; those passes do not establish visual acceptance for the revised treatment.
- Video fixture discovery initially rejected describe-scoped video options; separated recorded native passes into their own test file with top-level video configuration.
- Revised Chromium targeted suite: 16/16 passed (`playwright/runs/qM8TIpw5BBkpQ1U_`), including offscreen preparation and desktop/mobile departing-edge exit/recovery. A preceding 12/13 run had an outdated footer spacing assertion; updated it to the revised timing.
- First broad revised run was interrupted after 8 passes / 3 public-entry failures (`playwright/runs/2Dx7iCfQ4lZzp_X3`). Source review and those error captures identified invalid double-negative root margins at short viewport heights. Use the signed compensated margin directly; added normal-motion landscape regression coverage and rebuilt before resuming.
- Revised code lint, strict types, formatting and 118 local documentation links passed before the margin correction; affected checks must run again at completion. Unit coverage remains 17/17 passed; production builds passed for both motion implementations.
- A focused real-browser height probe found prepared footer travel increased document height by 16px (9043px prepared / 9027px static at 1440px). Clip only the footer's outer decorative overflow, preserve its interior geometry/focus spacing, and add a native scroll-range regression. The broad margin-corrected run was interrupted after 55 passing cases to rebuild with this coupled geometry fix before recording full native passes.
- Final lint, strict types, production build (static `/`), 17 unit tests, formatting, 118 local documentation links and whitespace checks passed. An initial full-suite restart found the preceding QA server still closing on 3187; the subsequent run obtained a fresh owned server without changing ports or touching the user service on 3000.
- The broad run's Chromium mobile native pass stalled at the bottom waiting for an exact initial scroll maximum. A real native `scrollend` probe confirmed a one-pixel settled limit difference (13434px initially / 13433px at smooth completion; desktop stayed 8027px). Clamp the test wait to the current native limit with 2px rounding tolerance and a bounded 10-second wait. Native recordings now keep the initial hero animation live as well; deterministic motion tests still freeze only the owned WAAPI clocks. Re-run all six native passes after this harness correction; application code is unchanged.
- Firefox's mobile recording retained its original capture surface after resizing, although exact-viewport screenshots were correct. Create recorded contexts at their final viewport before page creation; re-record all native passes. The initial desktop filmstrip and mobile start/end screenshots preserve the approved composition.
- WebKit's history restoration differed by one pixel (3846px before navigation / 3845px restored). Assert the native position within 2px while retaining the settlement check. The FAQ capture tried to pause an already-finished 240ms effect; intercept and pause only the first actual pointer animation at creation, then let reversal run naturally. The legacy deployment intermediate capture now uses the same deterministic owned clocks and hydration readiness as the new tests, with two paint frames before computed-style reads.
- The nine-viewport section sweep timed out at 180 seconds while repeatedly waiting for decorative movement to settle. Run this geometry/content sweep with reduced motion; normal motion remains covered by the three-engine entrance/exit tests and recorded full native passes. Public-entry tablet/desktop, workflow composition, demo suspension, and 3440px WebKit geometry also failed in the broad run and require focused reruns; retained traces distinguish expired test budgets and a naturally advanced demo stage from a product assertion failure.
- Lint and strict types pass after the final test harness corrections. No application code changed after the final production build.
- Broad final application run: 220 passed / 11 failed in 45.2 minutes. Failures: Chromium mobile native pass; WebKit demo suspension, public entry at tablet/desktop, workflow composition, mobile native pass, restored scroll, section geometry/content sweep, FAQ intermediate capture, deployment intermediate capture, and 3440px geometry. The larger 3840px and 7680px WebKit geometry checks passed. Raw trace expressions confirm both failed mobile recordings still ran the cached original exact-scroll predicate despite files being corrected during the run; restart the runner for definitive final fixtures. Preserve all failure traces and screenshots. User service on 3000 remains untouched.
- Fresh WebKit regression run (`playwright/runs/W5dfIBPfIxh3lbHt`): demo suspension, tablet entry and 3440px geometry passed; desktop entry and the nine-viewport workflow exhausted their original 30-second budgets. Give those two aggregate checks 90 seconds without removing assertions or axe scans. Workflow then passed in 23.9 seconds (`playwright/runs/9x5qArfJ6j7aeJgw`); desktop completed assertions/axe but stalled on a normal-motion full-page capture. Scan and capture complete settled content under reduced motion with screenshot animations disabled, preventing the artificial capture resize from initiating decorative effects. The corrected WebKit desktop check passed in 31.9 seconds (`playwright/runs/_IsYY0X8PniFc1l3`). Normal motion remains covered by the separate deterministic effects and native recordings. Final 21-case three-engine verification is running from a fresh runner.
- Final focused three-engine run: 21/21 passed in 8.8 minutes (`playwright/runs/OypnWJ-UJf1GrQxJ`). Includes corrected public desktop entry/axe/capture, restored scroll, nine-viewport settled content/imagery/geometry, FAQ pointer reversal, deployment preference/replay, and all six natural desktop/mobile downward/upward recordings. This resolves every broad-run failure in conjunction with the fresh WebKit regression runs above. All 54 new deterministic motion cases have passing results across these runs. No claim of a single clean 231-case run.
- Final lint and strict types passed after all test changes. The last application build and 17/17 unit run remain applicable: only documentation and test harness changes followed them.

## Visual evidence and review

Generated, ignored evidence is local to this checkout under `/playwright`; it is not staged or published.

- Before: `playwright/motion-before` desktop/mobile captures.
- Final native recordings and exact-viewport down/up end screenshots: `playwright/runs/OypnWJ-UJf1GrQxJ/results/landing-motion-visual-visu-3a22f-s-preserves-settled-content-{engine}` (desktop) and `landing-motion-visual-visu-0b93f-s-preserves-settled-content-{engine}` (mobile), each with `video.webm`. Engines: chromium, firefox, webkit.
- Complete desktop/mobile down/up filmstrips: `playwright/motion-review/final-desktop-pass.png` and `final-mobile-pass.png`. Inspected all sections in both directions, settled reading areas, progressive tall mobile content, footer and return to hero.
- Focused natural temporal samples: `playwright/motion-review/final-desktop-hero-sequence.png`, `final-mobile-entry-sequence.png`, and `final-mobile-card-departure.png`. Inspected sequence, actual fade/travel and settled frames. Firefox's exact-viewport start/end PNGs are correct; its exported video still clips the right edge on this Windows host (`final-firefox-mobile-frame.png`). A bounded capture-only DPI experiment did not repair the export; reverted that preference override to retain standard browser settings. That additional Firefox mobile native pass also passed (`playwright/runs/aBr7xUlZ4msTYr51`), but its video remains unsuitable for judging full-width composition. Use Firefox's exact-size PNGs and style assertions, and the readable Chromium desktop/mobile temporal recordings, for that review.
- Deterministic real WAAPI intermediate/reentry/exit captures: the `landing-motion-*` result folders in `playwright/runs/RGRYSG0AwrfTi3jb` and `qM8TIpw5BBkpQ1U_`. These freeze the owned clocks for reproducible style assertions; the final native videos do not freeze or finish entrances synthetically.

| Before                                                                                            | After                                                                                                            | Why                                                                                           |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A small offset was applied after content was already visible, producing a bounce-like impression. | Offscreen content starts at zero opacity in a prepared arrival pose, with fuller travel and composed staggering. | Make entry read as arrival while preserving native scrolling and composition.                 |
| No visible departing-edge exit.                                                                   | Short accelerating fade/travel exits, with continuous recovery on reversal.                                      | Give departure a deliberate transition without interrupting reading or replaying on jitter.   |
| Deployment alone entered once.                                                                    | Explicit targets throughout the landing replay only after a complete buffered exit.                              | Carry consistent direction-aware motion through the full story and progressive mobile groups. |

## Limits

Browser engines ran headlessly on this Windows host against the local production build, serially. Firefox's mobile video export is clipped; its exact-viewport PNGs and behavior/style assertions are valid. Hidden-document handling uses controlled visibility-event delivery, not an OS background/suspension claim. No remote CI or physical-device run was performed. Static defaults, no JavaScript and reduced motion are covered. Generated evidence remains local/ignored; no deployment or commit was requested.

## Remaining work

None within the authorized implementation and local verification scope.
