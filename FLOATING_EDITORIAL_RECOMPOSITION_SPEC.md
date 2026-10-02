# Floating Editorial Re-composition — Future Phase Specification

## Status

Specification only. **Do not implement as part of M4.3.**

This future phase is subordinate to the canonical responsive rules in `RESPONSIVE_EDITORIAL_COMPOSITION_CONTRACT.md`.

This document defines a future, standalone refinement phase for neumACt’s floating editorial surfaces. Its purpose is to make the floating moments feel authored, page-specific and structurally necessary rather than simply placing white boxes over imagery.

The objective is **not** to make more of the site float. The objective is to make the few existing floating moments substantially better while preserving the large majority of the site as flat institutional editorial flow.

---

## 1. Core principle

A floating surface is justified only when the overlap itself communicates hierarchy, transition or editorial relationship.

If a section works equally well as a normal block in document flow, it should normally remain flat.

The floating surface must feel like an intentional continuation of both the media above it and the content below it. It must not read as a detached card, dashboard panel, generic premium component, or decorative rectangle.

**Target feeling:** institutional editorial composition.

**Avoid:** product dashboard, SaaS landing page, portfolio card grid, glassmorphism, card wall, stacked floating boxes.

---

## 2. Floating hierarchy

The existing three-level model remains the governing system.

### Level A — Editorial Float

Used only for the most important opening compositions where overlap creates page identity.

Allowed uses:
- Homepage institutional opening / research programme transition.
- Research programme identity / scientific leadership transition.
- Publications editorial opening.
- Team editorial introduction where photography and narrative deliberately intersect.

Expected characteristics:
- meaningful overlap with media or adjacent editorial field;
- strong page-specific geometry;
- little dependence on shadow for depth;
- controlled asymmetry;
- visible relationship to the next section;
- limited to one primary floating moment per destination page unless a compelling exception is documented.

### Level B — Raised Sheet

Used for compact supporting information where a small amount of elevation clarifies hierarchy.

Examples:
- restrained institutional affiliation note;
- small contextual folio;
- compact authored supporting surface.

Expected characteristics:
- shallow elevation;
- small overlap or no overlap;
- reduced radius;
- no dominant shadow;
- visually secondary to Level A.

### Level C — Flat Institutional Flow

This is the default for the site.

Use for:
- research line indexes;
- study lists;
- publication rows;
- project records;
- team roster entries;
- metadata;
- institutional context;
- filters;
- contact forms;
- evidence lists;
- section introductions where overlap adds no meaning.

Expected characteristics:
- normal document flow;
- rules, spacing and typography provide hierarchy;
- no box shadow;
- no unnecessary rounded container;
- no lift animation.

**The site should remain predominantly Level C.**

---

## 3. Anti-card rules

A floating editorial surface must not become a conventional card.

### 3.1 Radius

Large, soft-radius rectangles should be used sparingly.

Guidance:
- Prefer subtle or page-specific corner treatment.
- A float may use restrained radius where appropriate, but radius must not be the main visual signal of elevation.
- Avoid repeating the same rounded rectangle geometry across Research, Publications, Team and Homepage.

### 3.2 Shadow

Shadow is supporting evidence of elevation, not the source of elevation.

Guidance:
- Prefer overlap, border, tonal change and negative space first.
- Shadows should be quiet and broad rather than dark or dramatic.
- No floating surface should look like it could be dragged around the screen.
- Avoid multiple nested shadows.

### 3.3 Hover behaviour

Hero/editorial floats are not interactive cards.

Therefore:
- no hover lift;
- no scale-up of the whole surface;
- no glowing edge;
- no animated shadow expansion;
- no pointer cursor unless a specific internal control is interactive.

### 3.4 Repetition

Never create a sequence of floating boxes simply because the visual language exists.

If three or more adjacent content units would all need their own floating rectangle, the composition should be reconsidered and usually flattened into rows, sections, columns or ruled editorial flow.

---

## 4. Composition requirements

### 4.1 The float must respond to the media

The media cannot behave as arbitrary wallpaper behind a generic white panel.

The final composition should consider:
- subject position in the image;
- negative space in the crop;
- direction of visual movement;
- panel width and offset;
- which part of the image remains visible around the float;
- whether the overlap reveals or obscures meaningful media.

The panel should feel placed **because of that media composition**, not merely because the design system permits overlap.

### 4.2 The float must respond to the next section

A Level A float must influence the opening rhythm of the following section.

Possible techniques:
- shared left axis;
- deliberate continuation of a divider;
- aligned section title baseline;
- controlled negative-space handoff;
- a column from the float continuing into the next section;
- subtle width relationship between float and following content.

The user should not perceive: “hero ended; card appeared; new unrelated section began.”

### 4.3 Controlled asymmetry

Perfect 50/50 splits should not be the default.

