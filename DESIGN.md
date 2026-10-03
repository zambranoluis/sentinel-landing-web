---
version: alpha
name: Sentinel landing
description: Controlled Precision for camera-based operational intelligence.
colors:
  primary: "#1b3266"
  steel: "#acbed1"
  ice: "#edf2f3"
  canvas: "#050b16"
  background-secondary: "#08111e"
  surface-interactive: "#111722"
  text-primary: "#f6f8fb"
  text-secondary: "#a9b4c4"
  primary-hover: "#192e5c"
  hairline: "#263447"
  hairline-strong: "rgb(172 190 209 / 42%)"
  illustration-cyan: "#8dd4ee"
  workflow-cyan: "#05ddf1"
  industry-surface: "#091623"
  industry-border: "#284254"
  footer-canvas: "#050706"
typography:
  hero:
    fontFamily: 'Roboto, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: 'Roboto, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  workflow-headline:
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  body:
    fontFamily: 'Roboto, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  navigation-desktop:
    fontSize: "0.9375rem"
    fontWeight: 500
  footer-body:
    fontSize: "0.875rem"
    fontWeight: 400
  footer-label:
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.07em"
rounded:
  control: "12px"
  compact: "14px"
  panel: "22px"
spacing:
  tight: "12px"
  compact: "20px"
  standard: "32px"
  group: "56px"
  section: "74px"
components:
  assessment:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.25rem"
  section-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  section-action-hover:
    backgroundColor: "{colors.primary-hover}"
  menu-toggle:
    backgroundColor: "{colors.surface-interactive}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    width: "44px"
    height: "44px"
  industry-card:
    backgroundColor: "{colors.industry-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.compact}"
---

# Design System: Sentinel landing

## Overview

**Creative North Star: "Controlled Precision"**

Sentinel uses dark photographic fields, clear white hierarchy, Roboto and restrained steel outlines to explain operational intelligence with composure. Generous commercial layouts let decision-makers understand the offer; illustrative cyan details show processing and review without implying live operational evidence.

The accepted landing is the baseline for extensions. Preserve supplied logo proportions, assets and copy. [PRODUCT](PRODUCT.md) owns product truth and unresolved commercial actions; [surface briefs](.impeccable/surfaces/src-app-page-tsx.md) own page strategy. This document records reusable visual decisions, not dashboard recipes.

**Key Characteristics:**

- Dark navy scenes and legible photographic overlays.
- Large balanced headings and measured body copy.
- Bounded reference geometry with responsive reading order.
- Restrained outlines and local cyan illustration detail.
- Complete content with reduced motion or without JavaScript.

Tokens above reflect consumed values in [global CSS](src/app/globals.css) and landing CSS Modules. Typography sizes expressed as CSS functions remain in the applicable prose below because the alpha format's dimension schema accepts unit values. [The sidecar](.impeccable/design.json) carries extension metadata and rendered component samples, not another primitive token source. [Format specification](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md), retrieved 2026-10-02.

## Colors

### Primary

