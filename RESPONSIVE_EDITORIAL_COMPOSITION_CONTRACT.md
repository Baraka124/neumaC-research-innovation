# neumACt — Responsive Editorial Composition Contract

## Status

**Canonical governing specification after M6.4.**

This document records the responsive and editorial composition rules established through visual certification and M6.1–M6.3 implementation. It is not a design proposal. Future visual work must preserve these rules unless a later phase explicitly replaces a rule with equivalent or stronger cross-device evidence and regression coverage.

This contract governs:
- shared masthead and Editorial Index / Search;
- mobile, tablet, laptop, desktop and workstation composition;
- typography scaling;
- floating and raised editorial surfaces;
- Research hero / scientific leadership composition;
- media cropping and focal behaviour;
- institutional affiliation treatments;
- future Floating Editorial Re-composition work.

It complements:
- `ARCHITECTURE.md` for technical ownership;
- `DESIGN_PRINCIPLES.md` and `SITE_GUIDE.md` for editorial/visual principles;
- `FLOATING_EDITORIAL_RECOMPOSITION_SPEC.md` for the future floating-surface phase.

When these documents overlap on responsive composition, **this contract takes precedence**.

---

## 1. Governing principle

**Mobile, laptop and workstation are different compositions, not three scales of one composition.**

Responsive behaviour must not be implemented as a single desktop layout continuously enlarged or compressed.

Each corridor has a different job:

- **Phone:** editorial sequence, direct hierarchy, low cognitive load, normal-flow composition.
- **Tablet / small laptop:** transitional composition; neither phone stacking nor workstation breadth may be inherited blindly.
- **Laptop / desktop:** primary authored composition; proportions are deliberately bounded.
- **Wide workstation:** canvas may expand, but reading and interaction measures remain constrained.

The question is never only “does it fit?” The question is also “does it remain proportionally authored at this corridor?”

---

## 2. Certified viewport corridors

The regression suite currently certifies:
- 390px — phone
- 620px — large phone
- 768px — tablet portrait
- 1024px — small laptop
- 1440px — desktop
- 1680px — wide desktop
- 2048px — hospital workstation

Additional visual-review targets should include:
- 360–430px phone corridor
- 881–1024px tablet/small-laptop transition
- 1280–1366px laptop corridor
- 1920px workstation corridor

Breakpoint values are implementation details; the **composition rules** are the durable contract.

---

## 3. Shared masthead contract

### 3.1 Primary navigation

Desktop/laptop primary navigation remains visible above the mobile corridor.

`Index / Índice` is part of the navigation family, not a remote utility. It belongs beside the primary destinations and is separated by a restrained divider/spacing treatment.

The masthead must not reintroduce `Contact` as a first-order primary action. Contact remains available through the Index, footer and contextual page locations.

### 3.2 Mobile Index trigger

On the mobile/tablet Index corridor, the trigger must be explicit: `Index / Índice`.

Do not return to an anonymous hamburger as the primary public navigation metaphor.

The trigger should remain compact and institutional. It must not become a large app-style control or compete with the logo.

### 3.3 Laptop header corridor

The 881–1440px corridor is protected.

Rules:
- navigation must remain contained;
- the brand must retain sufficient room;
- `Equipo → Índice` spacing must remain visibly related, not remote;
- utilities must not force primary navigation into cramped or uneven spacing;
- workstation header geometry must not leak downward into laptop widths.

At 881–1180px, simplification of secondary brand metadata is preferable to squeezing navigation.

### 3.4 Workstation masthead

At 1680–2048px:
- the masthead may broaden;
- text and controls should not scale materially larger merely because the canvas is wider;
- navigation spacing may breathe modestly;
- the overall system must remain recognisably the same masthead, not a separate “large-screen redesign”.

---

## 4. Editorial Index contract

The Editorial Index is one canonical discovery system across the site.

`scripts/site.js` remains the state owner for:
- open / close;
- Index / Search mode;
- focus management;
- language state;
- accessibility state.

