# Centralize generated test output

## State and authorization

The user authorized implementation of the supplied plan, including deletion without migration of exactly `C:\Users\MrMonka\AppData\Local\Temp\sentinel-landing-web-qa`. Repository changes are implemented. Local verification is complete; cleanup remains blocked by automatic approval review. No staging, commits, push, deployment, dependency changes or OpenJM edits are authorized or performed.

## Implementation

- Generated evidence uses ignored repository-local `/playwright`; default runs use compact 96-bit random identifiers under `runs/`, anchored to the resolver module's repository. Short identifiers preserve the isolated Chromium profile's Windows path budget. Named absolute subdirectories remain supported; root/external paths and redirect escapes are rejected, including escaping `results/` and `report/` redirects.
- Git, Prettier, ESLint, TypeScript discovery and Markdown-link scanning exclude the collection. Authored tests stay in `tests/`; conclusions stay in `workspace/`. README and CODE guide relevant evidence inspection and proportional capture.
- CI uploads the checkout's `/playwright` folder. Browser projects, port 3187, serial workers and capture settings are unchanged. The configuration was renamed to `playwright.config.mts` because the original CommonJS-loaded `.ts` config failed when the repository-anchored resolver introduced `import.meta.url`; ESM discovery and execution now work.
- Historical reports have a dated pending-cleanup notice. Exact archived text snapshots remain unchanged. No historical evidence was migrated.

## Verification on 2026-10-02

- `npm run test:unit`: 17/17 passed, including 14 artifact resolver cases (defaults, independent cwd, worker handoff, retention, named/root/external paths, ancestor/run/output junctions and dangling redirects).
- `npm run check`: lint, typecheck, formatting and 116 local Markdown links/anchors passed. Repeated with deliberately invalid generated files present; authored discovery remained intact. `git diff --check` passed.
- `/playwright/exclusion-probe/check.mjs`: generated Markdown/TypeScript excluded from Prettier, ESLint, TypeScript and Markdown scanning; authored positive/negative controls passed. Fixtures and diagnostics remain ignored there.
- `npm run test:browser:list`: 171 cases in seven files. Discovery output: `/playwright/runs/run-1790995457333-94f9221f-5750-4890-8932-eaf68c2f6485/`. An initial CommonJS resolver loading failure was corrected by the configuration rename.
- Focused capture: `npm run test:browser -- --project=chromium --grep 'navbar and hero fill the first screen at desktop$'`: 1/1 passed. Run `/playwright/runs/run-1790995616552-85eaff38-30a4-4dd9-9a65-79980a2a7456/` has `results/.../first-screen.png` and a report with one expected pass; screenshot opened and inspected. An initial anchored grep matched no tests; that diagnostic run is retained separately.
- Chromium 200% zoom hit the unchanged 30-second deadline while the extension awaited Chrome's zoom API. Run `/playwright/runs/run-1790995715441-2fbbf326-2193-4f35-9c42-2fe6949e1e91/` retains its report, failure screenshot, trace, extension and isolated browser profile under `results/`. The unchanged 90-second rerun also timed out in `/playwright/runs/run-1790995794490-89a8034f-dd8a-4a7f-b6d7-e3e8ae29f16f/`. A short named path `/playwright/zoom-short/` passed 1/1 in 7.3 seconds. Shortening default IDs then passed the unchanged test at its normal 30-second deadline: 1/1 in 7.4 seconds, run `/playwright/runs/bnFv47Je7F9tV7qA/`. This isolates a path-length-dependent host failure; no zoom assertions or capture settings changed. The final default run contains ten zoom screenshots, its HTML report and the isolated extension/profile under `results/`. Hero and zoom screenshots were opened and inspected; report embedded data confirms one expected pass in each successful run.
- Git ignore checks confirmed generated files are ignored. Earlier local runs, including the capture and zoom failures, survived later executions; the original capture SHA256 remained `70e16bae4179a3c6efedab35c3752db96650419cbdee046fa0760d240c345edb`. All five archived text snapshots were byte-identical to HEAD. Port 3187 has no remaining listener after the tests.
- CI reviewed statically; remote execution is unverified. Existing production build was used for these infrastructure checks; no product code changed. User-managed development services were preserved.

## Cleanup blocker and next action

Native PowerShell validation confirmed the exact resolved legacy path, no ancestor or descendant reparse points, and no active test processes using it. It contained 23,805 entries totaling 4,054,842,237 bytes. Both the guarded cleanup command and a separate literal-path `Remove-Item -Recurse -Force` were rejected as `blocked by policy`. The directory remains present. Approval policy does not permit escalation in this session; do not evade the rejection with another deletion mechanism.

The remaining cleanup requires an execution context that permits the explicitly authorized native deletion, with fresh redirect/process checks. Update the notices to confirm intentional deletion only after absence is verified. The maintainer owns the first remote CI run.
