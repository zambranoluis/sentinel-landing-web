# Product

<!-- impeccable:product-schema 1 -->

## Public landing scope

This repository implements Sentinel's public, English-language commercial landing site. Its primary audience is the purchase and evaluation audience described below: people responsible for security, operations, infrastructure, technology and procurement who need to understand suitability before requesting an assessment. Dashboard descriptions below are supplied product context, not implemented or independently verified dashboard features in this repository.

The approved direction consists of [page copy](references/web-content.md) and ten section references in `references/sections/`: hero, how it works, capabilities, product demo, deployment, benefits, plans, FAQs, final CTA and footer. These establish direction, not deployed functionality or performance/legal claims.

The intended journey is: understand the offer, assess operational fit and deployment conditions, then request a site assessment. The implemented scope is the navbar, warehouse hero, How it works section and footer, preserving the supplied labels, headline, description, brand/contact information and legal notice. The hero's detection outlines are static decorative artwork without a caption; they are not operational evidence.

Home and How it works (`/#how-it-works`) are implemented destinations. The section preserves the supplied headline, paragraph and Observe, Interpret, Flag, Review, Respond workflow. Its cube is a decorative explanation, not live operational evidence. Other navbar and footer labels remain noninteractive until their destinations exist and are approved. No assessment destination or submission has been specified. Assessment buttons remain disabled without an availability message. The supplied telephone information remains text; no unspecified telephone, WhatsApp, company or legal destination is invented. The product owner must settle CTA destinations, contact/submission ownership and required privacy terms before activating dependent links, CTAs or forms. The remaining landing sections, dashboard capabilities and legal pages are outside the implemented scope.

The standalone public foundation needs no backend or authentication. It introduces no dashboard routes, operational data, analytics, cookies, pricing, customer evidence or capability claims. Later demonstrations must distinguish illustrative data from real operational evidence.

## Users

**Primary operational users.** Sentinel is designed for professional and organisational environments in which continuous visual information has operational value. Its day-to-day users are people who need to monitor, review, prioritise and act on information quickly and with clear context.

This currently includes:

- **Security managers and operators** at client organisations, who monitor detections and reports, review people-flow information, work with notifications and use DVR views during live operations.
- **Establishment owners and administrators**, particularly in small and mid-sized organisations, who manage establishments, camera address aliases, notification preferences and account settings.
- **Sentinel team staff**, who support clients, run demonstrations and validate deployments, including controlled manual test events where required.

**Purchase and evaluation audience.** Decision-makers and stakeholders responsible for security, operations, infrastructure, technology acquisition, digital transformation, risk, administration and procurement are central to the commercial relationship even when they are not daily dashboard users. Relevant roles include senior leadership, heads of security, operations managers, loss-prevention managers, IT leadership, procurement and infrastructure or transformation leaders.

**Market context.** Sentinel is a B2B and institutional solution. It is intended for companies, institutions, retailers, commercial establishments, organisations with security or control requirements, high-footfall operations and environments where supervision, evidence and operational visibility matter.

Sentinel must not imply that enterprise sophistication requires enterprise scale. It can support needs ranging from a single establishment or small retailer to multi-site and large-network deployments when the operating need and infrastructure are appropriate.

**Not the priority audience.** Sentinel is not positioned as a domestic alarm product, consumer application or generic self-service camera tool.

## Product Purpose

Sentinel is a computer vision and operational intelligence platform developed by CrimsonTide AI in Jamaica. It can be deployed on compatible existing camera infrastructure or on infrastructure designed or supplemented specifically for the project.

Its strategic purpose is to help organisations make better use of the visual information already present in their environments. Sentinel turns continuous visual input into information that can be interpreted, prioritised and acted upon.

The central problem is not simply theft, intrusion, falls, weapons or any single event category. Organisations can generate more visual information than a person can continuously observe and interpret. Important situations compete with large volumes of normal activity, post-event review takes time, and human attention cannot be present on every feed at once.

Sentinel addresses this by observing configured environments, applying computer vision models, identifying defined events, organising relevant evidence and directing human attention to situations that require review or response.

The intelligence does not replace the person. It helps people use attention more effectively.

The current web dashboard is the operational workspace where this intelligence becomes usable: events, evidence, people-flow information, notifications, reports and video access are brought together so authorised users can review, decide and act.

**Internal North Star:** Observe continuously. Interpret precisely. Direct attention. Enable action.

Sentinel does not promise omniscience, perfect detection, universal prevention or the replacement of professional judgement. Its promise is to improve an organisation's ability to observe, prioritise and respond with greater precision, control and operational awareness.

## Positioning

Sentinel is positioned as an enterprise visual intelligence platform that uses proprietary computer vision technology to turn camera infrastructure into a layer of observation, interpretation and alerting, helping human teams focus attention where it is genuinely needed.

Its differentiated territory is built around:

- **Proprietary technology.** The platform and AI models are developed by the CrimsonTide team.
- **Flexible integration.** Sentinel can be deployed on compatible existing camera infrastructure or as part of a purpose-built installation.
- **Professional implementation.** Assessment, installation, configuration and adaptation to the operating environment are part of the product experience.
- **Client control when the deployment supports it.** Sentinel's architecture can be configured to keep information within the client's environment. Any privacy, retention, security, compliance or regulatory claim must still be validated for the specific implementation.
- **Capability without an artificial minimum scale.** The product can create value in smaller establishments as well as complex multi-site operations when there is a real need for observation, security or operational management.

Sentinel must not be reduced to "surveillance software", "a theft detector" or a collection of AI detections. It is an operational intelligence layer whose value comes from turning visual volume into directed attention, context, evidence and actionable next steps.

Sentinel should explain operational outcomes before technical architecture, model names or feature lists. Capabilities answer what the system can do; positioning must first explain why that capability matters to the organisation.

Jamaica is the origin of the product, evidence of local engineering capability and an important operating context. It is not the only differentiator, a cultural decoration or a permanent geographic limit.

## Operating Context

Sentinel is a product of CrimsonTide AI. CrimsonTide is the developing company, engineering source and institutional backing. Sentinel is the specialised product brand, the system the client uses and the experience that must build its own reputation and personality.

CrimsonTide provides backing; Sentinel leads the product relationship.

The deployment model is consultative rather than generic self-service. Suitability depends on the client's environment, camera infrastructure, operating needs and configuration requirements. Assessment and implementation are part of the product relationship.

Sentinel is currently designed primarily for the Jamaican market, particularly because deployment can require professional installation and infrastructure work. The product and brand must nevertheless remain capable of supporting future international expansion.

Typical current dashboard workflows include:

- **Live awareness.** Establishment-aware dashboard views, summary widgets and people-flow information with live and historical handling.
- **Report and incident work.** Browsing by report type and establishment, detail views, quick-access preferences, public report links where supported and PDF export.
- **Alert triage.** Notification centre, unseen counts, mark-as-seen actions and notification preferences.
- **Site administration.** Establishment management, camera address aliases and establishment-level delivery configuration such as Telegram linking.
- **Video access.** Embedded DVR access for operational review.
- **Support and learning.** FAQs and internal documentation with walkthrough content.

Desktop is the primary operational surface. Mobile navigation supports quick access and monitoring on the move, but does not redefine the product as a consumer mobile application.

The interface language is currently **English only**. External commercial communication should use clear international business English without unnecessary colloquialisms or forced localisms.

## Capabilities and Constraints

The stable product description is an enterprise computer vision and operational intelligence platform delivered through a web-based operational dashboard and supporting backend services.

Confirmed functionality in the current dashboard includes:

- authentication and account flows, including registration, verification, password recovery, account unlock, profile management and protected access;
- establishment management and onboarding-aware flows;
- camera address alias management;
- establishment-level Telegram linking where configured;
- summary dashboard widgets and environment-controlled live widgets;
- people-flow charts and visual summaries with live and historical handling;
- controlled manual test event creation for internal validation;
- report and incident browsing, filtering, detail views and quick-access preferences;
- public report links where supported and PDF export;
- notification centre, unseen counts, mark-as-seen actions and preference controls;
- embedded DVR access;
- FAQs and internal product documentation.

This document does not define an exhaustive detection or model catalogue. Capability families that may be relevant to Sentinel include facial recognition, cash-to-pocket, cashier monitoring, people flow, restricted areas and zoning, shoplifting or pilferage, licence-plate recognition, custom object detection, weapon detection and operational or flow analytics. Unless a capability is explicitly identified in this document as confirmed functionality, it must not be treated as proof of current availability in any or every deployment.

Capabilities should be communicated through the sequence:

**operational need -> system action -> evidence or result -> human next step -> relevant condition or limit**

Confirmed product constraints and rules include:

- the current dashboard depends on reachable Sentinel backend services; it is not a standalone local demo application;
- sensitive tokens and secrets are handled through server-side mechanisms rather than exposed to browser code;
- some behaviours, including live widgets and session-idle handling, are controlled by environment configuration;
- the active interface language is English only;
- deployment capability depends on infrastructure compatibility, assessment and configuration;
- privacy, retention, biometrics, consent, security, encryption, compliance and regulatory claims require technical and legal validation for the specific implementation;
- the product must not publish unsupported benchmarks, detection-performance figures, pricing, testimonials, customer names, case studies or compliance claims;
- a capability must be distinguished clearly as available, configurable, deployment-dependent, under validation, explored or future-facing.

Product terminology must remain precise:

- **Event:** something identified by the system that requires evaluation.
- **Incident:** an event that has been confirmed or formally recorded as an incident.
- **Detection:** the output of a model.
- **Alert:** a notification generated from a rule or detection.
- **Evidence:** a clip, screenshot or record retained for review or documentation; the term must not imply legal admissibility without validation.
- **Operator / Team / Personnel:** preferred professional and neutral terminology for people using or responding through the system.

