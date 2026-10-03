# Plans

A `plan.md` is durable execution state when the work needs it. A plan presented in conversation is a reviewable artifact even if it has not been saved. Saving a plan is distinct from implementation authorization, which may already exist in the user's request.

[AGENTS.md](../AGENTS.md) routes here whenever work needs durable execution state. This document owns the file's structure, its lifecycle and the rules that keep its state truthful.

## Entry and record decision

Identify whether the user asked for an answer, review, investigation, plan, or implementation, and whether they asked to prepare, save, or both. Treat factual premises as claims to check. Ground the outcome, scope, authorization, provisional acceptance, assumptions, and unknowns. Classify work size independently of requested artifacts; file count alone does not determine size.

| Trigger                                                                    | Records and next action                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Light: one clear outcome and verification boundary, no expected handoff    | Ground in conversation and complete directly with relevant verification.                                                                                                                                                                                                     |
| Medium: bounded outcome needing material investigation or dependent stages | Give a short proposed approach, then continue authorized work unless a material user decision is unresolved. Record findings or execution state when the continuity test below warrants it.                                                                                  |
| Heavy: independent mechanisms, substantial risk, or likely resumption      | Present a detailed approach before dependent execution and review material choices. Record the findings or execution state needed for resumption, then update saved stages. A review-only task needs no execution plan. Split unrelated objectives into separate work items. |
| Request to prepare an investigation, at any size                           | Investigate and present the findings. Follow the requested stop boundary; investigation alone does not authorize implementation.                                                                                                                                             |
| Request to save an investigation, at any size                              | Investigate, save `investigation.md`, and report its path, conclusion, and blockers. Present the findings too if requested.                                                                                                                                                  |
| Explicit plan request or active Plan mode, at any size                     | Investigate, then present a decision-complete plan proportionate to the work whether or not the host entered Plan mode. A plan-only request stops without implementation.                                                                                                    |

A routine failed check and correction do not alone raise work size. Save findings when their evidence, limits, and decision effects would be costly to reconstruct. Save execution state when staged, risky, or resumable work needs a durable next action and verification history. These continuity tests apply at any size; neither file is required solely because the other exists. A record may contain or link the accessible prerequisites needed to resume. Honor an explicit request to save nothing. If writes are restricted, report needed state in the permitted artifact or conversation. Saved and conversational artifacts meet the same substantive standard; their detail follows the work's complexity.

## Record maintenance

Keep plans, compact execution notes, and investigations clean, complete, and concise around the current request, findings, and approach. When direction changes, rewrite all affected sections and reconcile linked records. Remove superseded decisions, obsolete alternatives, and conversational decision history. Preserve unaffected requirements, relevant evidence and its limits, actual verification failures and corrections, unresolved constraints, and current authorization status. Retain a rejected alternative only when its rationale still explains a current choice or constraint. Summarize material revisions in conversation; the record must be usable without reconstructing that conversation.

After a material record revision and before handoff, read the current investigation and plan together using only their linked prerequisites, without relying on the conversation. Confirm that they agree on scope, evidence and its limits, decisions, authorization, acceptance checks, current state, and next action. Reconcile missing or contradictory information before presenting or saving the revision or handing it off. Preserve actual verification failures and corrections while removing superseded conversational narration.

## Presenting, saving, and executing a plan

When the user requests a plan or enters Plan mode, investigate enough to support an approach. Check material tools and skills as [INVESTIGATIONS.md](INVESTIGATIONS.md) requires. Present the plan the first time, even if the user also asks to save it. Carry material findings and limits into the plan; do not display the full investigation record unless asked. A medium implementation request without an explicit plan request needs only a short approach summary unless a material choice needs review.

Before presenting or saving a plan for review or execution, check that it preserves the chosen approach, material dependencies and accessible prerequisites, unresolved decisions and the work they block, observable acceptance, applicable checks, and the current state and resume point. Another agent must be able to continue without inventing a material requirement, choosing an unsettled approach, or guessing how success is checked. If this test fails, investigate the factual gap, ask the user for the needed decision, or present the unresolved decision and its blocked work explicitly; do not call that plan ready for execution. This test applies to compact or detailed, conversational or saved plans, including plans made in Plan mode.

Use actual host Plan mode when it is active. If the host gives the agent a mode-switch capability, use it for requested planning. If the agent cannot switch modes, plan to the same level of detail in conversation and state that Plan mode was not activated; do not make a shallower fallback plan or claim a tool call occurred. Feature availability alone does not activate the mode.

### Corrections after a plan is presented

Treat each correction as a change to the last complete plan, not as a replacement plan containing only the latest change. Carry forward the original objective, unaffected stages, dependencies, constraints, acceptance, verification, authorization, and earlier accepted corrections. Identify which parts the new direction affects and whether it changes the objective or the reviewed approach. A different objective is an explicit rescope or separate work item, never an accidental shortening of the existing plan.

