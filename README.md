# Sentinel landing web

Public English-language landing for Sentinel, CrimsonTide AI's computer vision and operational intelligence platform. The current milestone renders the reference navbar, warehouse hero and footer at `/`. All supplied labels remain visible; destinations for later sections and unspecified pages are noninteractive text. Assessment buttons are disabled. [PRODUCT.md](PRODUCT.md) owns purpose and journeys; [DESIGN.md](DESIGN.md) owns brand and landing requirements.

## Runtime and setup

Next.js 16.3.8 App Router, React 19.3.0, strict TypeScript, npm, CSS Modules and self-hosted Roboto through Fontsource. [CODE](AGENTS/CODE.md#project-engineering-guidance) owns decisions and approvals. Use Node 22.14.0 (supported line: Node 22) and npm 11.7.0:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

Development defaults to `http://localhost:3000`. No environment variables, backend, account or credentials are required. On Linux use `npx playwright install --with-deps chromium firefox webkit`. Fonts need no external provider fetch during build.

For custom arguments in Windows PowerShell, use the native wrapper, for example `npm.cmd run dev -- --hostname 127.0.0.1 --port 3188`. The `npm.ps1` wrapper on this machine stripped the argument separator. `next.config.ts` disables Next.js automatic agent-rule generation so development startup preserves the repository's instruction files.

## Locations and boundaries

| Location                                                           | Owner                                                                                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                                               | English document, metadata, font/global CSS imports                                                               |
| `src/app/page.tsx`                                                 | Server-rendered page composition and skip target                                                                  |
| `src/components/landing/`                                          | Navbar, hero, footer, shared brand/action/availability; only `MobileNavigation.tsx` is a client boundary          |
| `src/app/globals.css`                                              | Brand tokens, reset, typography and focus                                                                         |
| `src/app/icon.svg`, `public/logos/`, `public/images/warehouse.png` | Consumed original SVG copies and warehouse image                                                                  |
| `references/`                                                      | Approved sections, originals and [copy](references/web-content.md); preserve, do not publish the entire directory |
| `tests/browser/`                                                   | Production public-entry responsive/accessibility tests                                                            |
| `tests/unit/`, `vitest.config.mts`                                 | Navigation availability contract tests in Node; separate from browser discovery                                   |
| `scripts/`                                                         | Markdown checker and external artifact paths                                                                      |
| `.github/workflows/quality.yml`                                    | Quality/unit/build/browser/audit gates in CI; remote execution requires a future push                             |
| `workspace/<work-item>/`                                           | Shareable durable text under [PLANS](AGENTS/PLANS.md#location); generated QA remains external                     |

`.next/`, `next-env.d.ts` and TypeScript metadata are generated. Dependencies use the retained npm lockfile. Existing `.codex/` is local, ignored and user-owned. No backend, auth or dashboard contracts are introduced. Other repositories are outside the write boundary. Code and documentation use English.

## Commands and verification

| Command                     | Scope / prerequisites                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`               | Next.js development; installation required                                                  |
| `npm run build`             | Production compilation and route generation                                                 |
| `npm run start`             | Serve an existing production build                                                          |
| `npm run lint`              | ESLint Next.js/TypeScript on source, tests and tooling                                      |
| `npm run typecheck`         | Generate Next.js declarations, then strict TypeScript; works before a first build           |
| `npm run format:check`      | Prettier on authored files; originals, settings and unchanged neutral instructions excluded |
| `npm run format`            | Format the same files                                                                       |
| `npm run docs:links`        | Local Markdown targets/anchors; no external URL fetch                                       |
| `npm run check`             | Lint, types, formatting and documentation                                                   |
| `npm run test:unit`         | Vitest 5.0.3, `tests/unit/**/*.test.ts` in Node; no DOM package                             |
| `npm run test:unit:watch`   | Watch the same unit test surface                                                            |
| `npm run test:browser:list` | Discover real tests in all three engines                                                    |
| `npm run test:browser`      | Existing production build and matching browsers; own server on `127.0.0.1:3187`             |
| `npm audit`                 | Dependency advisories, owned through CODE                                                   |
| `git diff --check`          | Tracked diff whitespace; formatter covers untracked authored files                          |

Unit tests verify unavailable destinations expose no URL and enabled internal targets exist. Production browser tests cover landmarks, exact copy and labels, local SVG/image/Roboto 400/500/700 loading, disabled CTAs, disclosure keyboard/Escape/focus/desktop closure, skip navigation, no-JavaScript static content, 390/834/1440px widths, 720/721/1279/1280px boundaries, no overflow/runtime/request errors, closed/open axe scans and 320px reflow with enlarged text/reduced motion. Navbar coverage includes the icon-only trigger's accessible names and 44px target, burger/X endpoints, halfway geometry, live rapid reversal, immediate reduced-motion switching and icon reset after desktop resizing. A Chromium-only test uses an isolated, permission-free temporary extension to apply actual 200% browser zoom and checks reflow and keys; no user browser profile or installed extension is touched. Workers run serially after parallel Firefox axe scans timed out on this Windows host.

For this milestone, 3 unit tests and 25 production browser checks passed locally; production build, lint/types/format/links, dependency audit and visual comparison passed. The [implementation record](workspace/landing-base/plan.md) preserves failures, corrections and evidence locations. Desktop, tablet, mobile, open menu, enlarged text and real 200% browser-zoom captures received a manual rendered review for composition, reading order, contrast and focus. Automated checks do not establish formal conformance. No authenticated/controlled dashboard or persistence lane is introduced; remote CI remains unexecuted until a requested push.

The [navbar icon transition](workspace/navbar-icon/plan.md) extends that baseline to 31 passing production browser checks across Chromium, Firefox and WebKit, with 3 unit tests and all quality/build/audit checks passing. Its record preserves the regression-test corrections and final evidence location.

Artifacts default to a dedicated run under the OS temporary directory's `sentinel-landing-web-qa/`. Set `SENTINEL_E2E_ARTIFACTS_ROOT` to a dedicated absolute external directory for a known location. Repository targets, ancestors and symlink redirects into the repository are rejected. Reports, screenshots and failure traces stay local; CI uses `runner.temp` and uploads public-entry evidence. Tests refuse to reuse an existing service on their port.

## Documentation map

- [AGENTS.md](AGENTS.md): working agreement and routing.
- [PRODUCT.md](PRODUCT.md): truth, audience, landing scope and journey unknowns.
- [DESIGN.md](DESIGN.md): brand baseline and separate landing requirements.
- [CODE.md](AGENTS/CODE.md): engineering, contracts, gates and debt.
- [INVESTIGATIONS.md](AGENTS/INVESTIGATIONS.md): evidence.
- [FRONTEND_CREATION.md](AGENTS/FRONTEND_CREATION.md): conditional direction and previews.
- [PLANS.md](AGENTS/PLANS.md): durable state and resumption.

Durable text is eligible for version control and collaborator use once committed by the user; this task does not stage, commit or push. Keep secrets/authentication state and generated QA outside shared records. Capability launchers, hooks and settings stay with their owners.
