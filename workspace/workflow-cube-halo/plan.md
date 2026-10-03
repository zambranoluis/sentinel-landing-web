# Workflow cube halo and styling

## Current state

Implementation and required verification are complete. Final serial Chromium, Firefox and WebKit coverage passed 72/72 in one clean run against the existing repository development server at `http://127.0.0.1:3200` (listener PID 12692). The user-managed server remains running. No remaining implementation action.

## Decisions

- Change the bottom halo only; preserve the inner core glow, cube geometry, approved copy, card positions and section entrances.
- Give the halo its own 5.2-second CSS cycle and share the lower rows' 0.7-second delay. It stays dark through 1.22s, peaks at 1.74s and fades to zero at 2.468s, repeating with the lower rows.
- Place its masked group before the faces inside the floating group. Apply the silhouette mask after blur and local, centered ellipse scaling.
- Use `#05ddf1` for all five workflow icons and circular rings. Remove playback markup/state, focus transfer, control styling and reserved mobile space.
- Keep automatic offscreen/hidden-document pausing, reduced-motion and no-JavaScript static behavior. Preserve the user-managed server and historical records; no dependency, public component API, staging, commit or deployment changes.
- Current contracts are maintained in [DESIGN](../../DESIGN.md#workflow-illustration), [CODE](../../AGENTS/CODE.md#project-engineering-guidance), README and the Impeccable surface/sample owners.

## Checks

- Before evidence: `playwright/runs/workflow-halo-before/section-1440.png` confirmed the halo used the inner core animation outside the floating group, with inconsistent icon/ring colors and a pause button.
- Initial workflow run: 15 passed, 3 failed. The newly added no-JavaScript assertion awaited page callbacks (`animation.ready`/requestAnimationFrame), timing out with scripts disabled. It was replaced with direct timeline snapshots separated by a rendered screenshot; its focused three-engine rerun passed 3/3. Failure evidence remains in `playwright/runs/workflow-halo-verification`; corrected evidence is in `playwright/runs/workflow-halo-static-correction`.
- Two-cycle controlled samples and inspected screenshots confirm initial darkness, lower-row activation, peak/fade and centered scaling. Responsive workflow coverage includes 320, 390, 720, 721, 834, 1279, 1280, 1440 and 1910px, matching icon/ring colors, accessibility, enlarged text, fallback and fragment focus.
- Mask probe: at the 1.74s peak, toggle only halo visibility with the other timelines frozen. Three 5x5 patches inside the faces show zero RGB difference in every engine; three outside patches show maximum-channel changes of 34–46. Evidence: `playwright/runs/workflow-halo-mask-probe/comparison.json` and paired screenshots. The initial pixel-analysis attempt could not import Pillow; Windows System.Drawing completed the comparison without installing dependencies.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run format:check`, `npm run docs:links` and `git diff --check` passed. Lint/types passed again after the test correction; final formatting/links/diff checks also cover this record (121 local link targets).
- Final command: `npm run test:browser -- tests/browser/how-it-works.spec.ts tests/browser/landing-motion.spec.ts --workers=1`, with evidence root `playwright/runs/workflow-halo-final`: **72 passed in 3.8 minutes**, comprising 18 workflow cases and 54 landing-motion regressions. Final intermediate, tablet/mobile and enlarged-text screenshots were inspected; the halo is centered and masked, and content fits without overlaps or horizontal overflow.

## Remaining work

None within the approved plan. Local browser checks reused a development server; the separate successful build establishes production compilation. A production-server browser run and remote CI are outside this verification scope.
