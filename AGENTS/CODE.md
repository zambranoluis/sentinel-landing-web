# Code and verification standard

This document owns engineering principles, starting preferences, project engineering guidance, contract integrity, verification requirements, and ownership of known deviations and debt. [README.md](../README.md) identifies the selected stack, locations, commands, and prerequisites; [PRODUCT.md](../PRODUCT.md) and [DESIGN.md](../DESIGN.md) route product and applicable design requirements. Apply only sections relevant to the changed mechanism. A new project's structure is selected from its requirements; an existing project's structure is established from its source before it is changed.

## Starting preferences

Choose conventions per concern: follow explicit direction and applicable requirements, then verified established conventions, then compatible defaults where that concern has no convention. These defaults apply in both new and existing projects; a missing test setup does not authorize changing the application language or styling stack.

For compatible web work without a relevant convention, prefer TypeScript for application code, plain CSS Modules for component styles, Vitest for unit tests, and Playwright Test for browser journeys. Keep global CSS for shared foundations such as tokens, resets, and base typography. These preferences guide a choice; they do not assert that a package, runner, or browser lane is installed. Choose a justified compatible alternative when a preference conflicts with the actual project requirements or established stack. Record the selected stack in [README.md](../README.md) and the decision and rationale here or in a linked engineering owner.

In an existing project, preserve its established language, styling system, and test stack unless the user requests a migration. Apply the rest of this document to the actual stack. Every new package, including preferred test packages, follows the dependency approval rule below.

## Project engineering guidance