Navy (`primary`) anchors assessment actions and selected illustrative states. Its restrained hover variant applies only to enabled section actions. Assessment, package and add-on actions remain disabled under [PRODUCT](PRODUCT.md#open-product-decisions).

### Secondary

Steel supplies leads, supporting content, borders and keyboard focus. Ice supplies brighter supporting copy. These names retain the established brand vocabulary.

### Neutral

Canvas is the page/nav foundation; background-secondary separates package content. Surface-interactive defines the menu trigger. Text-primary and text-secondary maintain hierarchy. Hairline and hairline-strong separate panels and navigation without heavy decoration. Footer-canvas is a local near-black reference field.

### Illustrative treatments

Illustration-cyan appears in detection brackets, icons, demo highlights and navigation option feedback; workflow-cyan belongs to the supplied cube diagram/connectors and all five workflow icons and circular rings. Industry cards use their local surface and border. Other scene-specific overlays and cyan strokes remain owned by their CSS Modules and assets. They do not establish operational severity, confidence or alert semantics.

## Typography

Roboto Latin 400, 500 and 700 is self-hosted through Fontsource. Body and controls inherit the global fallback stack. There is no secondary display or monospace family.

The hero uses `clamp(2.25rem, 8vw, 3.75rem)` through 720px and `clamp(2.75rem, calc(var(--reference-width) * 0.04), 4.92rem)` above it, with the frontmatter's hero weight, line height and tracking. Its measure is 14ch on mobile, 13ch above 720px; desktop preserves the four-line reference composition. Hero supporting copy is 39ch, using global `--font-lead` on mobile and `clamp(1.0625rem, 1.3vw, 1.5rem)` above 720px.

Shared section headings use `clamp(2.25rem, 4.2vw, 5rem)`, the headline role and a default 21ch measure; individual section limits remain in their modules. Shared leads use `clamp(1.0625rem, 1.35vw, 1.5rem)`, 1.55 line height and up to 65ch. Balanced headings and pretty body wrapping preserve reference composition without clipping.

How it works groups the two “More” clauses into separate blocks. Its mobile/tablet headline is `clamp(2.25rem, 5.5vw, 4rem)` with a 16ch measure; desktop uses `clamp(2.75rem, 4.2vw, 5rem)` and 11ch. Its distinct tracking is recorded in workflow-headline.

Desktop navigation uses navigation-desktop; mobile labels inherit body size. Footer body uses footer-body; uppercase group headings use footer-label, and legal text is 0.75rem with inherited body weight. Generic global `--font-title`, `--font-section`, panel/navigation ramps that the rendered headings do not consume are not the landing's type authority.

## Layout

### Reference frame and responsive bands

Desktop at 1280px and above uses a centered 1920px reference frame and 1536px main content cap. Standard gutters remain 10vw through 1920px, then grow equally: `max(10vw, calc((100vw - 1536px) / 2))`. Global CSS owns the bounded reference width, outer offset and page gutter. Background fields and photography remain full width.

Through 720px, gutters use `clamp(24px, 6vw, 40px)`; 721–1279px uses 20px gutters. Desktop hero spacing follows the bounded reference width; section heading clamps retain their own maximums. At 1000px and below FAQ/add-ons adapt; at 360px and below footer groups stack and the navbar row can wrap.

Capabilities deliberately uses 7% left and 5% right gutters inside the centered reference frame. Its 88% area caps at 1689.6px and the mosaic's negative 11% offset caps at -211.2px. Preserve the tilted composition rather than forcing it into the standard cap.

Shared section padding is `clamp(74px, 7.5vw, 144px)`; section-specific photographic space stays with the module. The spacing family above supplies recurrent gaps. How it works uses a 40% copy / 56% diagram / 4% gap layout on desktop, stacks the diagram at intermediate widths and places the cube above a vertical wrapping workflow through 720px.

### First viewport

Navbar stays in document flow. Navbar plus hero fills at least the first viewport at every breakpoint. Hero minimum is `calc(100dvh - var(--navbar-height))`, with a `100vh` fallback. The header observer publishes its border-box height; pre-measurement/no-JavaScript fallback is 81px. Short screens and enlarged text may make content taller and scroll naturally.

Above 720px, left-hand hero copy sits over the full warehouse scene and readability overlay. Through 720px, copy precedes a separate image band that absorbs spare height while retaining its aspect-ratio minimum. Image selection accounts for tall crops. Detection outlines share the photograph's geometry and remain static/decorative. Desktop navigation/actions can wrap for enlarged text.

### Section and footer relationships

Capabilities pairs the mosaic with five industry cards; the demo pairs noninteractive stage labels with an illustrative panel; deployment uses three illustrated steps; benefits places four outcomes over photography; plans pair assessment/package panels with an add-on row; FAQ pairs an introduction with disclosures; the closing CTA uses an aerial scene. Mobile reflows each in reading order.

Footer uses brand plus four groups at desktop, brand above four groups on tablet and two groups per row on mobile. At 360px and below it stacks one group per row.

The bottom area contains exactly “© 2026 CrimsonTide AI Limited.” and the full Sentinel brand home link with icon and wordmark. Above 720px, copyright sits left and the logo right, vertically centered. Through 720px, copyright occupies the first row and the logo sits right on the second row.

Footer clips decorative travel at its outer bounds so preparation and playback never extend the document's native scroll range. Its interior spacing retains visible link focus outlines.

## Elevation & Depth

Depth comes mainly from dark tonal fields, photographic overlays, borders and image composition. The illustrative demo panel alone has `0 24px 60px rgb(0 0 0 / 30%)` shadow. Cube glows remain supplied SVG illustration treatments; they are not a general card elevation system.

## Shapes

Controls use control radius, industry cards/icon tiles use compact radius, and workflow/package/demo panels use panel radius. Demo image wells/previews use a local 8px radius; feed labels use 4px. Circular numbered steps, icon rings and FAQ indicators use circular geometry. Preserve originals' SVG proportions. No input, dialog, alert or dense dashboard component system is established by this landing.

## Components

### Actions and focus

Assessment actions use the assessment tokens, a minimum 48px height, bold inherited type and a hairline-strong border. They have a not-allowed cursor and no availability message. Section actions use a Steel border, minimum 48px height, restrained 200ms fine-pointer hover and enabled press scale of 0.98. The transparent add-on variant stays disabled.

Keyboard focus uses a 3px Steel outline with 3px offset; FAQ summaries use a -4px inset offset. The skip link reveals itself on focus and reaches the main landmark. Unavailable navigation destinations are text rather than placeholder links.

### Navigation

Desktop and mobile navigation links have no text underline. Fine-pointer hover and keyboard-visible focus change their text to cyan (`#8dd4ee`) over the existing 200ms ease-out transition, preserving the Steel focus outline. Reduced motion makes color changes immediate.

Below 1280px navigation is a disclosure, not a modal or ARIA menu. The 44 × 44px trigger centers a 24px icon with three 20 × 2px lines separated by 6px. “Menu” / “Close menu” is the accessible name. Outer lines move to the centre and rotate ±45°, with middle-line opacity changing over 200ms ease-in-out; rapid reversal continues from current geometry.

The panel fades/translates from -8px over 200ms ease-out. Closed content immediately becomes inert and inaccessible; visibility waits for exit completion. Escape restores trigger focus. Fragment activation closes the panel and focuses its section. Desktop switching closes it and hands focus to the visible brand when required. Reduced motion removes transitions and spatial movement.

### Footer navigation

Footer options have no text underline and retain their resting text colors during hover and keyboard focus. Each option has a separate 2px navy (`#1b3266`) bar beneath its label, growing from left to right to the label width. Pointer feedback includes unavailable plain-text options; only enabled links receive keyboard focus and retain the existing focus outline.

Headings size to their text width. Their bars remain navy and 24px wide at rest. Hover anywhere within a footer section, or keyboard focus within it, expands its heading bar across the heading text width. Moving between options keeps the heading bar expanded while each option bar responds independently. Heading width and option scale transitions use 200ms ease-out, reverse from their current state on exit or interruption, and do not move surrounding content. Pointer hover requires a hover-capable fine pointer; touch does not leave hover feedback. Reduced motion makes changes immediate, and the styling works without JavaScript.

Global text selection retains a navy (`#1b3266`) background with light (`#f6f8fb`) text.

### Workflow illustration

The supplied SVG cube floats over 6s, pulses edges/nodes/core over 5.2s and moves sparks over 3.8s. The bottom halo uses its own 5.2s animation and the lower rows' 0.7s delay: it stays dark through 1.22s, brightens to a peak at 1.74s and fades before the next cycle. It floats behind the faces with centered local scaling and a silhouette mask that prevents blur washing over the translucent cube. The inner glow retains its original motion. Offscreen or hidden-document cube motion pauses in place and resumes automatically when visible. The cube has no user playback control and retains its independent lifecycle. Reduced motion removes animation. Without JavaScript the artwork and workflow remain complete and static. Responsive repositioning is immediate.

After hydration, the semantic ordered list offers five native step buttons. Observe → Interpret → Flag → Review → Respond cycles every 2.4s, with a 700ms connector trace, endpoint/icon pulse and short ring accents followed by a reading hold. Underlying connectors stay visible. Selection brightens the border to workflow cyan and tints the existing panel to `rgb(5 44 58 / 96%)` over 200ms; pointer press scales its contents to 0.98 over 120ms without moving tile geometry. Through 720px all rows remain visible beside a slim cyan rail whose 2 × 24px accent has 1px rounding and travels to the active row; no content expands. The playback label uses 0.875rem type within a minimum 44px touch target. Above 720px, text-relative clamps preserve the standard 12px padding, 8px gap and 44% icon diameter at the default text size, reducing decoration as text enlarges (minimum 4px padding, 2px gap and 20% icon diameter). Tile positions, circular rings and the cube remain unchanged.

Fine-pointer hover temporarily previews a step; keyboard focus takes precedence over hover. Leaving restores the held selection or the interrupted automatic stage. Click, tap, Enter and Space hold the chosen step until “Resume sequence” continues from it; only this manual selection uses `aria-pressed`. “Pause sequence” freezes the workflow accents and remaining stage hold. These controls govern the surrounding workflow only, never the cube or the separate demo. Automatic highlights have no live announcements. Keyboard activation and reduced-motion selection are immediate. Reduced motion disables cycling and spatial accents; its playback control is disabled. Preference and responsive changes settle transient effects without losing selection or focus. Repeating workflow motion pauses when every step is offscreen or the document is hidden, and resumes in place. Without JavaScript the full list and artwork appear without controls.

### Industry and package cards

Industry cards are informational fragment targets, not buttons. Their padding is 24px below desktop and `clamp(16px, calc(var(--reference-width) * 0.012), 24px)` on desktop. Fine-pointer hover changes local border/background over 200ms; reduced motion removes transitions. Package panels use panel radius, restrained outlines and the supplied comparison hierarchy; their actions remain disabled.

### Illustrative demo

Three stages each last 3.6s, followed by a two-second final review hold before looping. Playback begins when visible; offscreen/hidden playback pauses in place, including the hold. Reduced motion and no JavaScript show the final review; returning to normal motion restarts at stage one. Stage indicators are noninteractive with `aria-current="step"`; automatic changes have no live announcements. No playback controls, stage selection, outcome messages, download action or report footer remain.

### FAQ

Native FAQ details/summary starts closed and preserves no-JavaScript interaction. Pointer activation animates measured height for 240ms with cancellable/reversible state; keyboard activation is immediate. Reduced-motion changes finish active animation. The plus/minus indicator uses the existing 200ms transition.

### Landing entrances

The hero sequences heading, description and assessment action over 750ms with 90ms spacing; navigation remains immediately available. Section introductions and content use 650ms entrances with 75ms spacing. Visible capability cards, deployment steps, benefits, plan panels and footer columns stagger in current visual order, with the total delay capped at 180ms. Workflow diagram, tilted mosaic, demo, FAQ group and closing CTA enter as coherent units without overlapping parent/child entrances.

On a fresh normal-motion visit with JavaScript support, all marked information starts at opacity 0 before first paint, retaining its layout space. Navigation and the warehouse artwork remain visible. Entrances wait for self-hosted Roboto weights 400, 500 and 700 and completed font layout. The controller prepares both visible and offscreen targets before releasing startup concealment, without a visible frame between owners. Font failure or hydration/font delay reaching four seconds releases complete static content; late completion cannot conceal it again or replay startup. Reduced motion, keyboard-visible focus, fragments and restored views bypass startup concealment immediately.

Entrances use 48px vertical travel (28px through 720px), opacity 0 → 1 and `cubic-bezier(0.16, 1, 0.3, 1)`. JavaScript prepares offscreen targets in their arrival pose before entry, preventing a visible offset jump. Entry begins within the central 84% of viewport height, accounting for the prepared translation. Targets rearm only after their layout fully leaves the viewport plus a 32px buffer. Downward entry comes from below; upward entry comes from above with reversed visual stagger order. Animate only currently entering items so tall mobile sections reveal progressively.

As content departs into the outer 18% of the viewport on the outgoing edge, it fades out over 280ms and moves 32px in that direction (18px through 720px), with `cubic-bezier(0.4, 0, 1, 1)`. Visible entrances continue through reversal; an interrupted exit recovers from its current pose over 320ms without replaying the entrance. Only a full exit and reentry restarts staggered entry. Content stays settled in the reading area.

Static/no-JavaScript defaults remain fully visible; startup concealment requires the pre-paint JavaScript bootstrap and normal-motion support. Reduced motion skips decorative entrances and exits; preference changes, keyboard-visible focus and fragment targeting immediately settle affected content. Pointer focus preserves position through click completion. Hidden documents and responsive resizing settle motion. Native scrolling, existing transforms and action availability remain intact; cube, demo, FAQ and navigation interaction motion keep their separate owners. Implementation and verification live in [CODE](AGENTS/CODE.md).

## Do's and Don'ts

### Do

- Do preserve Roboto, supplied logo geometry, source assets and approved copy.
- Do retain the centered reference frame, bounded capabilities exception and viewport-height hero.
- Do keep keyboard focus visible and content complete with reduced motion or without JavaScript.
- Do use cyan as local illustrative detail and keep deployment caveats readable.

### Don't

- Don't introduce dashboard recipes or semantic alert colours as landing requirements.
- Don't activate unavailable actions or invent destinations, legal terms or product claims.
- Don't hide content behind motion or turn the separate demo's illustrative stage labels into controls.
- Don't replace the accepted visual direction during a focused extension or correction.
