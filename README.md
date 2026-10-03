# Sentinel landing web

Public English-language landing for Sentinel, CrimsonTide AI's computer vision and operational intelligence platform. All ten supplied sections render at `/`: hero, How it works, capabilities, product demo, deployment, benefits, plans, FAQs, final assessment CTA and footer. The navbar and matching footer links reach implemented sections and industry cards. Assessment, package and add-on buttons remain disabled; unspecified company/legal destinations remain plain text. [PRODUCT.md](PRODUCT.md) owns purpose and journeys; [DESIGN.md](DESIGN.md) owns brand and landing requirements.

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

| Location                                              | Owner                                                                                                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                                  | English document, metadata, font/global CSS imports                                                                                             |
| `src/app/page.tsx`                                    | Server-rendered page composition and skip target                                                                                                |
| `src/components/landing/`                             | All landing sections and shared brand/action/availability; mobile navigation, cube, demo, deployment entry and FAQ are narrow client boundaries |
| `src/app/globals.css`                                 | Brand tokens, reset, typography and focus                                                                                                       |
| `src/app/icon.svg`, `public/logos/`, `public/images/` | Consumed original logos, warehouse backgrounds and section WebP images with provenance sidecars                                                 |
| `references/`                                         | Approved sections, originals and [copy](references/web-content.md); preserve, do not publish the entire directory                               |
| `tests/browser/`                                      | Production public-entry responsive/accessibility tests                                                                                          |
| `tests/unit/`, `vitest.config.mts`                    | Navigation availability contract tests in Node; separate from browser discovery                                                                 |
| `scripts/`                                            | Markdown checker and external artifact paths                                                                                                    |
| `.github/workflows/quality.yml`                       | Quality/unit/build/browser/audit gates in CI; remote execution requires a future push                                                           |
| `workspace/<work-item>/`                              | Shareable durable text under [PLANS](AGENTS/PLANS.md#location); generated QA remains external                                                   |

`.next/`, `next-env.d.ts` and TypeScript metadata are generated. Dependencies use the retained npm lockfile. Existing `.codex/` is local, ignored and user-owned. No backend, auth or dashboard contracts are introduced. Other repositories are outside the write boundary. Code and documentation use English.

## Commands and verification

| Command                     | Scope / prerequisites                                                             |
| --------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`               | Next.js development; installation required                                        |
| `npm run build`             | Production compilation and route generation                                       |
| `npm run start`             | Serve an existing production build                                                |
| `npm run lint`              | ESLint Next.js/TypeScript on source, tests and tooling                            |
| `npm run typecheck`         | Generate Next.js declarations, then strict TypeScript; works before a first build |
| `npm run docs:links`        | Local Markdown targets/anchors; no external URL fetch                             |
| `npm run check`             | Lint, types, formatting and documentation                                         |
| `npm run test:unit`         | Vitest 5.0.3, `tests/unit/**/*.test.ts` in Node; no DOM package                   |
| `npm run test:unit:watch`   | Watch the same unit test surface                                                  |
| `npm run test:browser:list` | Discover real tests in all three engines                                          |
| `npm run test:browser`      | Existing production build and matching browsers; own server on `127.0.0.1:3187`   |
| `npm audit`                 | Dependency advisories, owned through CODE                                         |
| `git diff --check`          | Tracked diff whitespace; formatter covers untracked authored files                |

Unit tests verify unavailable destinations expose no URL and enabled internal targets exist. Production browser tests cover landmarks, exact copy and labels, local SVG/image/Roboto 400/500/700 loading, disabled CTAs, disclosure keyboard/Escape/focus/desktop closure, skip navigation, no-JavaScript static content, 390/834/1440px widths, 720/721/1279/1280px boundaries, no overflow/runtime/request errors, closed/open axe scans and 320px reflow with enlarged text/reduced motion. Navbar coverage includes the icon-only trigger's accessible names and 44px target, burger/X endpoints, halfway geometry, live rapid reversal, immediate reduced-motion switching and icon reset after desktop resizing. A Chromium-only test uses an isolated, permission-free temporary extension to apply actual 200% browser zoom and checks reflow and keys; no user browser profile or installed extension is touched. Workers run serially after parallel Firefox axe scans timed out on this Windows host.

The [desktop-width record](workspace/desktop-width/plan.md) records the preceding width verification, corrections and external evidence. All 111 unique browser cases are verified: the full run passed 110 with one existing WebKit full-page screenshot timeout, and an unchanged focused rerun passed that case. All 27 wide geometry checks and eight low-zoom checks passed. Build/lint/types/format, 3/3 unit tests and dependency audit (zero vulnerabilities) pass. `docs:links` (and therefore aggregate `check`) fails on eight references to six pre-existing absent records: two adoption-foundation records referenced by AGENTS/ADOPTION.md, the desktop-width plan, the [site completion plan](workspace/site-completion/plan.md), its finish review referenced by DESIGN, and the How it works plan below. Their instruction-system and implementation-history owners must recover or reconcile authentic records; this width correction preserves the unresolved references. Automated checks and rendered review do not establish formal accessibility conformance. No authenticated/dashboard or persistence lane is introduced; remote CI remains unexecuted until a requested push.

Artifacts default to a dedicated run under the OS temporary directory's `sentinel-landing-web-qa/`. Set `SENTINEL_E2E_ARTIFACTS_ROOT` to a dedicated absolute external directory for a known location. Repository targets, ancestors and symlink redirects into the repository are rejected. Reports, screenshots and failure traces stay local; CI uses `runner.temp` and uploads public-entry evidence. Tests refuse to reuse an existing service on their port.

The [How it works record](workspace/how-it-works/plan.md) owns the section extension and its verification. `/#how-it-works` is available from the navbar and footer. Its supplied cube motion has a pause/resume control, pauses offscreen and in hidden documents, and becomes static with reduced motion or without JavaScript. Browser coverage exercises the workflow across responsive boundaries, motion continuity and navigation focus.

The completed-page suite also checks supplied prose, all section imagery and nine responsive widths, native FAQ keyboard/no-JavaScript behavior, reversible disclosure motion, illustrative demo autoplay/repeated loops, its two-second final hold, visibility suspension, static reduced-motion/no-JavaScript review and motion-preference changes, deployment entry, fragment focus and enlarged text. Generated captures are split by section where full-page bitmap dimensions exceed browser limits.

Desktop content follows a centered 1920px reference frame with a 1536px main content cap. Layouts retain their existing geometry through 1920px; wider effective viewports add equal outer margins. Full-width backgrounds remain fluid. Capabilities keeps its bounded asymmetric 1689.6px composition. [DESIGN](DESIGN.md#landing-requirements) owns these requirements; [the desktop-width record](workspace/desktop-width/plan.md) owns results and external evidence. The geometry suite covers 1280, 1440, 1919, 1920, 1921, 2560, 3440, 3840 and 7680px across Chromium, Firefox and WebKit. Isolated Chromium zoom coverage additionally applies real 80%, 67%, 50% and 25% browser zoom at 1440px and 1920px physical viewport widths, verifies the applied factor/effective viewport with rounding tolerance, and checks content alignment and caps. Existing 200% zoom, mobile/tablet, keyboard and reduced-motion coverage remains part of the production suite.

Navbar and hero fill at least the first viewport at every breakpoint. `NavbarFrame.tsx` measures the full header height with a border-box observer; global CSS provides an 81px fallback. Hero sizing uses `100dvh` with a `100vh` fallback and permits taller content to scroll. The mobile image band grows below the copy, and enlarged desktop navigation can wrap. `tests/browser/hero-viewport.spec.ts` checks first-screen geometry, short landscape, 200% text, border/content resizing, disclosure and no JavaScript across all three engines; the existing real 200% browser-zoom test also checks first-screen geometry. [The hero viewport record](workspace/hero-viewport/plan.md) owns current verification and external before/after evidence. All 162 discovered browser cases have passed across the broad run and focused reruns. The final 72-case subset passed 71 cases; the remaining WebKit whole-page capture exceeded its 30-second deadline and passed unchanged with a 90-second deadline. All 51 hero cases pass. Build, lint, types, formatting and 3/3 unit tests pass; documentation links retain the baseline failures above.

The [demo loop record](workspace/demo-loop/plan.md) owns the demo simplification, current verification and external before/after captures. All 171 unique browser cases passed across the full run (166 passed) and targeted WebKit rerun (five passed); the final three-engine stage-indicator checks also passed. The broad responsive test retains its 180-second default and honors a larger explicit CLI timeout on slower hosts. Baseline documentation-link failures remain unchanged.

## Documentation map

- [AGENTS.md](AGENTS.md): working agreement and routing.
- [PRODUCT.md](PRODUCT.md): truth, audience, landing scope and journey unknowns.
- [DESIGN.md](DESIGN.md): brand baseline and separate landing requirements.
- [CODE.md](AGENTS/CODE.md): engineering, contracts, gates and debt.
- [INVESTIGATIONS.md](AGENTS/INVESTIGATIONS.md): evidence.
- [FRONTEND_CREATION.md](AGENTS/FRONTEND_CREATION.md): conditional direction and previews.
- [PLANS.md](AGENTS/PLANS.md): durable state and resumption.

Durable text is eligible for version control and collaborator use once committed by the user; this task does not stage, commit or push. Keep secrets/authentication state and generated QA outside shared records. Capability launchers, hooks and settings stay with their owners.