The user-approved plan selects Next.js App Router, React, strict TypeScript, npm and CSS Modules. Manual setup preserves agent files and avoids unapproved Tailwind/generator additions. `src/app` owns routes and document composition; global CSS owns tokens/reset/typography; CSS Modules own local styles. Prefer server components and small client boundaries when needed. No client boundary, domain state, API, session, upstream service or persistence is authored in this entry. Assessment contracts remain with the product owner in [PRODUCT.md](../PRODUCT.md#public-landing-scope).

The supplied plan explicitly approves these exact dependencies; package.json and package-lock.json are executable authorities:

| Purpose               | Approved versions                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Runtime/fonts         | `next@16.3.8`, `react@19.3.0`, `react-dom@19.3.0`, `@fontsource/roboto@5.3.0`                        |
| Types                 | `typescript@5.9.3`, `@types/node@22.14.0`, `@types/react@19.3.0`, `@types/react-dom@19.3.0`          |
| Quality               | `eslint@9.39.5`, `eslint-config-next@16.3.8`, `prettier@3.9.9`                                       |
| Browser/accessibility | `@playwright/test@1.63.0`, `@axe-core/playwright@4.13.0`; matching Chromium/Firefox/WebKit downloads |

Do not force peer resolution. Propose Vitest separately when meaningful logic needs unit tests. Evaluate performance and motion/media packages with a substantial visual slice or actual video requirement. Type checking generates Next.js route/environment declarations before TypeScript. `agentRules: false` in the Next.js configuration prevents development startup from changing the repository's established instruction owners.

Required gates are [README commands](../README.md#commands-and-verification): install, lint, types, format, local Markdown links/anchors, production build, real browser discovery, three-engine production tests, manual presentation/accessibility review and dependency audit. CI mirrors local gates; no remote execution is claimed before a requested push. Public browser evidence cannot prove authenticated/dashboard behavior. Generated QA remains external; artifact validation rejects repository targets, ancestors and redirects. No coverage percentage, structural analyzer or debt baseline is configured.

### Debt and coverage ownership

- The approved ESLint 9.39.5 emits a registry deprecation warning for unsupported status. The maintainer owns a separately approved upgrade and compatibility review; the installed version remains pinned as requested. The current npm audit reports zero vulnerabilities.

- The repository maintainer owns dependency advisory review, affected paths, mitigations and separately approved updates. Record audit results in the active work item; do not hide failures or upgrade outside approval.
- The product owner owns assessment destinations and submission/privacy contracts before dependent work.
- The design owner resolves affected visual conflicts; later motion/performance behavior is outside foundation coverage.
- The maintainer owns first remote CI execution after a requested push; local checks do not establish Linux/remote success.

## Ownership

- Identify the layer that owns each domain decision, validation rule, transport adaptation, persistence operation, interface state, and security check. Keep a decision in its owner; do not reproduce it in another layer because that layer receives data first.
- Identify the module that owns a behavior and its public consumers. Keep cohesive behavior together. Use established public surfaces for cross-module access; do not reach through another module's internals merely because the path exists.
- Promote code to a shared location when it has a real second consumer or a genuinely domain-neutral responsibility. Anticipated reuse alone does not justify promotion. Avoid reorganizing unrelated code during a functional change.
- In an existing codebase, follow its established placement until a scoped architecture change is authorized. In a new codebase, record the chosen layer and module map here or in its linked owner once the framework and product needs are known; README routes the actual locations. Do not treat a suggested directory tree as an architectural decision.

## Naming, size, and dependencies

- Give modules, functions, types, and components coherent responsibilities and names that describe their domain or behavior. Avoid misleading temporary names and unnecessary parallel files with identical basenames.
- Prefer existing project and platform capabilities before adding an abstraction. Add one when it materially improves responsibility isolation, reuse, testability, or control of complexity; do not add speculative extensibility.
- Review a file that is hard to understand or change for mixed responsibilities. For applicable code, 400 lines for a component, hook, or service module, 80 lines for a function, and cyclomatic complexity 15 are suggested review triggers. Crossing one prompts a responsibility review, not an automatic block or a claim that an analyzer is configured. Record project-specific thresholds only with a meaningful analyzer and debt policy.
- For every new package, including a preferred test package, propose the package and its purpose and obtain separate user approval before adding or installing it, unless the user explicitly requested that package or already approved it. Continue independent work while approval is pending; do not start dependent work. Add it only when its verified benefit justifies integration and maintenance cost.
- Keep comments about intent, constraints, and non-obvious decisions current. Remove dead code, stale comments, unused imports, and unreachable branches within the scoped change.

## Change integrity

- Preserve behavior and compatible public contracts that the task does not require changing. Trace affected callers, consumers, tests, types, and dependent mechanisms before changing shared behavior.
- Make coupled changes needed for the authorized outcome. Remove artifacts made obsolete by that change. Update owning documentation and examples that the change makes inaccurate.
- Do not substitute a placeholder, hardcoded stand-in, fabricated state, or a test shaped to pass an incomplete implementation. Identify the missing contract or capability instead.
- Keep credentials, tokens, private keys, authentication state, and unnecessary personal data out of code, logs, screenshots, artifacts, and client bundles.

## State and interface code

Apply this section when the project has a user-facing interface.

- Keep presentation responsibilities separate from data access and non-trivial transitions. Keep application contracts out of domain-neutral primitives.
- Prefer local state. Share an authoritative value when multiple consumers require it. Derive reliable values instead of synchronizing duplicate state; do not perform side effects during rendering.
- In React code, use effects to synchronize with an external system or represent an independent asynchronous transition, not to copy state derivable from props or existing state. Avoid unnecessary effects, global state, rerenders, and memoization.
- Match the actual framework's server/client lifecycle. Keep server-only code and protected configuration out of client bundles. Avoid hydration differences or replacing the primary content tree unexpectedly after hydration.
- Where the framework supports server-rendered components, keep browser-interactive boundaries as narrow as practical. Do not access browser APIs during server rendering.
- Represent reachable loading, empty, success, partial, stale, and failure states according to the project's product contract. Use empty only after absence is established. Preserve usable content during background refresh, keep unaffected regions usable, and preserve safe user input after recoverable failures.
- Use the project's chosen styling system and design tokens. Keep layout responsive to content and viewport. Preserve semantic controls, accessible names, validation associations, visible focus, keyboard/touch access, logical focus order, and meaning beyond colour.
- Treat motion as behavior when it affects the interface. Specify entry, exit, repositioning, interruption, focus, responsive behavior, and reduced motion where relevant. Choose the simplest implementation that meets those needs; do not migrate existing motion merely to standardize on an engine. Timers should not stand in for completion events unless elapsed time is the product behavior or a bounded recovery fallback.
- Prefer CSS transitions and keyframes for simple local motion. When coordination needs a JavaScript engine, compare suitable existing options against interruption, lifecycle, and integration needs. Adding an engine requires package approval. Advance coordinated stages from responsible events; prefer `transform` and `opacity` when they meet the interaction's needs.

## Data, contracts, and failures

- Treat external input as untrusted at the boundary that relies on it. Validate the shape, type, range, format, and owned semantic constraints needed for correctness. Do not claim validation or authorization at a boundary that cannot enforce it.
- Consume established statuses, fields, codes, and payload shapes. Keep distinctions machine-readable where consumers need deterministic behavior; do not derive control flow from display text. An undefined required distinction is a dependency for its contract owner to resolve.
- When a contract is not separately documented, inspect the producing boundary, types, affected consumers, and authoritative upstream source. Resolve material disagreement before changing dependent behavior.
- Handle expected failure where its meaning is owned, and propagate it in the receiving boundary's contract. Convert unexpected failure to controlled behavior at the responsible boundary. Do not present failure as success or confirmed absence.
- Expose only safe messages and details on public surfaces. Do not expose raw exceptions, internal URLs, stack traces, provider diagnostics, or upstream error bodies. Preserve security-sensitive indistinguishability when revealing existence would violate the actual security contract.

## Trusted and upstream boundaries

Apply this section where the project has server code, external services, or protected operations.

- Enforce authentication and authorization at the trusted boundary that owns the operation. A route, resource identifier, or client check is not authorization. Preserve the established session lifecycle and ownership checks.
- Keep credentials, internal service locations, and protected configuration off public surfaces. Log minimal operational context through trusted diagnostics; do not log secrets or complete sensitive requests and responses.
- Validate expected upstream status, content type, and required shape before use. Handle timeout, connection failure, malformed data, and empty required responses as controlled outcomes.
- User-facing upstream calls must have explicit, bounded timeout or deadline behavior. Prefer the established project mechanism; when missing, establish a compatible mechanism within the authorized integration work. Set durations from project requirements and record the policy here or in its linked engineering owner.
- Bound retries for idempotent operations. Do not retry a non-idempotent operation without an established idempotency mechanism. Propagate cancellation when work is no longer needed.
- Do not return partial or stale data as current complete data, or claim success while a required side effect remains unverified.
- Use the project's actual response contracts. Do not impose a universal envelope or status mapping on routes that already have different valid shapes.

## Testing methodology

- Select tests by the changed responsibility: unit tests for deterministic decisions, validation, mapping, and state transitions; contract or integration tests for affected boundaries; browser tests for user journeys, interactions, responsiveness, and focus.
- Before extending tests, inspect existing runners, discovery configuration, fixtures, and relevant coverage. Verify that the selected command discovers and exercises the intended tests. Dependency presence or an unrelated passing suite does not establish relevant coverage.
- Preserve established test locations. For compatible web projects without a location convention, prefer `tests/unit` and `tests/browser`. Add other locations only for actual boundary needs; no mandatory directory tree applies.
- Distinguish controlled consumer evidence from live integration. Identify each applicable lane's prerequisites, fixture boundaries, permitted side effects, and evidence restrictions through README or its linked owners. Controlled fixtures must prevent unintended external writes; a controlled pass does not prove live persistence.
- Ground assertions in intended observable behavior. Wait for state or readiness rather than fixed sleeps, and avoid repeating browser-free tests across device projects.
- Add regression coverage when it can meaningfully catch the changed behavior. Retain temporary probes only when their final assertions establish the intended contract; otherwise preserve the observation in the work-item evidence and remove the probe.
- Keep coverage gaps discoverable through an existing coverage owner or the work-item record. Require neither blanket coverage percentages nor a new coverage document.
- Focused tests supplement required project gates. Broaden behavioral coverage only for failures, affected shared dependencies, or unresolved material risk.

## Verification

Complete the authorized change before final verification. For every change, review the scoped diff and relevant references, check documentation claims against their owners, and run the available whitespace or formatting check. Use [README.md](../README.md) for exact commands and prerequisites and this document or its linked owners for required gates; do not invent npm, Maven, Playwright, quality, or link-check commands.

| Changed mechanism                              | Evidence to obtain                                                                                                                                                     |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation or instructions                  | Read the final chain as a fresh agent would; check links, factual claims, contradictions, and formatting.                                                              |
| Code behavior                                  | Run the applicable formatter/linter, type or compile check, build when needed, and focused behavior tests.                                                             |
| Shared contract or integration                 | Test producer, consumer, and affected boundary; distinguish controlled test doubles from live integration.                                                             |
| UI behavior or presentation                    | Compare before and after when a runnable relevant lane exists; test interaction, responsive behavior, focus, and visual states using the project's permitted evidence. |
| Motion                                         | Observe intermediate and final states with animation enabled; check interruption and reduced motion where relevant.                                                    |
| Packaging, migration, or runtime configuration | Exercise the changed deployment or runtime mechanism.                                                                                                                  |

Apply the testing methodology above and the browser-evidence fallback in [INVESTIGATIONS.md](INVESTIGATIONS.md#sufficiency-test). Missing observations needed to settle correctness, current behavior, or material direction block dependent work; sufficiently grounded scoped work may continue with explicit evidence limits. A screenshot proves only the captured state; a mock does not prove live persistence. Static checks do not establish runtime, visual, hydration, or focus correctness. An unavailable required completion check remains unverified and must be reported with its blocker and exact remaining work; proceeding with implementation does not make affected acceptance complete.

For structural code work, inspect affected boundaries, cycles, dead code, and styling conventions with available project methods. Record known deviations and their owners so a scoped change does not silently expand them. If the project has a structural analyzer or debt baseline, use its documented command and rules: new violations of a baselined rule should fail, known violations should be reduced when the authorized change permits, and a verified reduction should lower the baseline in the same change. A passing ratchet proves only that configured violation counts stayed within its limit, not overall correctness. Do not raise a baseline to hide a regression. Do not claim this gate exists until the project has configured and verified it.

Re-run checks affected by a correction. Distinguish change-caused failures from directly verified pre-existing failures. Report what ran, what passed or failed, and what remains unverified; do not treat a failed or untested path as complete.