During feedback, respond with the interpreted change, its material effects, and the next action or one decision needed. Do not repost the full plan after each comment. Resolve an unsettled approach with focused discussion; investigate a new factual or capability gap before selecting it. Invite input when a preference could materially improve the plan; ask for an intent or tradeoff decision when evidence cannot settle it. Once the direction is settled, reconcile the complete plan with the original proposal, investigation, and all corrections. Present the full revised plan once for review when a material approach changed, or save the complete revision if the user asked to save it. For routine wording or detail corrections, give a concise change summary and incorporate them without another full proposal.

If a plan was already saved, update its complete current state under Record maintenance. Summarize the revision and point to the saved plan instead of printing it in full unless the user asks. Mark materially changed stages as proposed until reconfirmed for execution. If the prior complete plan is unavailable, recover it from the saved file, conversation, and investigation before revising; if material facts cannot be recovered, re-investigate them and identify any missing user decision. Never rebuild a plan from the latest correction alone.

After seeing a plan, the user may request revisions, ask to save it, or authorize execution. A later request to save writes the complete corrected plan and reports its path without reposting the full plan unless asked. A request to save is sufficient authorization to write `plan.md` when the host permits it; it does not authorize implementation. If Plan mode is read-only, present the plan there and save it once the user moves to a write-capable mode; a prior request to save remains valid. Do not require a second approval just to write the requested file. Before saving, compare the plan with the presented version, investigation, and user corrections; after saving, read it back to confirm no decision affecting implementation, authorization, or acceptance was lost. Mark a saved plan as proposed or approved according to what the user actually decided.

An implementation request authorizes its scoped edits and coupled verification; a plan-only or review-only request does not. If the user asks to execute a presented conversational plan, follow the authorization and host mode then in force without requiring a save first. Save current execution state when the continuity test calls for it, without claiming the earlier plan was already persisted. Reconfirm a material change to a reviewed approach before dependent execution; routine corrections continue.

Follow the host's actual write restrictions. Save requested or continuity-worthy records when writes permit; investigation evidence need not occupy the plan response. If only a designated planning artifact can be written, use it as the host permits. If all writes are prohibited, present sufficient evidence and the plan in conversation and identify unsaved needed records. When writes later become available, save from accessible evidence and re-investigate material facts that are no longer available. Neither Plan mode nor plan saving expands implementation authorization.

## Location

Use the layout below by default. [README.md](../README.md) may designate or link a different work-item record root or sharing policy; use that location consistently in all linked records.

```text
workspace/
└── <work-item>/
    ├── investigation.md
    ├── plan.md
    ├── records/              # optional substantial evidence or requested detailed handoffs
    └── preview/              # optional runnable browser preview and its resources
```

`<work-item>` is a short descriptive name for one work item. A plan does not span unrelated objectives.

When no project sharing policy exists, recommend making durable text records shareable through version control. Inspect actual tracking, privacy, and artifact policy before reporting that records are available to collaborators or a fresh agent. This recommendation grants no staging or committing permission.

Share permitted prerequisites needed for handoff, or reference where the intended agent can access them. Keep private data and machine-local artifacts outside shared records; do not put secrets in them. State any inaccessible prerequisite and the work it blocks.

Use one optional `records/` directory only for substantial evidence or explicitly requested detailed stage handoffs. Link each record from the relevant core file. When `plan.md` exists, it is the primary current-state and resume record.

Keep selected generated images and other task assets needed for resumption under `workspace/<work-item>/`, or the record location designated through README. Copy selected assets out of provider-managed output when necessary. Resources required to run a preview belong within its `preview/` bundle. Follow the project's evidence and artifact policy; link relevant permitted evidence from the record.

