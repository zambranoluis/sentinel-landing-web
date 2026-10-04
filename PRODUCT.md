# Product

<!-- impeccable:product-schema 1 -->

## Public landing scope

This repository implements Sentinel's public English-language commercial landing at `/`. The current implementation is the accepted landing baseline. [Approved copy](references/web-content.md) and the ten section compositions in `references/sections/` remain content and visual provenance. [DESIGN](DESIGN.md) owns reusable visual decisions; surface briefs own the strategy for their named targets.

The page contains hero, How it works, capabilities, product demo, deployment, benefits, plans, FAQs, final assessment CTA and footer, with navigation to implemented sections and industry cards. It runs without a backend, authentication, environment secrets or operational data. It implements no analytics, cookie workflow, payment, submission or dashboard routes.

## Users

The audience is business and institutional decision-makers evaluating camera-based operational intelligence: security and loss-prevention leaders, operations managers, establishment owners, IT/infrastructure teams and procurement stakeholders. They need to understand suitability, deployment conditions and the role of their personnel before discussing an assessment.

Sentinel serves needs from smaller establishments to multi-site organisations when infrastructure and operating requirements fit. Jamaica and the Caribbean are the initial market context; communication uses clear international business English and leaves room for future international expansion. Domestic alarms and consumer self-service camera tools are not the positioning of this landing.

## Product Purpose

Sentinel is CrimsonTide AI's computer vision and operational intelligence platform, developed in Jamaica. It turns continuous visual input into directed attention: observe configured environments, interpret defined events, flag relevant context, support review and enable human response. Human attention is finite; the offer is assistance with observation and prioritisation, not perfect detection or a replacement for judgement.

The broader platform's operational dashboard and backend are background to the offer. This repository neither implements nor independently verifies their authentication, reports, notifications, DVR, administration, models or live performance.

## Positioning

The supplied commercial story combines CrimsonTide's proprietary technology, professional assessment and configuration, compatibility with existing or purpose-built camera infrastructure, and deployment-dependent local processing. Those are approved positioning claims, not measured outcomes from this landing. Describe the operational need, configured system action, review context and human next step, preserving each condition.

Sentinel leads as the product; CrimsonTide supplies engineering and implementation credibility. Sophistication does not imply a minimum enterprise size, and the offer is broader than a single detection category.

## Journeys

Visitors understand the offer in the hero, follow Observe → Interpret → Flag → Review → Respond, identify industry fit, inspect the illustrative event-to-review demo, assess deployment and package terms, resolve questions, then consider a site assessment.

Home and the five primary fragments (How it works, Capabilities, Deployment, Plans and FAQ) are available. Five footer industry links reach the supplied retail, shops/pharmacies, restaurants/bars, manufacturing/warehousing and gas-station cards. Hotels has no supplied section and remains unavailable.

The hero is an explorable illustrative warehouse scene: visitors can inspect a truck, four people, a forklift, five pallet areas and a transfer route. Hover or keyboard focus previews details; click, tap, Enter or Space pins a selection. Each detail describes the subject and context under “Illustrative detection,” without performance metrics or live claims. Detection descriptions remain visually hidden and available to assistive technology, including without JavaScript. The hero has no detection disclosure or playback control; decorative motion suspends automatically when offscreen, when the document is hidden or when reduced motion is enabled. The photograph, hero copy and assessment action retain their approved composition.

The workflow cube is explanatory artwork. The separate demo is explicitly illustrative: three automatic stages when visible, followed by a two-second final review hold and repeated looping. Stage labels are noninteractive. Reduced motion and no JavaScript show the static final review. Neither the hero nor the demo performs detections, saves footage or sends alerts.

Eight supplied FAQ disclosures start closed and work without JavaScript. Plans show a free assessment and package terms with pricing confirmed after assessment; they implement no purchase or contract workflow.

## Capabilities and Constraints

The approved copy discusses industry-specific configured detection families, contextual evidence, alerts and deployment. Its FAQ names examples including facial recognition, cash-to-pocket, cashier monitoring, people flow, restricted areas, shoplifting/pilferage, licence plates, custom objects and weapons. These are assessment-dependent capability descriptions, not a verified catalogue or a guarantee for every deployment.

Camera compatibility, model availability, configuration, alert timing, data flow, storage, connectivity behaviour, hardware recovery and commercial terms must be confirmed for the implementation. Preserve those caveats. Do not add unsupported benchmarks, pricing amounts, customers, testimonials or technical/legal/compliance guarantees. Privacy, retention, biometrics, consent, encryption and regulatory statements require validation by their technical and legal owners.

An event or detection requires evaluation; an incident is confirmed or formally recorded. An alert directs attention. Evidence means material for review and documentation, without implying legal admissibility. Keep confidence, review status, risk and severity distinct whenever introduced. People evaluate, decide and act.

### Open product decisions

| Decision                                                                                                                           | Owner                                | Blocked work / current presentation                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Assessment destination and contact/submission handling, including fields, validation, success/failure states and service ownership | Product owner with integration owner | Activating assessment CTAs or building a form; assessment buttons stay disabled without an availability message by the user's decision |
| Package inquiry and add-on destinations                                                                                            | Product/commercial owner             | Activating those controls; they remain disabled                                                                                        |
| Company/contact/news destinations and any telephone/WhatsApp linking                                                               | Product owner                        | New routes or external links; supplied contact information and unavailable labels remain text                                          |
| Privacy, terms and biometric/consent destinations and submission privacy requirements                                              | Product owner with legal/data owner  | Legal links and dependent submissions; labels remain text                                                                              |
| Hotels content                                                                                                                     | Product/content owner                | Enabling that industry destination; label remains text                                                                                 |

An implementation request does not supply these missing contracts. Continue independent work while the responsible decisions are pending; preserve disabled actions until their dependencies are settled.

## Brand Commitments

Strategic precision under control: precise, composed, competent, institutional and cordial. Explain advanced technology in understandable language. Build trust through clarity, context and evidence rather than fear or spectacle. A detection is not a verdict, and personnel are supported rather than portrayed as inadequate.

Jamaica is origin and engineering capability, not decoration or a geographic ceiling. Keep Sentinel's identity primary, CrimsonTide's backing clear, supplied logos intact and approved copy unchanged unless the user authorizes a content change.

## Accessibility & Inclusion

The landing has a WCAG 2.2 AA engineering target. Preserve semantic content, visible keyboard focus, skip navigation, comfortable touch targets, readable responsive reflow and complete no-JavaScript/reduced-motion content. Do not make a visitor depend on hover or continuous animation to understand the offer. Motion controls, disclosures and focus behaviour are documented in [DESIGN](DESIGN.md#components) and implemented through [CODE](AGENTS/CODE.md#project-engineering-guidance).

Automated checks and manual review support the implemented public entry only; they do not establish formal conformance, real-device coverage or accessibility of the operational dashboard.
