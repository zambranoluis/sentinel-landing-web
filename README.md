# Sentinel landing web

Public English-language landing for Sentinel, CrimsonTide AI's computer vision and operational intelligence platform. The foundation renders the existing logo and approved description at `/`; landing sections follow later. [PRODUCT.md](PRODUCT.md) owns purpose and journeys; [DESIGN.md](DESIGN.md) owns brand and landing requirements.

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

| Location                                        | Owner                                                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                            | English document, metadata, font/global CSS imports                                                               |
| `src/app/page.tsx`, `page.module.css`           | Server-rendered public entry, no authored client boundary                                                         |
| `src/app/globals.css`                           | Brand tokens, reset, typography and focus                                                                         |
| `src/app/icon.svg`, `public/logos/sentinel.svg` | Consumed copies of original SVG logos                                                                             |
| `references/`                                   | Approved sections, originals and [copy](references/web-content.md); preserve, do not publish the entire directory |
| `tests/browser/`                                | Production public-entry responsive/accessibility tests                                                            |
| `scripts/`                                      | Markdown checker and external artifact paths                                                                      |
| `.github/workflows/quality.yml`                 | Local quality/build/browser/audit gates in CI; remote execution requires a future push                            |
| `workspace/<work-item>/`                        | Shareable durable text under [PLANS](AGENTS/PLANS.md#location); generated QA remains external                     |

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
| `npm run test:browser:list` | Discover real tests in all three engines                                                    |
| `npm run test:browser`      | Existing production build and matching browsers; own server on `127.0.0.1:3187`             |
| `npm audit`                 | Dependency advisories, owned through CODE                                                   |
| `git diff --check`          | Tracked diff whitespace; formatter covers untracked authored files                          |

Tests cover the public entry, SVG/Roboto loading, language/title/landmarks, 390/834/1440px widths, no overflow/runtime/request errors, axe WCAG tags, and 320px reflow with enlarged text/reduced motion. Automated checks do not establish formal conformance. Manually inspect reading order, contrast, 200% zoom and applicable keyboard focus; no controls exist in the foundation. No authenticated/controlled dashboard or persistence lane is introduced.

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