Use asymmetry to create hierarchy, for example:
- 38/62;
- 42/58;
- title column narrower than explanatory column;
- divider slightly off-centre;
- contextual column beginning higher or lower than title baseline;
- intentionally unequal internal padding.

Asymmetry must remain calm and institutional, not experimental for its own sake.

### 4.4 Reading measure remains constrained

A wider float must not produce excessively long lines.

Wide-screen growth should increase composition, not prose measure.

Continue using max-width constraints for:
- body copy;
- lead copy;
- biographies;
- contextual descriptions.

---

## 5. Page-specific identities

The future phase must preserve different personalities across the core destination pages.

### 5.1 Homepage — Institutional Threshold

Role: strongest public-facing transition.

Direction:
- retain a confident overlap between institutional hero and research programme;
- make the programme feel integrated into the landing narrative, not like a floating module;
- maintain the strongest float of the site, but still restrained;
- use broad composition and editorial depth rather than card styling;
- keep subsequent homepage sections predominantly flat.

The Homepage is allowed to have the strongest Level A treatment because it is the institutional front door.

### 5.2 Research — Scientific Split-Sheet

Role: connect programme identity with scientific leadership.

Direction:
- retain one integrated sheet containing the Research identity and Pedro’s leadership context;
- leadership must remain visible at all certified widths;
- avoid making the leadership area look like a separate profile card;
- use an asymmetric scientific/editorial split rather than an evenly divided box;
- portrait, name, role and programme description should read as one authored composition;
- preserve the structural fix that uses normal-flow overlap rather than transform-dependent centring;
- the transition into the six-line research index must feel deliberate.

The Research float should feel precise, scientific and structured.

### 5.3 Publications — Editorial Folio

Role: introduce the curated scholarly/public editorial record.

Current risk:
- the existing white rounded surface can read as a premium UI card over a dark image;
- internal 50/50 structure is too predictable;
- the media behaves too much like background wallpaper;
- the jump into “Selección” is visually abrupt.

Future direction:
- flatten the shadow substantially;
- reduce card-like softness;
- consider a slightly sharper or more folio-like edge treatment;
- use deliberate asymmetric internal columns, approximately 38/62 or 40/60 as a starting point;
- position the divider according to editorial hierarchy rather than exact centre;
- use the image crop and visible negative space to determine panel placement;
- connect the lower edge / axes of the folio to the “Selección” section below;
- preserve the large Publications title as a primary editorial gesture;
- avoid adding other floating surfaces to the publication index.

The Publications float should feel like a magazine/research folio, not an application panel.

### 5.4 Team — Quiet Raised Editorial Sheet

Role: bridge conceptual team imagery with the multidisciplinary narrative.

Direction:
- remain the quietest Level A or strong Level B treatment among the main pages;
- photography should carry more emotional weight than the sheet;
- reduce visual weight of radius/shadow if it competes with the image;
- keep the introduction calm and human;
- do not allow roster entries, coordinators or individual people to inherit the floating-surface treatment;
- roster remains flat editorial index.

The Team float should feel human and editorial, not directory-like.

### 5.5 Innovation — Primarily Flat

Innovation does **not** need a floating hero simply to match other destination pages.

Direction:
- retain a more direct split hero / normal flow unless future evidence shows overlap creates real hierarchy;
- project records remain flat;
- clinical prompts remain flat;
- no floating project cards.

Page-to-page difference is intentional.

---

## 6. Desktop, workstation and mobile behaviour

### 6.1 Standard desktop / laptop

This is the primary composition target.

Requirements:
- float must remain fully inside the viewport;
- no content may be pushed off-screen;
- overlap should feel substantial but not excessive;
- content widths must remain proportional rather than stretched;
- laptop versions should not look like compressed workstation layouts.

Certification widths should include at minimum:
- 1024px;
- 1280px;
- 1366/1440px;
- 1680px.

### 6.2 Wide workstation

At 1920–2048px:
- expand the composition, not the text measure;
- do not simply make the floating surface much wider;
- preserve meaningful margins;
- asymmetry should remain visible;
- photography should not become empty wallpaper;
- secondary columns should not become oversized.

Certified widths:
- 1920px;
- 2048px.

### 6.3 Mobile

Mobile should not be a miniature desktop float.

Guidance:
- reduce overlap substantially;
- use normal flow where necessary;
- preserve only a small visual handoff from media to sheet;
- avoid large shadows;
- keep content order logical for accessibility and reading;
- never use absolute positioning that makes content dependent on a fixed hero height;
- no horizontal overflow.

The existing Research mobile strategy — normal flow with restrained negative overlap — is the preferred pattern.

---

## 7. Implementation rules

