---
name: Sentinel
description: "Controlled Precision — a dark operational interface where hierarchy, status and evidence are clear, and visual intensity appears only when the situation requires it."
status: "implementation-facing visual baseline"
scope: "visual language and visual behavior; frontend architecture remains implementation-owned"
authority: "self-contained visual specification; all rules and values required to interpret this design baseline are defined in this document"
authority_note: "The rules, values and behaviors defined here are authoritative for Sentinel visual implementation within the stated scope. Frontend architecture and any implementation detail not explicitly established here remain implementation-owned."

colors:
  sentinel-navy: "#1B3266"
  sentinel-steel: "#ACBED1"
  sentinel-ice: "#EDF2F3"
  sentinel-mist: "#9CB7BC"

  canvas: "#050B16"
  background-secondary: "#08111E"
  surface-primary: "#0D1726"
  surface-interactive: "#111722"
  surface-elevated: "#1B3266"

  text-primary: "#F6F8FB"
  text-secondary: "#A9B4C4"
  text-muted: "#9CB7BC"

  accent-primary: "#ACBED1"
  accent-strong: "#EDF2F3"
  primary-hover: "#192E5C"

  hairline: "#263447"
  hairline-strong: "rgb(172 190 209 / 42%)"

  status-info: "#ACBED1"
  status-attention: "implementation-owned"
  status-priority: "implementation-owned"
  status-critical: "implementation-owned"
  status-success: "implementation-owned"
  status-destructive: "implementation-owned"

typography:
  family:
    fontFamily: 'Roboto, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  page-title:
    mobile: "clamp(2.5925rem, 12.75vw, 3.9525rem)"
    tablet: "clamp(3rem, 6.2vw, 6.15rem)"
    desktop: "clamp(2.4rem, 4.96vw, 4.92rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.065em"
  major-section:
    mobile: "2.295rem"
    tablet: "clamp(2rem, 4.2vw, 4.25rem)"
    desktop: "clamp(2rem, 4.2vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.048em"
  panel-dialog-title:
    mobile: "22px"
    tablet: "24px"
    desktop: "26px"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  lead:
    fontSize: "clamp(1rem, 1.4vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.5
  body-interface:
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontSize: "0.92rem"
    fontWeight: 800
    lineHeight: 1.5
  navigation:
    fontSize: "0.86rem"
    fontWeight: 700
    lineHeight: 1.5
  label:
    fontSize: "11px"
    fontWeight: 800
    letterSpacing: "0.11em"
  metadata:
    fontSize: "10–12px"

rounded:
  control: "12px"
  compact-container: "14px"
  card-panel: "22px"
  large-surface: "32px"
  pill: "999px"

spacing:
  tight: "8–12px"
  compact: "16–20px"
  standard: "24–32px"
  group: "40–56px"
  section: "74–164px"
  implementation_note: "Preserve these Sentinel visual values. Implementation may map them to local token names, but the resulting spacing must not change."

layout:
  breakpoint-mobile-max: "720px"
  breakpoint-tablet-min: "721px"
  breakpoint-tablet-max: "1279px"
  breakpoint-desktop-min: "1280px"
  gutter-mobile: "clamp(24px, 6vw, 40px)"
  gutter-tablet: "20px"
  gutter-desktop: "≥10vw"
  application-shell-max-width: "none"
  application-shell-width: "100%"

motion:
  microinteraction: "200ms"
  surface-state: "200ms"
  optional-hover-lift: "0–2px"

components:
  action-primary:
    backgroundColor: "#1B3266"
    hoverBackgroundColor: "#192E5C"
    textColor: "#F6F8FB"
    borderColor: "#263447"
    minHeight: "48px"
    rounded: "12px"
    padding: "0 20px"
  action-secondary:
    backgroundColor: "transparent"
    textColor: "#F6F8FB"
    borderColor: "#263447"
    minHeight: "48px"
    rounded: "12px"
  action-tertiary:
    backgroundColor: "transparent"
    textColor: "#A9B4C4"
    rounded: "12px"
  action-destructive:
    backgroundColor: "implementation-owned"
    textColor: "implementation-owned"
    borderColor: "implementation-owned"
    minHeight: "48px"
    rounded: "12px"
  icon-action:
    minInteractiveTarget: "44px × 44px"
  field:
    backgroundColor: "#0D1726"
    textColor: "#F6F8FB"
    borderColor: "#263447"
    focusColor: "#ACBED1"
    errorColor: "implementation-owned"
    height: "44px"
    rounded: "12px"
    padding: "0 12px"
  toggle:
    width: "46px"
    height: "25px"
    activeBackgroundColor: "#1B3266"
    inactiveBackgroundColor: "#263447"
  dialog:
    backgroundColor: "#0D1726"
    rounded: "14px"
    maxWidth: "620px"
    shadow: "0 20px 60px rgb(0 0 0 / 38%)"
  focus:
    outline: "3px solid rgb(172 190 209 / 35%)"
    outlineOffset: "3px"