A detection is not a verdict. The interface and communication must distinguish concepts such as detected, suspected, confidence, verified and reviewed, and must keep severity, risk, confidence and status separate.

Human oversight is a product requirement. Sentinel may observe, process, detect, classify, prioritise, alert and provide evidence. It must not be presented as a substitute for judgement, investigation, intervention, authority or professional response.

## Brand Commitments

**Definition:** an enterprise computer vision and operational intelligence platform developed in Jamaica by CrimsonTide AI.

**Essence:** strategic precision under control.

**Central idea:** Sentinel turns continuous observation into precise attention.

**Voice:** precise, composed, institutional, competent and cordial.

**Personality:** vigilant, precise, composed, strategic, responsible, polished, self-assured, emotionally contained and technologically competent.

**Precision before persuasion.** Sentinel does not exaggerate in order to appear powerful. Claims must be exact, defensible and proportional to what the product can demonstrate.

**Human judgement stays central.** Sentinel observes, interprets, detects, prioritises and alerts. People evaluate, decide and act.

**Evidence before spectacle.** The product should communicate context, evidence, operational usefulness and the next action before trying to create technological drama.

**Composure by default.** Intensity is used only when the operational state requires it. Serious situations are communicated clearly, not sensationally.

**Control without authoritarianism.** Control means visibility, order, traceability, prioritisation and response capability. It does not mean aggressive surveillance or distrust of people.

**Advanced technology, understandable language.** Sentinel should demonstrate sophistication without forcing decision-makers or operators to decode unnecessary jargon.

**Uncertainty must remain visible.** Sentinel must not manufacture certainty. Confidence, review status and limitations should be communicated when relevant.

**Jamaica is origin and capability.** Sentinel is developed in Jamaica. Jamaican origin represents engineering, technical capability, market understanding and operational proximity; it must not become stereotype, exoticism or the sole reason to choose the product.

**CrimsonTide backs; Sentinel leads.** CrimsonTide provides engineering, implementation and institutional credibility without competing with Sentinel's own product identity.

**Trust is built quietly.** Authority should come from clarity, implementation, evidence, reliability and consistency rather than hype.

## Product Principles

1. **Precision before persuasion.** If a statement, label or system state can be more exact, make it more exact.
2. **Direct attention; never replace judgement.** The system can detect, classify, prioritise and alert; people remain responsible for evaluation and action.
3. **Facts, context, evidence, next step.** Operational information should help the user understand what happened, where, when, the relevant confidence or status, what evidence exists and what can be done next.
4. **A detection is not a verdict.** Preserve the distinction between system output, confidence, review and confirmed outcomes.
5. **Composure by default.** Low-intensity informational states should dominate; urgency and stronger signals are reserved for states that genuinely require them.
6. **Control without authoritarianism.** Give users command of information, traceability and response without framing people as objects of distrust.
7. **Advanced technology must remain understandable.** Explain operational value first and technical depth when the context requires it.
8. **Evidence before spectacle.** Security and operational information must never be turned into entertainment or fear-based persuasion.
9. **Do not promise more than can be demonstrated.** Technical, legal, commercial and performance claims that are not explicitly established in this document must be treated as unconfirmed and must not be published as product facts.
10. **Innovation must have an operational reason.** New models, features or technologies are valuable when they solve a real need, not simply because they are new.
11. **Treat Jamaica as origin and capability, not as decoration or a limit.** The product can be Jamaica-first without becoming Jamaica-limited.
12. **Let CrimsonTide provide backing while Sentinel remains the product protagonist.** Build trust through clear behaviour, evidence, reliability and consistency.

## Accessibility & Inclusion

Sentinel's interface is operational, dark-only and information-dense by design. Accessibility work must therefore protect clarity, hierarchy and usability without weakening the precision required in security and operational contexts.

Confirmed current commitments include:

- motion is widely designed to respect `prefers-reduced-motion`, with reduced-motion fallbacks used across components;
- important system states should be stated before explanation so users can understand what is happening quickly;
- operational language should remain stable and unambiguous;
- errors should explain what happened and the next step without blaming the user;
- destructive actions should clearly name what will be removed, whether the action can be reversed and when confirmation is required;
- risk, severity, confidence and status must not be communicated as interchangeable concepts;
- alerts should expose an available or recommended next step rather than leaving the user with information but no clear path forward;
- product language must not portray operators or personnel as incompetent; Sentinel exists because human attention is finite, not because people are the problem.

This landing repository has an approved WCAG 2.2 AA engineering target. Automated and manual checks cover the implemented entry only and do not assert conformance. This target does not extend to other Sentinel applications; no formal conformance commitment for the operational dashboard is established here.