Enhancement layers must not create a second state machine.

### 4.1 Phone

The Index becomes a full-height editorial sheet.

Requirements:
- explicit `Index / Índice` trigger;
- sticky institutional mobile head;
- primary destinations appear first;
- primary destination type must not approach page-heading scale;
- Research Lines use progressive disclosure at small-phone widths;
- utilities are tertiary;
- Search and Contact should read as compact end actions, not another long navigation chapter;
- language remains directly reachable;
- duplicate institutional information must not appear in multiple mobile blocks.

Phone opening motion should be quiet and sheet-like. Avoid zoomed-card choreography.

### 4.2 Research-line disclosure

At small-phone widths the six research lines are initially collapsed.

The disclosure must:
- expose the number of available lines;
- preserve keyboard/focus behaviour;
- expand in normal flow;
- provide a route to the overall Research programme;
- never use fixed-height positioning that can clip API-derived labels.

Tablet and desktop retain the full matrix unless visual evidence requires a future breakpoint change.

### 4.3 Tablet transition

The 620–880px corridor must be reviewed as a transition, not assumed to be “large phone”.

Rules:
- do not inherit phone-only disclosure merely because the device is touch-oriented;
- avoid both a long phone-style vertical menu and an over-wide desktop grid;
- no horizontal overflow;
- typography remains below page-heading authority.

### 4.4 Laptop / desktop

The three-part editorial structure remains the preferred desktop organisation:
1. destinations;
2. Research Lines;
3. utilities / latest / institutional context.

The surface must be proportionally bounded. It should not span the laptop viewport simply because space exists.

### 4.5 Wide workstation

The workstation Index folio may remain broad and should preserve the established >1600px large-screen folio regime where appropriate.

However:
- the folio may widen;
- the content hierarchy must not become sparse;
- Search interaction measure must not widen linearly with the folio;
- excessive vertical empty space should be reduced through proportion, not by adding decorative content.

---

## 5. Search contract

Search is a **state of the Editorial Index**, not a separate modal/application.

### Phone
- Search opens within the same editorial sheet.
- Index → Search → Index must preserve focus and state correctly.
- Search results are single-column.
- filter controls may scroll horizontally when needed.
- field and headings remain compact enough for the first viewport.

### Laptop / workstation
The Search input is an interaction measure, not a canvas-width object.

At wide workstation sizes:
- the field remains approximately ≤980px unless a future evidence-based phase deliberately changes that measure;
- filters follow a similar constrained measure;
- results may use a somewhat wider editorial measure;
- the outer Index folio may remain broad.

This distinction is mandatory:

**wide folio ≠ wide search field.**

---

## 6. Typography scaling contract

Typography is governed by hierarchy, not viewport size alone.

### 6.1 Phone ceilings

Mobile navigation and utility typography must never compete with page titles.

For the current Index implementation:
- mobile destination names are capped rather than allowed to scale indefinitely;
- at the smallest certified phone corridor, destination type remains around the low-1rem range rather than display-heading scale.

Future changes must preserve the principle even if exact values evolve.

### 6.2 Page headings

Phone page headings may remain expressive, but:
- no heading should become oversized simply for drama;
- line breaks must remain deliberate;
- long scientific/project titles receive stricter caps than short generic headings;
- body copy remains readable without becoming oversized.

### 6.3 Workstation type

Do not enlarge body copy or controls merely because the viewport is 1920–2048px.

Workstation growth should primarily affect:
- canvas;
- composition width;
- media field;
- inter-column breathing room.

Reading measure and interaction type remain constrained.

---

## 7. Reading measure and content width

**Composition may expand; prose does not expand at the same rate.**

Apply constrained measures to:
- lead paragraphs;
- body copy;
- biographies;
- contextual explanations;
- Search field;
- filter rails;
- dense metadata.

Large empty space is not automatically a defect. It becomes a defect when surface dimensions are governed by the viewport rather than by content hierarchy.