---

# Design System: Sentinel

## Overview

**Creative North Star: “Controlled Precision”**

Sentinel should feel precise, composed and operational. The interface is dark-first, structured and information-dense, but always hierarchical. Visual intensity is not decoration: it increases only when a state, risk, selection or required action genuinely needs more attention.

The product should communicate control over information, visibility and response capability without becoming visually aggressive or authoritarian. It supports operators, security teams and administrators by making events, evidence, status and next actions easier to understand and review.

The core rule is simple: use the **least visual intensity necessary to make operational state, hierarchy, evidence and action unambiguous**.

This document is the self-contained implementation-facing visual specification for Sentinel. The typography, spacing, breakpoints, responsive gutters, component sizing and baseline motion defined here form the canonical construction baseline. Sentinel-specific palette, product character, operational states and behavior are defined directly in this document.

**Key Characteristics:**

- Dark-first enterprise interface.
- Roboto as the principal type family.
- Deep Navy as the principal brand and active-emphasis anchor.
- Dark neutral backgrounds and surfaces for the normal operational field.
- Steel, Ice and Mist remain supporting Sentinel brand colors for hierarchy, focus and contrast.
- Dense but highly structured information.
- Status and severity receive stronger treatment only when operationally justified.
- Evidence, context and next action remain visually connected.
- Persistent states remain understandable without hover or motion.
- Responsive behavior recomposes information before shrinking controls or typography.
- The interface must never dramatize risk simply to attract attention.

## Colors

Sentinel uses its official brand palette as the foundation of the product interface:

- **Deep Navy — `#1B3266`**
- **Steel — `#ACBED1`**
- **Ice — `#EDF2F3`**
- **Mist — `#9CB7BC`**

Deep Navy remains the principal Sentinel brand color. Steel, Ice and Mist remain official supporting brand colors for focus, hierarchy and contrast. The normal application field uses a darker neutral interface palette so operational content can remain calm and legible while Sentinel blue is reserved for brand, selection and active emphasis.

The operational application uses the following self-contained interface values:

- Canvas / Primary Background: `#050B16`
- Secondary Background: `#08111E`
- Primary Surface: `#0D1726`
- Neutral Strong Hover / Interactive Surface: `#111722`
- Sentinel Elevated / Active Emphasis: `#1B3266`
- Primary Text: `#F6F8FB`
- Secondary Text: `#A9B4C4`
- Muted Text: `#9CB7BC`
- Primary Border: `#263447`
- Primary Action Hover: `#192E5C`

Red palette roles are intentionally not adopted into Sentinel. Where a reference palette would use red for global brand emphasis, accent labels or primary hover, Sentinel keeps its existing blue family instead. Semantic critical and destructive colors remain implementation-owned until formally approved; they must not be inferred from the excluded red values.

### Operational status colors

Sentinel communication distinguishes informational, attention, priority and critical states. Exact semantic HEX values outside the official brand palette remain implementation-owned until formally approved.

The status system must preserve these distinctions:

- **Informational** — normal operation, configuration, documentation and neutral system states.
- **Attention** — non-critical events or recommended review.
- **Priority** — elevated operational relevance or prompt review.
- **Critical** — conditions explicitly configured as critical or requiring immediate review.
- **Success** — completed or confirmed positive system state.
- **Destructive** — delete, revoke, remove or other consequential actions.

**The Intensity Rule.** Intense color appears only when it carries operational meaning.

**The Separation Rule.** Severity, risk, confidence and status are different concepts and must not share one undifferentiated color scale.

