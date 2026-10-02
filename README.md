# Project overview

Status: unconfigured starter. Keep this neutral source unconfigured. In an adopted project, preserve existing README content and reconcile these prompts incrementally with verified facts and decisions already authorized within scope. Link established detailed owners instead of copying their rules. Mark unresolved material items as unknown with an owner and the work they block; remove inapplicable prompts. Documentation maintenance does not approve a migration, dependency, or new product decision; explicit read-only requests prohibit these writes.

## Overview and runtime

Record the project name, root, brief purpose, supported runtime, environments, and stack actually selected. Route users, behavior, and promises through [PRODUCT.md](PRODUCT.md). Link [CODE.md](AGENTS/CODE.md#project-engineering-guidance) or its detailed owners for engineering decisions, compatible alternatives, and rationale; a starting preference is not an approved stack or package.

## Setup and prerequisites

Record verified setup steps, prerequisites, service dependencies, and environment/configuration locations. Explain where an intended agent can access permitted prerequisites without exposing secrets. Identify unavailable prerequisites and the work they block.

## Locations and boundaries

Record the actual module/package map, layer owners, public import surfaces, generated-code boundaries, and other repositories or services with their edit permissions. Link detailed architecture and contracts through CODE. Record test locations, evidence and artifact roots, and private-data boundaries without disclosing protected data. A sibling source is conditional; its absence blocks only work needing it.

## Commands and verification

Record only verified commands or methods: purpose, scope, executable prerequisites, applicable evidence lane, and availability. Include applicable formatting/diff hygiene; lint, types/compile, build, structural analysis; documentation links and source claims; unit, contract, integration, browser, accessibility, and visual checks.

For test commands, record the runner, discovery configuration, intended tests, and evidence that the command discovers and exercises them. Identify required runtime services and authenticated lanes; for each applicable lane, record fixture boundaries, permitted side effects, and evidence restrictions. Make coverage gaps discoverable through an existing coverage owner or work-item record under [CODE's testing methodology](AGENTS/CODE.md#testing-methodology).

Link engineering gates and any baseline/debt owner through CODE. An incomplete application may support only a subset; mark unavailable required checks with blockers and exact remaining work, never as passes.

## Documentation map

- [PRODUCT.md](PRODUCT.md): users, purpose, journeys, capabilities, scope, operating constraints, terminology, evidence, and confirmed brand commitments; may be an entry to existing detailed owners. Install it in every adoption. When it is missing, offer to create it using an available Impeccable `init` workflow; keep unknowns explicit if product direction is not yet settled.
- [DESIGN.md](DESIGN.md): design direction, tokens, layout, components, states, accessibility, and motion where applicable; may be an entry to existing detailed owners. Install it in every adoption. When it is missing, offer to create it using an available Impeccable `document` workflow; keep unknowns explicit if design direction is not yet settled.
- [AGENTS.md](AGENTS.md): working agreement and decision routing.
- [CODE.md](AGENTS/CODE.md): engineering guidance, contracts, verification requirements, deviations, and debt owners.
- [INVESTIGATIONS.md](AGENTS/INVESTIGATIONS.md): grounding and evidence.
- [FRONTEND_CREATION.md](AGENTS/FRONTEND_CREATION.md): conditional frontend direction, skills and examples, and preview process; installed in every adoption and read when its trigger applies.
- [PLANS.md](AGENTS/PLANS.md): work-item records, stops, and resumption.

Add links only to documents that exist. Record the established language/style convention when actually chosen and route other operational sources to their owners.

## Records, sharing, and artifacts

Record the work-item record root and actual tracking, sharing, privacy, evidence, and artifact policies or link their owners. Follow [PLANS.md](AGENTS/PLANS.md#location) when no different location has been designated; recommend shared durable text records where policy is absent without claiming they are already accessible. Identify machine-local or inaccessible prerequisites and the work they block. Tool-specific workflows and host configuration stay with their actual owner.