Do not solve empty space by inventing extra copy or decorative modules.

---

## 8. Research hero / Pedro contract

The Research opening is a protected scientific split-sheet composition.

Requirements:
- normal-flow overlap remains the structural strategy;
- essential centring/placement must never depend on `transform`;
- Pedro’s portrait and leadership copy remain contained within the Research sheet at all certified widths;
- leadership is part of the scientific narrative, not a separate profile card;
- laptop widths use bounded sheet proportions rather than workstation breadth;
- mobile reduces overlap and returns to a logical stacked reading sequence;
- portrait focal positioning may change by corridor, but the person must remain fully legible and connected to the content.

The historic off-right failure must never return.

---

## 9. Media contract

Media must be composed per corridor rather than relying only on generic `object-fit: cover`.

For important hero/portrait imagery:
- define a meaningful focal area;
- verify crop at phone, laptop and workstation;
- do not let workstation crops dictate laptop crops;
- preserve faces, clinical subjects and meaningful context;
- do not enlarge media merely to fill unused workstation space.

Photography should contribute to page identity, not act as arbitrary wallpaper behind a white panel.

---

## 10. Floating-surface contract

The site remains predominantly flat institutional editorial flow.

Floating surfaces are exceptions, not defaults.

### Level A — Editorial Float
Use only when overlap communicates hierarchy or page identity.

### Level B — Raised Sheet
Use for compact supporting context.

### Level C — Flat Institutional Flow
Default for lists, indexes, records, metadata, filters, rosters and evidence.

Rules:
- no card wall;
- no repeated white rounded rectangles;
- no hover lift on non-interactive editorial surfaces;
- little dependence on shadow;
- no transform-owned structural positioning;
- mobile may flatten or reduce overlap substantially;
- laptop and workstation may use different overlap proportions.

---

## 11. Device-specific floating behaviour

### Phone
- prefer normal flow;
- restrained negative overlap is acceptable;
- small/no shadow;
- no fixed absolute geometry tied to hero height;
- content order remains semantic.

### Laptop
This is the primary authored float corridor.

- preserve intentional asymmetry;
- keep the surface bounded;
- use media crop and following-section axes to determine placement;
- do not inherit workstation width.

### Workstation
- expand composition selectively;
- preserve meaningful outer margins;
- do not make floats proportionally much wider simply because the viewport is larger;
- text measure remains laptop-like;
- secondary columns must not become oversized.

---

## 12. Page-specific composition identities

### Home — Institutional Threshold
Strongest public-facing float/transition. Subsequent sections remain mostly flat.

### Research — Scientific Split-Sheet
Precise, asymmetric, integrated with Pedro/scientific leadership. The six-line index below remains flatter.

### Publications — Editorial Folio
The best candidate for the future floating recomposition. It should become folio-like, asymmetric and media-aware, not a premium UI card.

### Team — Quiet Raised Editorial Sheet
Human, restrained, image-led. Staff roster remains flat.

### Innovation — Primarily Flat
Do not add floating hero treatment merely for cross-page consistency.

Page-to-page difference is deliberate.

---

## 13. Institutional affiliation / INIBIC contract

Institutional affiliation must feel factual, not promotional.

Use the **official INIBIC mark only**. Never synthesize or redraw institutional identity when official artwork exists.

If a future floating treatment is used for the INIBIC affiliation:
- it must not become a generic card;
- it may use a genuinely translucent plaque / physical-glass treatment;
- translucency should reveal contextual background;
- use a fine edge and restrained internal highlight;
- blur remains subtle;
- traditional shadow should be minimal or nearly absent;
- do not propagate glassmorphism across the site.

This treatment is an exception for one institutional credential, not a new component family.

---

## 14. Text tonal hierarchy

Avoid the “everything is gray” effect.

On light editorial surfaces:
1. **Primary explanatory prose** — dark institutional blue-gray / strong readable ink.
2. **Secondary/context prose** — moderately muted.
3. **Metadata / labels** — lightest allowed tier.