**The Color Independence Rule.** Color reinforces meaning but never carries it alone. Pair status color with text, iconography, shape, structure or position.

**The Brand Palette Rule.** Do not introduce a new global accent when Deep Navy, Steel, Ice or Mist can perform the role. Red global-accent roles are excluded from this baseline; existing Sentinel blue treatments remain authoritative for those roles.

## Typography

Sentinel uses **Roboto** as its principal interface type family.

Sentinel uses the following canonical responsive typography metrics:

| Sentinel role        |                        Mobile `<721px` |           Tablet `721–1279px` |                Desktop `≥1280px` |     Weight |   Line-height |   Tracking |
| -------------------- | -------------------------------------: | ----------------------------: | -------------------------------: | ---------: | ------------: | ---------: |
| Page title           | `clamp(2.5925rem, 12.75vw, 3.9525rem)` | `clamp(3rem, 6.2vw, 6.15rem)` | `clamp(2.4rem, 4.96vw, 4.92rem)` |        700 |          0.95 | `-0.065em` |
| Major section        |                             `2.295rem` | `clamp(2rem, 4.2vw, 4.25rem)` |    `clamp(2rem, 4.2vw, 4.25rem)` |        700 |          1.02 | `-0.048em` |
| Panel / dialog title |                                 `22px` |                        `24px` |                           `26px` |        500 |          1.08 | `-0.035em` |
| Lead                 |          `clamp(1rem, 1.4vw, 1.15rem)` |                          same |                             same |        400 |           1.5 |    default |
| Body / interface     |                                 `16px` |                        `16px` |                           `16px` |        400 |           1.5 |    default |
| Action               |                              `0.92rem` |                     `0.92rem` |                        `0.92rem` |        800 |           1.5 |    default |
| Navigation           |                              `0.86rem` |                     `0.86rem` |                         `0.8rem` |        700 |           1.5 |    default |
| Label                |                                 `11px` |                        `11px` |                           `11px` |        800 | role-specific |   `0.11em` |
| Metadata             |                              `10–12px` |                     `10–12px` |                        `10–12px` | contextual |    contextual | contextual |

Typography is functional and concise. Operational information must remain easy to scan.

**The One Family Rule.** Use Roboto for interface text. The Sentinel logo is treated as a fixed brand asset and must not be recreated typographically.

**The Functional Hierarchy Rule.** Use type size and weight to express information priority, not decoration.

**The Scanability Rule.** Dense operational content must preserve readable labels, timestamps, statuses and evidence metadata.

## Layout

Sentinel uses the following canonical spacing construction baseline:

- Tight: `8–12px`
- Compact: `16–20px`
- Standard: `24–32px`
- Group: `40–56px`
- Section: `74–164px`

The same responsive viewport bands and gutters are used:

| Viewport | Range        |              Page gutter |
| -------- | ------------ | -----------------------: |
| Mobile   | `<721px`     | `clamp(24px, 6vw, 40px)` |
| Tablet   | `721–1279px` |                   `20px` |
| Desktop  | `≥1280px`    |                  `≥10vw` |

### Application width

Sentinel is an operational web application and uses a fluid application shell:

- `width: 100%`
- no global marketing-style max-width

Local views may define practical caps for dialogs, forms, authentication panels or focused content areas.

The product should **recompose before it shrinks**. On larger canvases, navigation, filters, status panels, event lists and primary content may coexist. At smaller widths, supporting regions may become drawers, stacked regions or full-width views.

Dense tables, reports and DVR-related views may scroll or reorganize rather than compress labels to unreadable sizes.

**The Relationship Rule.** Information that belongs to one operational decision must read as one group.

**The Progressive Density Rule.** Dense areas may tighten internally while preserving clear separation between unrelated operational groups.

**The Reading Priority Rule.** Responsive changes preserve the task, evidence and next action before secondary chrome.

## Elevation & Depth

Depth comes primarily from tone, borders, hierarchy and spacing.

The Sentinel surface hierarchy is:

1. **Canvas** — `#050B16`
2. **Secondary Background** — `#08111E`
3. **Primary Surface** — `#0D1726`
4. **Interactive / Strong Hover Surface** — `#111722`
5. **Elevated / Active Sentinel Emphasis** — `#1B3266`

