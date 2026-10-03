# Working agreement

This is the entry point for work in Sentinel's landing repository. It sets the work boundary and routes decisions to their owners. Read only the routed material relevant to the request. A link is a reading instruction, not proof that a host automatically loaded the linked file.

Project context starts in [README.md](README.md), [PRODUCT.md](PRODUCT.md), and [DESIGN.md](DESIGN.md), with engineering guidance in [CODE.md](AGENTS/CODE.md) and its linked owners. Maintain verified project facts and authorized decisions incrementally within the task's write boundary. Keep unresolved items explicit with their owners and the work they block.

## How work proceeds

- Identify whether the request is an answer, review, investigation, plan, or implementation. Ground its outcome and authorization, then use [PLANS.md](AGENTS/PLANS.md) for proportional records and stops.
- Treat factual premises in the request as claims to check. Find the owner, contract, affected consumers, requirements, and applicable verification before acting on a material assumption. [INVESTIGATIONS.md](AGENTS/INVESTIGATIONS.md) owns the method.
- For new interfaces, redesigns, meaningful visual or interaction extensions, or an explicit request for the process or Impeccable, read [FRONTEND_CREATION.md](AGENTS/FRONTEND_CREATION.md). Narrow corrections with settled direction use only relevant guidance unless the process or Impeccable is explicitly invoked.
- Invite input when a material preference or decision is open. Continue independent authorized work while an answer is pending; do not invent an answer for dependent work.
- Make the scoped change and coupled edits needed for correctness. Preserve unrelated work. Update any owning documentation made inaccurate by the change.
- Verify the changed mechanism using [CODE.md](AGENTS/CODE.md) and the commands and prerequisites in [README.md](README.md). Correct findings and repeat affected checks. Report actual results and limits.

## Routing

| Decision                                                                                                               | Owner                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Project overview, runtime and selected stack, setup, locations, boundaries, commands, and documentation map            | [README.md](README.md), which links detailed operational and engineering owners                                           |
| Users, purpose, journeys, capabilities, scope, operating constraints, terminology, and confirmed brand commitments     | [PRODUCT.md](PRODUCT.md), which may route to established product owners                                                   |
| Design direction, tokens, layout, components, states, accessibility, and motion requirements                           | [DESIGN.md](DESIGN.md), which may route to established design owners; consult its requirements when design concerns apply |
| Investigation, evidence, and unresolved facts                                                                          | [AGENTS/INVESTIGATIONS.md](AGENTS/INVESTIGATIONS.md)                                                                      |
| Frontend creation direction, skills and examples, and conditional previews                                             | [AGENTS/FRONTEND_CREATION.md](AGENTS/FRONTEND_CREATION.md) when its trigger applies                                       |
| Plans, durable state, stops, and resumption                                                                            | [AGENTS/PLANS.md](AGENTS/PLANS.md)                                                                                        |
| Engineering principles, project decisions and contracts, integrity, verification, known deviations, and debt ownership | [AGENTS/CODE.md](AGENTS/CODE.md) and its linked owners                                                                    |

## Authority and scope

- An implementation request authorizes its scoped edits, coupled documentation, and verification. A review or plan request does not authorize product edits. Saving a requested plan authorizes that record, not implementation.
- Do not change this base instruction system during unrelated work. A request specifically to revise it authorizes that revision.
- Authorized implementation includes recording verified project facts and decisions already authorized within scope in their owning documents. Documentation maintenance does not authorize a migration, dependency, or new product decision that has not been approved. An explicit read-only request prohibits these writes too. Implementation observations alone do not establish approved requirements.
- Reading another repository or service does not authorize editing it. Establish its owner and obtain explicit authorization before crossing a project boundary.
- Do not stage, commit, push, deploy, publish, or change access or multi-agent settings unless requested.
- Preserve unrelated user changes, user-managed processes, and existing artifacts. Reuse compatible services where practical; track and clean up only resources this work created.
- System, platform, and explicit user instructions govern over these repository instructions. Project documents refine this standard only within their stated scope; prose links do not create host instruction priority or broaden authorization.

## Tools and reporting

- At task entry, check material tools, skills and permissions for the active host and requested work. Recommend a capability when it would materially improve the result; verify actual access before depending on it and follow the installed skill's current instructions. An unavailable optional capability does not block work that available methods can complete. Provider compatibility is a documentation/loading concern; ordinary tasks do not require execution by every intended provider. [README](README.md#agent-host-operations) owns host mechanics and loading diagnosis.
- For instruction-system evaluation or revision, use instructions-maker when available. Keep provider-specific launchers, hooks, adapters, and loading checks with the host or project that owns them.
- Report what changed, which evidence and checks support it, what failed or could not run, and the exact remaining verification. Never simulate an outcome.
- Communicate in the user's language. Follow the project's established language and style for code and documentation; record a project-wide convention in README or its linked owner only when it is actually chosen.