Do not globally blacken all copy.

The distinction must remain visible across Home, Research, Innovation, Publications and Team.

---

## 15. Interaction and motion

Motion is supporting choreography, not spectacle.

Allowed:
- subtle sheet entrance;
- restrained opacity/translation;
- small underline/indicator transitions;
- disclosure height/opacity transitions.

Avoid:
- whole-surface hover lift;
- scaling editorial floats;
- animated shadow expansion;
- parallax that changes reading order or crop unpredictably.

`prefers-reduced-motion` must remain respected.

---

## 16. Technical ownership

Responsive and editorial composition must preserve existing ownership:

- `styles/tokens.css` — shared tokens only.
- `styles/components.css` — canonical shared component/state grammar.
- `styles/editorial-surfaces.css` — shared floating/elevation grammar.
- `styles/mobile-chrome.css` — mobile shared chrome refinement.
- `styles/index-navigation.css` — M6 Index/navigation responsive enhancement.
- `styles/workstation.css` — final 1680+ geometry authority.
- `styles/editorial-rhythm.css` — shared spacing/type rhythm.
- `styles/editorial-hierarchy.css` — shared hierarchy/contrast refinements.
- `styles/editorial-media.css` — shared media discipline.
- page stylesheets — page-specific layout/personality only.
- `scripts/site.js` — canonical Index/Search and shared chrome state.
- `scripts/index-navigation.js` — bounded enhancement only; no competing state owner.

Do not:
- add inline CSS;
- add executable inline JavaScript;
- create another global navigation state machine;
- introduce a broad MutationObserver for Index readiness;
- introduce perpetual polling;
- move workstation-specific geometry into page stylesheets without an explicit architectural refactor.

The current bounded readiness retry in `index-navigation.js` is intentional.

---

## 17. Regression rules

Every substantial responsive or floating change must preserve:
- no horizontal overflow;
- header containment;
- Index containment;
- Search state ownership;
- phone Index → Search → Index interaction;
- tablet research-line visibility contract;
- Research sheet containment;
- Pedro portrait containment;
- workstation Index breadth;
- workstation Search interaction restraint.

New visual work should add tests for newly protected invariants instead of weakening old assertions to accommodate a redesign.

If an existing assertion fails because a visual phase intentionally changes a protected contract, the contract change must be explicit and justified before the test is updated.

---

## 18. Visual certification rule

Automated tests prove containment and behaviour, not visual quality.

Before declaring a major responsive/floating phase complete, visually inspect at minimum:
- one phone;
- one laptop around 1366–1440px;
- one wide workstation when available.

If a workstation screenshot is temporarily unavailable, automated 1680/2048 certification may protect the code temporarily, but the visual review remains pending.

Do not claim a post-change visual state has been certified using an older screenshot.

---

## 19. Rules for the next Floating Editorial Re-composition phase

The future floating phase may change:
- surface edge treatment;
- overlap depth;
- controlled asymmetry;
- media/float relationship;
- section handoff;
- Publications folio structure;
- Team sheet subtlety;
- Home threshold composition;
- INIBIC plaque treatment.

It may **not** casually change:
- mobile Index architecture;
- Contact masthead policy;
- laptop anti-stretch calibration;
- mobile typography ceilings;
- workstation Search measure;
- Research normal-flow structural overlap;
- Pedro containment;
- canonical Index/Search state ownership;
- semantic reading order;
- responsive regression coverage.

The future phase should be visually ambitious **inside this contract**, not by breaking it.

---

## 20. Decision test

Before adding or changing a major surface, answer all five:

1. What hierarchy does this composition communicate?
2. Why should it float instead of remain flat?
3. How does it behave differently on phone, laptop and workstation?
4. What text/interaction measure remains constrained as the canvas expands?
5. Which regression invariant proves the change did not destabilise another corridor?

If those questions do not have clear answers, the surface is not ready to be implemented.