Default separation uses `#263447` for the primary low-intensity boundary. Stronger Steel-based boundaries and shadows are reserved for focus, true elevation, dialogs, dropdowns and floating menus.

**The Restrained Depth Rule.** Use tonal separation before strong shadow, glow or glass effects.

**The True Elevation Rule.** Stronger shadows belong only to content that genuinely floats above the current operational context.

**The No-Drama Rule.** Risk and criticality are communicated through hierarchy and meaning, not theatrical effects.

## Shapes

Sentinel uses the following canonical component radius family:

- **12px** — buttons, inputs and compact controls.
- **14px** — disclosure groups and contextual containers.
- **22px** — standard cards and panels.
- **32px** — large surfaces when the information architecture genuinely needs them.
- **999px** — pills, compact status tags and intentional capsule controls only.

Rounded geometry must not make the dashboard feel consumer-oriented or playful.

**The Component Geometry Rule.** Reuse the established radius family before creating a local value.

**The Pill Exception Rule.** Pills are appropriate for compact status, filters or labels, not for ordinary panels.

## Iconography

Sentinel iconography is functional, neutral and descriptive.

Icons may represent:

- access;
- cameras;
- events;
- reports;
- notifications;
- evidence;
- people flow;
- establishments;
- configuration;
- support;
- specific operational situations.

Icons identify a state or action without dramatizing it.

Neutral states remain low-emphasis. Selected, active or higher-priority states may use stronger Sentinel palette contrast or an approved semantic status color.

Semantic icons reinforce labels rather than replace them.

Small visible icons may sit inside larger interaction targets to preserve usability.

## Components

### Actions

Sentinel uses five action families:

- **Primary** — Deep Navy / Sentinel emphasis; dominant action in a local decision region.
- **Secondary** — outline or lower-emphasis neutral treatment.
- **Tertiary** — text or icon action.
- **Icon action** — compact visible control with a larger usable hit area.
- **Destructive** — reserved for delete, revoke, remove or other consequential actions.

Primary, Secondary and Destructive button families use a `48px` minimum height and `12px` radius.

Icon actions use a minimum interaction target of `44×44px`.

Keyboard focus uses a visible Steel-based `3px` outline with `3px` offset.

**The Local Action Hierarchy Rule.** One action should dominate a local decision region.

**The Destructive Separation Rule.** Destructive actions must not look like ordinary confirmation.

### Inputs and form controls

Application fields use dark neutral surfaces with restrained borders.

Default construction:

- `44px` height.
- `12px` radius.
- `#0D1726` fill.
- `#F6F8FB` primary text.
- `#263447` primary border.
- Steel focus boundary and soft focus ring.
- explicit error state plus visible explanation.

Labels remain visible when meaning, validation or recovery depends on them.

Errors explain what happened and the next step. They do not blame the user.

### Toggles, checkboxes, segmented controls and disclosure

Toggles represent persistent on/off states.

Baseline switch size:

- `46×25px`

Active state uses Sentinel emphasis and unmistakable knob position. Inactive remains quieter.

Checkboxes combine color with visible form change.

Segmented controls keep alternatives equivalent until selection.

Disclosure state is explicit through chevron direction, spacing and expanded structure.

### Navigation and selection

Navigation is quiet by default and clear when active.

Inactive destinations remain neutral. The current destination receives persistent visual emphasis through surface, text, border or approved accent treatment.

Selection is persistent. Hover is temporary.

Desktop may keep primary navigation visible. Mobile may use a drawer, compact navigation or equivalent responsive pattern.

### Feedback, status and empty states

Status combines:

- text;
- iconography;
- shape;
- color;
- position where useful.

Common states include:

- informational;
- attention;
- priority;
- critical;
- success;
- failed;
- pending;
- unavailable.

Status wording must remain concise and factual.

Feedback stays close to the action or information it explains.

Empty states preserve the recognizability of the affected area, explain what is missing and expose the next useful action when appropriate.

### Alerts and operational events

Alerts are a core Sentinel pattern.

A useful alert should make the following information easy to identify:

1. What happened?
2. Where?
3. When?
4. Confidence or status, when relevant.
5. What evidence is available?
6. What can the user do next?

The interface must distinguish:

- Event
- Incident
- Detection
- Alert
- Evidence

A detection is not a verdict.

Severity, risk, confidence and status must remain visibly distinct.

