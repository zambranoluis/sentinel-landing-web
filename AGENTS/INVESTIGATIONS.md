# Investigations

This document owns how a task is grounded and what counts as evidence. [AGENTS.md](../AGENTS.md) owns authorization; investigation identifies the work within that boundary. [README.md](../README.md) supplies the project map, operational sources, and verification lanes once reconciled.

## Sufficiency test

Start with the current user request and material corrections. Distinguish intent from factual premises. Establish outcome, scope, authorization, provisional acceptance, assumptions, unknowns, and work size independently of requested artifacts. Read only sources that can affect the outcome.

1. **Owner:** Identify the layer and module that own each affected decision or behavior. If the project map is unconfigured, inspect the source and record the owner before proposing an architecture.
2. **Contract:** Identify applicable local and upstream interfaces, statuses, fields, codes, state transitions, lifecycle, validation, accessibility, and security boundaries. Do not infer a contract from a route or control name.
3. **Dependencies:** Trace producers, consumers, types, tests, and upstream legs far enough to establish the proposed change's effect. State justified inapplicability instead of exploring unrelated systems.
4. **Requirements:** Find product requirements through [PRODUCT.md](../PRODUCT.md), applicable design requirements through [DESIGN.md](../DESIGN.md), operational sources through [README.md](../README.md), and engineering decisions and contracts through [CODE.md](CODE.md). Follow their links to detailed owners. A missing source is an open fact or decision, not proof that there is no requirement.
5. **Verification:** Identify [CODE.md](CODE.md) obligations, project commands, required services, and evidence restrictions. Check whether the relevant lane can run now.
6. **Capabilities:** Check material tools, skills, permissions, and host modes. Distinguish documented support from actual access. Use a capable available equivalent where appropriate; if a missing capability changes the result, explain the limit and feasible choices.

Before settling an approach, resolve material factual gaps with evidence. Ask the user about unresolved intent, preferences, or tradeoffs when the answer could materially change the result. An invited answer does not suspend independent work; a required decision blocks only work that depends on it.

For a change to existing observable UI, obtain a focused before-state before editing when a relevant lane can run. Use the project's narrowest suitable browser or runtime method; record observed behavior, failures, and evidence limits. A failed before check may be an environment blocker, stale assertion, existing defect, or unrelated failure. It is not itself the intended product contract.

When a relevant lane cannot run, use a suitable available equivalent or identify the remaining verification. A missing test setup does not automatically require Playwright installation. If missing observations are necessary to settle correctness, current behavior, or material direction, pause dependent work and identify the observation needed; continue independent authorized work. When requirements and the approach are sufficiently grounded without those observations, scoped work may continue with explicit evidence limits. A required completion check remains unverified until satisfied; proceeding with implementation does not make affected acceptance complete. Do not present static inspection as browser proof.

## Evidence and boundaries

- Read implementation and owning documents rather than infer behavior from filenames, dependencies, old plans, or visible controls. Prefer the narrowest source that answers the question.
- Implementation establishes observed behavior, not automatically the intended contract or approved requirements. Retain supported conventions, identify known debt and inconsistencies, and resolve material disagreement between documents, source, and tests with the responsible owner before dependent changes. Identify which owner must settle an undefined required distinction. Do not legitimize debt as a requirement or require unrelated remediation.
- Distinguish user intent, documented behavior, direct observation, inference, and unknowns. Give the evidence and its limit for every material finding.
- A successful command supports only what it checks. A mock, screenshot, static analysis result, or browser probe has a specific scope; do not extend it to live integration or unobserved states.
- Other repositories and services are conditional sources. Their absence blocks only work needing that leg. Reading them does not authorize modifying them.
- Correct provisional grounding when evidence or user direction changes it. Explain material scope or acceptance effects and reconcile saved records.
- If a request cannot be satisfied as stated, report the contradiction with evidence, supported alternatives, and the decision or blocker. Do not fabricate a success path.

## Recording and stopping

[PLANS.md](PLANS.md) decides when a durable investigation is useful and where it lives. A saved investigation records current request and boundaries; grounding and provisional assumptions; material findings with sources, limits, and decision effects; corrections; and open questions with their owner and blocked work. Keep it concise enough to resume without the conversation. An investigation may recommend an evidence-supported direction but does not itself authorize implementation.

Continue past non-material unknowns. Investigate material factual gaps; ask for a user decision when intent or a tradeoff determines the approach. Continue independent authorized work while awaiting an answer. Do not execute dependent work on an invented answer.
