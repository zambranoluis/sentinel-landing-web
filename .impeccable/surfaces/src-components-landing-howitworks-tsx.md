---
version: 1
slug: "src-components-landing-howitworks-tsx"
primary_target: "src/components/landing/HowItWorks.tsx"
related_targets: ["src/components/landing/HowItWorks.module.css"]
mode: Persuade
---

# How it works

## Purpose

Explain Observe, Interpret, Flag, Review and Respond to an evaluation audience. Preserve the supplied warehouse composition, exact copy and SVG cube geometry. [PRODUCT](../../PRODUCT.md) owns meaning, [DESIGN](../../DESIGN.md#components) owns reusable visual/interaction decisions, and the [section preview](../../references/sections/2-how-it-works/preview.png) supplies visual provenance.

## Surface guidance

Large left-hand copy and a radial five-panel diagram surround the central cube at desktop. The diagram stacks below the text at intermediate widths; mobile puts the cube above a readable vertical wrapping workflow. Use semantic heading, paragraph and ordered-list content.

Keep section text and artwork server rendered with a narrow workflow client boundary receiving the unchanged cube. The supplied cube motion automatically pauses offscreen or when the document is hidden, without resetting position, and resumes when visible. The workflow and cube retain independent automatic playback lifecycles. The bottom halo follows lower-row propagation, floats behind the cube and masks its silhouette; preserve the inner glow. All five icons and their circular rings use workflow cyan (`#05ddf1`). Existing navbar/footer links reach the section, close mobile navigation and focus the target.

Enhance the ordered list into native buttons after hydration, preserving Observe → Interpret → Flag → Review → Respond → Observe. Above 720px place these labels in the existing clockwise slots: top, right, lower right, lower left and left. Preserve dimensions, icons, colours, cube geometry and underlying connectors. Each 2.4s interval holds the current tile for 1.7s, sweeps ring accents clockwise for 350ms and traces the destination connector outward for 350ms before highlighting that tile and pulsing its endpoint/icon. Through 720px keep all five vertical wrapping rows: each 1.2s interval holds for 500ms, moves the slim cyan rail for 700ms and then highlights the next row. Both layouts include Respond-to-Observe wraparound. Border/tint feedback takes 200ms; pointer press uses a 120ms scale to 0.98.

Fine-pointer hover emphasizes a tile independently; keyboard focus overrides hover. Click/tap/Enter/Space add 600ms emphasis. Keep the automatic tile highlighted alongside interaction emphasis. Interactions never change the stage/clock, move the rail or cancel/retarget effects. Tiles do not toggle and have no `aria-pressed`; automatic changes remain silent. Workflow playback is automatic only; render no playback button or reserved control space. One shared playback timeline preserves interval and effect progress during offscreen/hidden suspension and resumes automatically when visible. Keyboard emphasis and reduced-motion feedback are immediate; reduced motion disables cycling/spatial effects while retaining step interactions. Geometry changes preserve stage/control identity/focus and settle effects; breakpoint changes preserve normalized interval progress and rearm effects with the next stage. Without JavaScript show the complete static list/artwork without controls. The separate demo's stage labels remain noninteractive.

Cyan/blue connectors and glows are local illustration details. This explanation adds no commercial CTA or operational certainty.

## Direction contract

THESIS: Make the five stages of turning video into human action legible in the supplied warehouse composition.

OWN-WORLD: Sentinel's dark field, Roboto, controlled borders, white hierarchy and reference-local blue/cyan illustration accents.

STORY: Read the value statement, understand Observe → Interpret → Flag → Review → Respond, then continue exploring the offer.

FIRST VIEWPORT: About 40% copy and 56% diagram with a 4% desktop gap; five icon panels surround a luminous cube over the supplied background.

FORM: Preserve supplied local geometry and responsive reading order. Cube motion remains the focal illustration with automatic visibility pausing; no identity replacement or alternate concept is required.

FINISH: Preserve original/consumed asset provenance and verify affected focus, responsive and motion states through [CODE](../../AGENTS/CODE.md#verification). Handle historical reviews and execution records through [PLANS](../../AGENTS/PLANS.md).