Critical treatment increases priority without becoming visually dramatic.

### Tables, reports and evidence

Tables prioritize scanability, alignment and row rhythm.

Common table content may include:

- event type;
- establishment;
- location;
- camera;
- timestamp;
- status;
- confidence;
- evidence availability;
- operator action.

Use subtle dividers and selective status emphasis.

Reports and evidence surfaces should make context and review actions easy to locate.

Evidence may include clips, screenshots or records. Visual treatment must not imply legal admissibility.

Dense tables may scroll or reorganize on smaller screens before labels become unreadable.

### Dashboard and widgets

Dashboard surfaces summarize operational state without becoming decorative.

Widgets may represent:

- summaries;
- people flow;
- recent events;
- live information;
- notifications;
- establishment context;
- system state.

Metrics use a prominent value, concise label and secondary visualization only when it adds meaning.

Charts remain dark and controlled. Color distinguishes data only when necessary.

### DVR and video surfaces

Video is an operational surface, not a decorative background.

Primary video content receives visual priority over surrounding controls.

Controls, camera labels, timestamps, status and related evidence remain accessible without obscuring the feed.

Critical overlays must be reserved for information that genuinely requires immediate attention.

### Notifications

The notification center prioritizes:

- event type;
- establishment or location;
- time;
- status;
- review state;
- available next action.

Unseen state must remain visible without depending on color alone.

Mark-as-seen and preference actions remain secondary to the notification content.

### Establishments and administration

Administrative surfaces may include:

- establishment creation and editing;
- camera address aliases;
- notification preferences;
- account configuration;
- Telegram establishment linking;
- profile and password management.

These views may be denser than public-facing product surfaces but must retain the same hierarchy, spacing and state rules.

### Dialogs and overlays

Dialogs isolate one primary decision.

They use an elevated dark surface, clear title, concise consequence or explanation, and differentiated actions.

Reference construction:

- up to `620px` width;
- `14px` radius;
- stronger modal shadow.

Destructive confirmations must name what will be removed and whether the action can be undone.

### Authentication

Authentication may use a slightly more branded Sentinel presentation than the operational dashboard.

Login, registration, verification, password reset and unlock flows should remain focused on one task.

The Sentinel logo may be more prominent here, while the form itself preserves the same typography, spacing and control dimensions.

## Motion

Motion is short, controlled and informative.

Baseline:

| Motion role                     | Duration |
| ------------------------------- | -------: |
| Standard microinteraction       |  `200ms` |
| Surface / menu state transition |  `200ms` |
| Optional hover lift             |  `0–2px` |

Motion communicates response, continuity and state change.

It must not dramatize alerts, detections or critical situations.

Essential information never depends on animation.

Reduced motion removes or minimizes non-essential movement while preserving state clarity.

**The State-First Motion Rule.** Motion complements a visible state change; it never replaces it.

**The Reduced-Motion Rule.** Removing non-essential motion must not remove operational information.

## Responsive Behavior

Sentinel recomposes before shrinking.

### Mobile

- Navigation may become a drawer or compact flow.
- Supporting panels may become full-width.
- Event, alert and evidence content remains readable.
- Dense tables may reorganize or scroll.
- Touch comfort does not depend on hover precision.

### Tablet / intermediate width

- Use intermediate density rather than scaled desktop geometry.
- Keep controls touch-safe.
- Allow two-region layouts only when both remain readable.

### Desktop / larger width

- Persistent navigation and supporting panels may coexist with the primary operational view.
- Fine-pointer hover may add restrained feedback.
- Additional space should expose more useful information rather than enlarge interface chrome.

Core breakpoint bands:

- Mobile: `<721px`
- Tablet: `721–1279px`
- Desktop: `≥1280px`

## Accessibility

Accessibility is part of every operational state.

- Keyboard focus is clearly visible on dark surfaces.
- Risk, status, selection, success and destructive meaning never depend on color alone.
- Essential actions remain available without hover.
- Secondary text remains visually distinct from disabled content.
- Reduced motion preserves essential state information.
- Small visible icons use interaction targets of at least `44×44px`.
- Dense information maintains readable spacing, alignment and contrast.
- Sensitive operations describe consequences before confirmation.
- Alerts preserve textual meaning even when status color is unavailable.

