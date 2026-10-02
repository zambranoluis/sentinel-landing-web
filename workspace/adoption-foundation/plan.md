# Sentinel landing frontend foundation

## Objective

Establish a runnable Next.js foundation, reconcile the project authorities, and verify development and host workflows before implementing landing sections.

## Current state

Approved foundation implemented and locally verified. Clean install, quality gates, production build and 12 production browser tests passed. Development startup and the public route were exercised; automatic Next.js agent-rule generation is disabled and root AGENTS is unchanged. All authorized implementation and bounded host probes are finished. Adoption remains open for Claude access, Codex/Copilot loading provenance and OpenCode's conditional-preview behavior. Next action for adoption is the exact host-owned follow-up in [host verification](records/host-verification.md); the next product milestone remains navigation/hero after the missing CTA contracts are settled.

## Stages / milestones

1. Scaffold approved runtime, tokens, consumed assets and minimal semantic entry.
2. Add quality commands, documentation checks, browser coverage and CI.
3. Reconcile permanent project owners and temporary adoption guide.
4. Verify local commands, production browsers, manual presentation and dependency audit.
5. Exercise fresh Codex, Claude Code, Copilot CLI and OpenCode sessions with read-only scenarios; record actual activation and blockers.

## Progress

Stages 1–4 complete for the implemented foundation, with native browser-chrome zoom explicitly unverified. Stage 5 bounded probes complete with results and blockers; full adoption acceptance remains incomplete. No staging/commit/push/deployment occurred.

## Validation criteria

Install exact approved versions without forced peers. Pass lint, strict types, formatting, local Markdown links/anchors and production build. Discover real browser tests; pass production Chromium, Firefox and WebKit at mobile/tablet/desktop widths with loaded logo and Roboto, correct language/title/landmarks, readable content, no overflow, browser errors or failed first-party requests, and no automated accessibility violations. Inspect reading order, contrast, zoom and applicable focus manually. Report audit findings and owners. Verify each host's native entry loading, routed reads, skill discovery and answer/review/implementation-planning/UI-planning/blocked-contract behavior, or retain explicit blockers.

## Validation results

Initial git status: only pre-existing untracked `.codex/`; no before-state application. Node 22.14.0/npm 11.7.0 verified. All exact approved packages installed without forced peers. `npm ci` passed (352 packages); `npm audit` reported zero vulnerabilities. Approved ESLint 9.39.5 emits an unsupported-version warning, owned in CODE.

`npm run check` passed lint, strict types, formatting and 70 local links/anchors. Production build passed and generated static `/`, `/_not-found` and `/icon.svg`. Browser discovery listed 12 real tests; all 12 passed in Chromium/Firefox/WebKit (31.1s) after correction. Three widths per engine verified asset/font loading, semantics, overflow, errors/requests and axe; 320px enlarged-text/reduced-motion tests also passed. [Visual review](records/visual-review.md) records all nine inspected captures, reading order, 9.39:1 contrast, focus applicability and zoom limits.

After `agentRules: false`, repeated `npm run check` (75 links/anchors), production build and all 12 browser tests passed again (32.7s). `npm audit` again reported zero vulnerabilities; `git diff --check` passed and root AGENTS had zero diff. Final runtime evidence is under `%TEMP%/sentinel-landing-web-qa/foundation-20261001/config-final/`; reviewed captures from `browser-final/` remain applicable because the config correction does not change UI rendering. Task-owned dev/start processes were stopped and ports 3187/3188/3189 have no remaining listener. Consumed logo/icon copies are byte-identical to their reference sources.

`typecheck` now explicitly runs `next typegen && tsc --noEmit`, matching the installed Next.js CLI guidance and generating ignored route/environment declarations before strict validation. An isolated copy with no generated declarations passed that sequence before dev/build (`%TEMP%/sentinel-fresh-typecheck-M5Mjxh/`). Bare TypeScript also passed for this minimal source: the first probe's expectation of a fresh-checkout failure was contradicted and its assertion failed. This is not a reproduced CI defect; typegen makes the route-generation gate explicit. `npm run check` passed after the script change. Final text-only reconciliation requires only formatting/link/diff checks, not another unchanged browser run.

Final text reconciliation passed Prettier, all 75 local links/anchors and diff whitespace checks. Core AGENTS/INVESTIGATIONS/FRONTEND_CREATION/PLANS and all reference originals have no tracked diff. The temporary guide and execution/host/visual records agree on implementation completion, verified evidence and outstanding adoption checks.

The first browser run was interrupted by an overlapping `npm ci`: Windows EPERM on loaded SWC and seven missing-module/worker failures after five passes. This was an agent orchestration failure, not an application finding. Closed the test-owned process, ran clean install successfully, then repeated check/build/discovery/full suite sequentially. Preserve this failure and correction; do not interpret the first run as valid three-engine evidence.

Development/start arguments through `npm.ps1` lost `--` and failed with an invalid project-directory error; `npm.cmd` preserved them. Both dev and production started; browser/HTTP probes returned 200 with approved text, loaded logo/font and no page errors. `next dev` appended a managed AGENTS block; inspected the installed schema/startup producer, set top-level `agentRules: false`, removed only that generated block, restarted development, loaded `/` and confirmed root AGENTS has no tracked diff. Authored settings and reference originals remain unchanged.

Artifact probes passed repository/child/ancestor/relative/junction rejection and accepted external paths. Markdown probes accepted existing/duplicate anchors and failed missing anchors/files. Impeccable detector returned `[]`; degraded in-thread finish review/documentation recorded separately. Native browser inventory is empty; native browser-chrome zoom is unverified (CSS 200% zoom and enlarged-text captures were inspected instead).

Four hosts were probed in fresh sessions; [results and exact follow-up](records/host-verification.md) distinguish native injection, discovery, manual reads and scenario limits. Claude returned organization API 403 before reads. Codex/Copilot/OpenCode returned all five traces; native loading provenance remains unverified in the first two. OpenCode's two follow-ups supplied the initial missing source/reference/workflow reads and corrected hypothetical authorization; its final UI trace overstated a conditional preview requirement, retained as a behavioral limitation. No adapter/settings changes were made. Remote CI has not run; no push authorized.

## Decisions

The user's supplied plan approves all versions in package.json and browser downloads. Manually scaffold App Router, React, strict TypeScript, npm and CSS Modules. Use existing combined SVG logo unchanged and the hero's approved description. Load Latin Roboto 400 only, the entry's sole text weight. Do not build navigation, hero composition, dashboard features, backend or authentication. Preserve references and local settings. Generated QA goes outside the repository; durable text is shareable when committed by the user. No staging, commits, pushes, deployment or capability configuration changes.

## Remaining work

No product implementation remains in this milestone. Adoption stays open for the host-owned follow-up above; its guide cannot retire yet. With a connected browser, inspect native browser-chrome 200% zoom; CSS zoom/reflow evidence is already recorded. The maintainer owns remote CI execution after a requested push and a separately approved ESLint upgrade review. Next product milestone is navigation and hero; the product owner must settle CTA destinations and affected reference conflicts before dependent work.