Use `preview/` only when an interactive browser preview is needed. [FRONTEND_CREATION.md](FRONTEND_CREATION.md#preview-when-direction-remains-open) owns when to create and present it. Keep its runnable entry page and required resources together; link the entry page or build instructions from the relevant saved record when resumption depends on it.

## Structure

For light or medium work with a saved plan, keep `plan.md` compact: Current state (outcome, last verified result, next action), Decisions (including material constraints), Checks (required checks and actual results or blockers), and Remaining work. Compact changes length, not completeness: retain the chosen approach, material prerequisites and dependencies, observable acceptance, applicable checks, and any unresolved decision with the work it blocks. Update these at meaningful boundaries and after failures. Expand to the detailed structure when independent stages, substantial risk, or resumption complexity make the work heavy.

A detailed plan has six sections always present, even when empty: they are the resume point, and a missing one reads as an oversight. The other four are appended when they acquire content — an empty Discoveries heading records nothing and costs attention.

| Section             | Presence                               | What belongs in it                                                                                                                                                                 |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Objective           | Always                                 | What done looks like, in the user's terms. One paragraph. Unchanged for the life of the plan — if it changes, the work changed and the plan is re-scoped deliberately.             |
| Current state       | Always                                 | Whether the approach is proposed, approved, or executing; the last verified result, current stage, and immediate next action or blocker. The first thing a resuming session reads. |
| Stages / milestones | Always                                 | Ordered units of work, each with one observable outcome at one verification boundary. Split a stage when mechanisms, checks, rollback decisions, or owners are independent.        |
| Progress            | Always                                 | Per stage: not started, in progress, blocked, or complete — with what makes it so.                                                                                                 |
| Validation criteria | Always                                 | Observable acceptance conditions for each stage and the applicable [CODE.md](CODE.md) Verification checks, chosen before the stage runs.                                           |
| Validation results  | Always                                 | What actually ran and what it said. Commands and their outcomes, artifacts inspected, checks that could not run and why. Empty until the first stage is verified.                  |
| Important context   | When it has content                    | Owners, contracts, constraints and prerequisites the work depends on, carried from `investigation.md`.                                                                             |
| Discoveries         | When it has content                    | What execution revealed that grounding did not: a contract that differed, a consumer nobody traced, a check that cannot run here.                                                  |
| Decisions           | When it has content                    | Current choices and their rationale. Include rejected alternatives only when they explain a current choice or constraint. A current decision is not reopened without a reason.     |
| Remaining work      | When it has content, and at completion | Everything not yet done, including work deliberately deferred and who deferred it. At completion it is present and either empty or stating what is deliberately out of scope.      |

## Lifecycle

| When                         | What happens to the plan                                                                                                                                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| It is saved                  | Objective, Current state, Stages, Progress, Validation criteria, and the selected approach in Decisions are written. Include Important context when it affects execution. State whether the approach is proposed or approved and what implementation was authorized; a save-only plan has no execution results. |
| While building               | Progress and Current state updated at each meaningful stage boundary; heavy work updates every stage. Discoveries appended as they occur, not reconstructed afterwards.                                                                                                                                         |
| At verification              | Validation results written from what actually ran. A stage moves to complete only here.                                                                                                                                                                                                                         |
| After a failure              | The failure is recorded in Validation results, not overwritten. Progress returns the stage to in progress.                                                                                                                                                                                                      |
| A finding becomes a standard | Move the settled decision into its actual owning project document, routed through README, PRODUCT, DESIGN, or CODE as appropriate. The plan then points at it rather than holding a second copy.                                                                                                                |
| At completion                | Remaining work is empty, or its contents are stated to the user as deliberately out of scope.                                                                                                                                                                                                                   |
| On resumption                | Read Current state, Progress, remaining work, and linked evidence. Check relevant source changes and accessible prerequisites before relying on prior findings or results. Record material drift, re-investigate stale facts, and reconfirm a material approach change before continuing authorized work.       |

## Execution, stops, and handoff

The workflow proceeds through Request, Grounding, Investigation, Planning when required, Execution when authorized, Review, Final verification, and Handoff. Report meaningful phase and stage boundaries for substantial work; keep light work concise. Continue unless a requested stop or required decision blocks progress.

Questions and discussion can occur at any phase, including during investigation, planning, execution, and review. When a material capability or decision is missing, explain its effect and offer feasible options. Ask a focused question when the user's answer could materially improve the outcome, even if the agent could choose a plausible default. Gather input before settling matters that depend on the user's judgment, and ask follow-up questions when answers expose further material choices. Explain the relevant evidence, options, and consequence without making the user review every routine choice. State whether an answer is invited or required. Continue independent authorized work while an answer is pending; wait before dependent work when the answer is required. Incorporate the response into the current findings, plan, or execution state without treating a question as a new authorization gate.

- Execute authorized stages and verify each relevant outcome. In a detailed plan, preserve failed checks and corrections in Validation results; do not mark a stage complete until its criteria are met. In a compact note, retain failures and corrections in Checks. Routine repairs stay within the reviewed approach. Reconfirm a material change to that approach before dependent execution.
- Review the complete change against the request, applicable authorities, tests, and diff. Correct findings. Final verification runs the checks required for the complete changed mechanism after corrections, under [CODE.md](CODE.md) Verification. Record actual results and unresolved limits.
- A requested stop after a named stage or after every stage takes effect once that stage's result and resume point are recorded. If the user says to stop immediately, end implementation immediately; when permitted, record the last verified state, unfinished work, and next action, then hand off. Do not perform further implementation to make the record look complete.
- At an implementation handoff, describe the changes actually made and state unfinished verification separately. If README or its linked engineering owner requires a proposed commit message, provide one for commit-eligible changes. Leave changes uncommitted unless staging or committing was requested.

## Relationships

- `investigation.md` supplies Important context and feeds Discoveries. [INVESTIGATIONS.md](INVESTIGATIONS.md) owns its method and shape.
- [CODE.md](CODE.md) under Verification supplies Validation criteria; the plan selects from it, never softens it.
- A designated planning artifact is planning scaffolding. Once the work-item `plan.md` exists at the designated record root, it is the primary durable execution record. Update `investigation.md` for material grounding or availability corrections and link any optional detailed records from the relevant core file.
- Workspace records contain or reference accessible prerequisites required for resumption. Memory may supplement them but does not replace them; when it is unavailable, resume from the record and re-check current source and prerequisites.