This landing repository targets WCAG 2.2 AA as an engineering requirement. Automated and manual verification must cover implemented content; neither the target nor an axe pass asserts conformance. The operational dashboard's formal conformance target remains unconfirmed.

## Do's and Don'ts

### Do

- **Do** keep operational information and the next useful action visually dominant.
- **Do** use `#050B16`, `#08111E`, `#0D1726` and `#111722` as the normal dark operational field.
- **Do** reserve Deep Navy and the existing Sentinel blue family for brand, selection, active emphasis and approved blue hover states.
- **Do** use Steel, Ice, Mist, `#F6F8FB`, `#A9B4C4` and `#263447` to support hierarchy, text and boundaries according to the roles defined above.
- **Do** reserve stronger semantic colors for real operational meaning.
- **Do** distinguish severity, risk, confidence and status.
- **Do** use typography, spacing and tone before decoration.
- **Do** make selection persistent after hover ends.
- **Do** reorganize dense information before shrinking it below readable scale.
- **Do** keep evidence, context and next action close together.
- **Do** preserve complete operation with reduced motion and without hover.
- **Do** extend established Sentinel visual families before creating one-off conventions.
- **Do** keep destructive actions visually separate from ordinary actions.

### Don't

- **Don't** turn every state into a high-intensity alert.
- **Don't** use color as the only indication of meaning.
- **Don't** use dramatic glow, flashing or visual alarm as a default risk treatment.
- **Don't** turn every content region into a bordered card.
- **Don't** use heavy shadows or glass effects as default depth mechanisms.
- **Don't** make hover necessary to reveal essential information.
- **Don't** compress desktop geometry into mobile by simply shrinking everything.
- **Don't** present a model detection as a confirmed incident.
- **Don't** visually imply certainty when confidence or verification is incomplete.
- **Don't** introduce additional global brand colors without approval.

## Visual Completion Checklist

A Sentinel view or component is visually resolved when:

1. Primary operational content and the primary local action are immediately recognizable.
2. Brand and semantic colors have clear roles rather than decorative use.
3. Typography follows the functional hierarchy defined in this document.
4. Relevant default, hover, pressed, selected, focus, disabled and loading states are resolved.
5. Severity, risk, confidence and status are visually distinguishable where applicable.
6. Borders, shadows, containers and background effects have a clear functional purpose.
7. Dense data remains scannable.
8. Alerts expose context, evidence and next action.
9. Mobile preserves readability, touch comfort and task flow.
10. The experience remains complete without hover and with reduced motion.
11. New treatments extend an established Sentinel visual family before creating a one-off convention.

## Closing Principle

Sentinel should use the **least visual intensity necessary for operational hierarchy, state, evidence and action to be unambiguous**.

Development may choose the implementation architecture that best fits the product, provided the resulting interface preserves the visual behavior, hierarchy and character documented here.

Where an exact Sentinel implementation value is not established in this document, it remains implementation-owned and must not be silently promoted to an official Sentinel rule.

## Landing requirements

The palette, Roboto family, fixed SVG logos, spacing/radius families, breakpoint bands and composure remain the brand baseline. Application shell width, dense tables, operational alert/status semantics, widgets, DVR, authentication and administration above describe dashboard context; they do not require those interfaces on the public landing.

Approved compositions are the ten section previews in `references/sections/`, with [copy](references/web-content.md). Foundation only uses a main landmark, one heading containing the original combined logo, and the approved description. It is a quiet runtime entry, not the hero composition. Preserve logo proportions and originals; publish only consumed copies. Roboto Latin 400 is the entry's sole required text weight. Global CSS maps brand tokens to local custom properties; CSS Modules own local composition. No motion or controls are introduced.

The entry uses documented gutters, canvas `#050B16`, secondary text `#A9B4C4`, standard gap `32px` and minimum section spacing `74px`. Text wraps at narrow widths and enlarged font sizes. Focus uses the baseline Steel outline when controls appear. Content remains complete with reduced motion.

The product/design owner must settle reference/authority conflicts affecting a section before implementing it. Use a reviewable browser preview when evidence cannot settle the direction. Later slices must verify focus, responsive composition, applicable motion entry/exit/interruption/repositioning, reduced motion and load performance. The landing WCAG 2.2 AA engineering target does not assert conformance or change dashboard commitments.