1. **Do not use transform for essential layout positioning.** Reveal animations must never own centring or structural geometry.
2. **Do not introduce page-specific design tokens outside `styles/tokens.css`.**
3. Shared float grammar belongs in `styles/editorial-surfaces.css` or a future dedicated recomposition layer only when genuinely shared.
4. Page personality remains in the page stylesheet or scoped shared layer.
5. `workstation.css` remains final wide-screen geometry authority unless explicitly refactored in the future phase.
6. No inline CSS or executable inline JavaScript.
7. Respect reduced-motion preferences.
8. Preserve semantic DOM order even when desktop composition is asymmetric.
9. Avoid unnecessary new wrappers if CSS can use existing semantic structure.
10. Do not change content wording merely to make the composition easier unless content review is explicitly part of the phase.

---

## 8. Suggested future phase sequence

### Phase F1 — Audit and visual classification

- Inventory every existing raised/floating surface.
- Classify each as Level A, B or C.
- Identify accidental card-like treatments.
- Identify where overlap adds no hierarchy and should be removed.
- Produce screenshots at mobile, laptop and workstation widths before code changes.

### Phase F2 — Publications folio re-composition

Use Publications as the first implementation because it most clearly exposes the current limitations.

Success criteria:
- not recognisable as a generic rounded card;
- photo and folio visibly interdependent;
- controlled asymmetry;
- cleaner handoff into “Selección”;
- no new floats elsewhere on the page.

### Phase F3 — Research scientific split-sheet

- refine column proportions;
- integrate leadership more naturally;
- keep Pedro visible across every certified width;
- refine relationship with first research-line section;
- preserve transform-independent structural positioning.

### Phase F4 — Team quiet editorial sheet

- lower visual elevation;
- increase relationship to conceptual team photography;
- preserve flat people index below.

### Phase F5 — Homepage institutional threshold

- refine only after destination-page patterns are proven;
- ensure the strongest site float remains unique;
- prevent the programme panel from becoming a large homepage card.

### Phase F6 — Cross-breakpoint certification

Test all revised surfaces at:
- 375/390px mobile;
- 620/768/880px transitional widths;
- 1024px;
- 1280px;
- 1440px;
- 1680px;
- 1920px;
- 2048px.

Add Playwright regression checks for:
- no horizontal overflow;
- surfaces entirely inside viewport;
- required contextual columns visible;
- mobile surfaces in normal flow where specified;
- workstation widths not exceeding governed limits.

---

## 9. Visual acceptance criteria

A floating composition is accepted only if all of the following are true:

- It would lose meaningful hierarchy if converted to a normal flat section.
- It is visibly related to the media or section above it.
- It is visibly related to the section below it.
- Its geometry is page-specific rather than a reused generic card.
- Depth remains understandable with the shadow mentally removed.
- The page still contains substantially more flat flow than floating surfaces.
- It does not resemble a dashboard widget.
- It does not create a sequence of raised rectangles.
- It works at laptop size before workstation scaling is considered.
- It remains coherent on mobile when overlap is reduced or removed.
- It preserves readable line length.
- It passes existing integrity, accessibility and Playwright smoke tests.

---

## 10. Decision test before adding any future float

Before implementing a new raised surface, answer these questions:

1. What editorial relationship does the overlap communicate?
2. Why can this information not remain in normal document flow?
3. What media or adjacent section determines its exact placement?
4. How does its lower edge hand off to the following section?
5. How is its geometry distinct from the other Level A surfaces?
6. What happens to it on mobile?
7. Would the page still feel coherent if its shadow were removed?
8. Does adding it make the page more card-heavy than editorial?

If these questions do not have strong answers, **do not float the element**.

---

## 11. Final design intent

The future recomposition phase should make neumACt feel as though the overlapping surfaces are part of an authored institutional publication system, not a collection of fashionable components.

The visual hierarchy should be:

**media → editorial overlap → flat evidence / records → institutional close**

—not:

**hero → floating card → floating card → floating card → footer**.

Floating is an exception used to create hierarchy. Flat editorial flow remains the default architecture of the neumACt public site.


## Relationship to M6.4 responsive contract

This specification governs the **visual ambition** of the future floating phase. `RESPONSIVE_EDITORIAL_COMPOSITION_CONTRACT.md` governs the **responsive safety and compositional boundaries**.

The floating phase may refine:
- overlap depth;
- surface edge treatment;
- asymmetry;
- media/float relationship;
- Publications folio composition;
- Home institutional threshold;
- Team sheet subtlety;
- INIBIC plaque treatment.

It must preserve:
- mobile ≠ compressed desktop;
- laptop ≠ mini workstation;
- 881–1440px anti-stretch calibration;
- mobile typography ceilings;
- workstation Search interaction restraint;
- Contact remaining out of the primary masthead;
- canonical Index/Search state ownership;
- Research normal-flow overlap and Pedro containment;
- semantic reading order;
- existing responsive regression guards.

If a proposed floating treatment cannot satisfy those conditions, the floating treatment must change—not the protected responsive contract.
