# Sentinel landing web

Public English-language landing for Sentinel, CrimsonTide AI's computer vision and operational intelligence platform. The accepted baseline renders the navbar and ten supplied sections at `/`. Internal navigation reaches implemented sections and industry cards; assessment/package/add-on actions stay disabled and unspecified destinations remain text. [PRODUCT](PRODUCT.md) owns the offer and open product decisions; [DESIGN](DESIGN.md) owns reusable visual decisions.

## Runtime and setup

Next.js 16.3.8 App Router, React 19.3.0, strict TypeScript, npm, CSS Modules and self-hosted Roboto. Package files own exact versions; [CODE](AGENTS/CODE.md#project-engineering-guidance) owns architecture and approved dependency decisions. Use Node 22.14.0 (supported line: Node 22) and npm 11.7.0:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

Development defaults to `http://localhost:3000`. No environment variables, backend, account or credentials are required. On Linux install browsers with `npx playwright install --with-deps chromium firefox webkit`. Fonts require no external provider fetch during build.

For custom arguments in Windows PowerShell, use the native wrapper, for example `npm.cmd run dev -- --hostname 127.0.0.1 --port 3188`; the PowerShell wrapper previously stripped the argument separator. Inspect and reuse compatible existing services without stopping user-managed processes or silently changing ports. `next.config.ts` disables Next.js automatic agent-rule generation to preserve repository instruction files.

## Locations and boundaries

| Location                                              | Responsibility                                                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`, `src/app/page.tsx`              | English document/metadata, font imports, page composition and skip target                                              |
| `src/components/landing/`                             | Sections, approved repeated content, typed destination availability and narrow client interaction boundaries           |
| `src/app/globals.css`, section CSS Modules            | Global foundations and local section geometry/states                                                                   |
| `src/app/icon.svg`, `public/logos/`, `public/images/` | Consumed originals and converted section images with provenance                                                        |
| `references/`                                         | Approved compositions, originals and [copy](references/web-content.md); preserve sources, publish consumed assets only |
| `.impeccable/design.json`, `.impeccable/surfaces/`    | Design extensions/component samples and durable surface strategy; shareable and formatted                              |
| `tests/unit/`, `vitest.config.mts`                    | Deterministic navigation and artifact-path contracts in Node                                                           |
| `tests/browser/`, `playwright.config.mts`             | Public-entry responsive, accessibility, interaction and motion coverage                                                |
| `scripts/`                                            | Local documentation checking and repository-local QA artifact validation                                               |
| `playwright/`                                         | Ignored generated test evidence: separate runs, reports, captures, traces, attachments and isolated zoom profiles      |
| `.github/workflows/quality.yml`                       | Configured remote quality, unit, build, browser and dependency-audit gates                                             |
| `workspace/<work-item>/`                              | Durable conclusions under [PLANS](AGENTS/PLANS.md#location); generated test evidence belongs in `/playwright`          |

`.next/`, `next-env.d.ts` and TypeScript metadata are generated. Dependencies use the retained npm lockfile. `.codex/` is local, ignored and user-owned. This project introduces no backend, authentication or dashboard contracts. Other repositories and personal host settings are outside its write boundary. Code and documentation use English.

## Commands and verification

| Command                                         | Scope / prerequisites                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                   | Development server; installed dependencies                                                               |
| `npm run build`                                 | Production compilation and route generation                                                              |
| `npm run start`                                 | Serve an existing production build                                                                       |
| `npm run lint`                                  | ESLint on source, tests and tooling                                                                      |
| `npm run typecheck`                             | Generate Next.js declarations, then strict TypeScript; works before a first build                        |
| `npm run format:check` / `npm run format`       | Check / format nonignored authored files, including the instruction chain and Impeccable Markdown/JSON   |
| `npm run docs:links`                            | Local Markdown targets/anchors, including Impeccable briefs; no external URL fetch                       |
| `npm run check`                                 | Aggregate lint, types, formatting and documentation checks                                               |
| `npm run test:unit` / `npm run test:unit:watch` | Vitest navigation and artifact resolver contract tests / watch in Node                                   |
| `npm run test:browser:list`                     | Discover production browser cases; creates a separate local run directory                                |
| `npm run test:browser`                          | Existing production build, installed browsers, owned server on `127.0.0.1:3187`; output in `/playwright` |
| `npm audit`                                     | Current dependency advisories; updates follow CODE's approval rule                                       |
| `git diff --check`                              | Tracked whitespace; formatter also covers untracked authored files                                       |

Choose checks by the [changed mechanism](AGENTS/CODE.md#verification). Documentation work needs link/format/source and instruction-chain checks; checker edits also need lint and affected positive/negative validation. A design extraction needs parsed artifacts and focused computed-style comparison. These do not automatically require a complete product browser suite. CI retains its configured full gates.

Existing unit coverage checks unavailable destinations expose no URL and enabled internal targets exist. Browser coverage includes supplied copy/assets/Roboto, landmarks, disabled CTAs, disclosure keyboard/focus/rapid reversal, fragment focus, FAQ/no-JavaScript behaviour, cube pause/resume, demo looping/visibility/reduced motion, deployment entry, responsive boundaries, enlarged text, first-viewport hero and bounded desktop geometry. Three-engine tests run serially after historical parallel Firefox axe timeouts. Chromium-only isolated temporary extensions exercise actual browser zoom without accessing a user profile.

Generated test evidence belongs in the ignored repository-local `/playwright` folder, including manual probes and saved diagnostics. The resolver recreates it as needed in a fresh checkout and defaults to `/playwright/runs/<unique-run-id>/`, anchored to the repository location rather than the shell working directory. Each run contains Playwright `results/` and `report/`; screenshots, traces, recordings, attachments and isolated zoom profiles use the existing output mechanisms. Separate default runs preserve earlier evidence because [Playwright clears its output directory at startup](https://playwright.dev/docs/api/class-testconfig#test-config-output-dir). Git, formatting, ESLint, TypeScript discovery and Markdown-link scanning exclude `/playwright`.

`SENTINEL_E2E_ARTIFACTS_ROOT` may designate an absolute dedicated subdirectory inside `/playwright`. Collection-root, external and redirect-escape paths are rejected, including escaping `results/` or `report/` redirects. Use a new name for each execution to retain earlier evidence; reusing a named run lets Playwright replace its previous output. For example, in PowerShell:

```powershell
$env:SENTINEL_E2E_ARTIFACTS_ROOT = Join-Path (Get-Location) "playwright/runs/my-capture-run"
npm.cmd run test:browser -- --project=chromium --grep "public entry at desktop"
Remove-Item Env:SENTINEL_E2E_ARTIFACTS_ROOT
```

Run the example from the repository root. Omit the variable for automatic unique runs. To inspect a report, use `npx playwright show-report playwright/runs/<run-id>/report`. Tests refuse to reuse an existing service on their port. CI writes and uploads the checkout's `/playwright` collection. Generate only evidence required by the selected checks; this location does not require extra screenshots, recordings, manifests or analysis files.

Historical run results belong in the [reconciliation history](workspace/documentation-reconciliation/records/history.md), [hero viewport record](workspace/hero-viewport/plan.md) and [demo loop record](workspace/demo-loop/plan.md). These are dated reports, not current verification. The latest recorded demo work passed 171 unique browser cases across a broad run and targeted reruns, not a single uninterrupted clean run. Deletion without migration of their former raw evidence under the dedicated OS-temp `sentinel-landing-web-qa` directory was requested on 2026-10-02, but automatic approval review blocked deletion. That directory remains present pending cleanup; its old paths are historical references, not current verification. Dated reports and exact archived snapshots remain preserved. Formal accessibility conformance, real-device/field performance, authenticated/dashboard behaviour and remote CI are not established by those records. Product-owned integration gaps remain in PRODUCT.

## Agent host operations

Task-entry discovery concerns the active host, permissions and capabilities relevant to the request. Cross-provider execution is needed only when expressly in scope; portability does not require ordinary work to run under four providers. Keep launchers, adapters, hooks and settings with their operational owner. This repository makes no host-setting changes and supplies no new adapter.

Official loading references, retrieved 2026-10-02:

| Host        | Documented mechanism / diagnosis                                                                                                                                                                                                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex       | [AGENTS discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md) follows the applicable directory chain. [Local skills](https://learn.chatgpt.com/docs/build-skills) include personal `~/.agents/skills` and repository `.agents/skills`.                                                       |
| Claude Code | [Memory and AGENTS conditions](https://code.claude.com/docs/en/memory) depend on version/configuration; inspect actual loaded context. [Skills](https://code.claude.com/docs/en/skills) use personal `~/.claude/skills` and project `.claude/skills`, with cloud availability distinct from local availability. |
| Copilot CLI | [Custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) documents AGENTS and other instruction sources; discovered files are not proof of effective model behaviour.                                                                            |
| OpenCode V2 | Use [V2 instructions](https://opencode.ai/v2/docs/instructions) for the historically observed v2 host rather than assuming another major version's loading rules.                                                                                                                                               |

Local inspection on 2026-10-02 found Claude's personal `impeccable` and `instructions-maker` junctions pointing to the canonical `~/.agents/skills` folders. No registration change is needed for that path relationship; filesystem discovery does not prove activation. Personal skills are not automatically available to collaborators or hosted sessions.

For a loading diagnosis, establish the active version, documented discovery/priority, available files and actual loaded context separately. A user-provided AGENTS block or a model's claim is not independent native-loader evidence. Missing account access blocks that host's probe, not unrelated product work. Only add/change host configuration when requested and justified by observed need. Historical four-host observations and their exact limits are preserved in [history](workspace/documentation-reconciliation/records/history.md); their obsolete adoption gates are retired.

## Documentation map

- [AGENTS](AGENTS.md): working agreement, authorization and routing.
- [PRODUCT](PRODUCT.md): product truth, audience, positioning, scope and open product decisions.
- [DESIGN](DESIGN.md): reusable visual decisions and normative token values.
- [Design sidecar](.impeccable/design.json): extension metadata and representative component snippets.
- [Landing brief](.impeccable/surfaces/src-app-page-tsx.md) and [How it works brief](.impeccable/surfaces/src-components-landing-howitworks-tsx.md): Persuade surface strategy and direction contracts, not execution state.
- [CODE](AGENTS/CODE.md): engineering mechanisms, verification and debt.
- [INVESTIGATIONS](AGENTS/INVESTIGATIONS.md): evidence and unresolved facts.
- [FRONTEND_CREATION](AGENTS/FRONTEND_CREATION.md): direction discovery, skills and conditional previews.
- [PLANS](AGENTS/PLANS.md): proportional records, stops and resumption.
- [Documentation reconciliation](workspace/documentation-reconciliation/plan.md): findings, history recovery, scenario review and this revision's results.

Durable text and Impeccable artifacts are eligible for version control once committed by the user. Keep secrets and authentication state out of shared records; generated test evidence stays in ignored `/playwright`. No staging, commit, push or deployment is implied.
