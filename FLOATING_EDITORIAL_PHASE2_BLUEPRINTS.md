# Floating Editorial Re-composition — Phase 2 Responsive Blueprints

## Status

**Phase 2 only: implementation-ready responsive composition blueprints. No production CSS/JS changes.**

This document converts the Phase 1 creative audit into the selected page compositions that Phase 3 should implement.

It is subordinate to RESPONSIVE_EDITORIAL_COMPOSITION_CONTRACT.md.

The Phase 2 objective is to remove ambiguity before implementation:
- one selected visual direction per page;
- one defined responsive behaviour per viewport corridor;
- one ownership strategy;
- one regression plan;
- no “we will decide while coding” geometry.

---

## 1. Final selected system

The site will use five deliberately different page identities:

| Page | Selected identity | Selected Phase 1 direction |
| --- | --- | --- |
| Home | Institutional Threshold | Open Editorial Threshold |
| INIBIC | Institutional Material Credential | Architectural Glass Plaque |
| Research | Scientific Split-Sheet | Scientific Margin |
| Publications | Editorial Research Folio | Open Research Folio, borrowing the Journal Leaf edge restraint |
| Team | Quiet Human Sheet | Quiet Open Sheet |
| Innovation | Clinical Process Field | Clinical Process Spine |

Supporting transitions:
- Research → Six research lines: Continuing Scientific Rule + Shared Axis
- Publications → Selección: Rule Continuation + Shared Folio Axis

The site remains predominantly flat. Floating is concentrated in the opening editorial transitions.

---

# PART I — PUBLICATIONS

## 2. Publications final direction — Open Research Folio

Publications receives the strongest recomposition because the subject matter itself is editorial.

The existing structure is retained:

- pub-hero
- pub-hero__media
- pub-hero__panel-wrap
- pub-hero__panel
- pub-hero__identity
- pub-hero__context
- pub-feature / Selección
- flat publication index

No semantic HTML rewrite is required for the primary composition.

### 2.1 Visual concept

The opening should feel like a **research folio crossing the boundary between image and publication index**, not a white application card.

The folio should communicate:
- paper;
- research publishing;
- precision;
- institutional authority;
- controlled asymmetry.

It should not imitate a literal book or journal cover.

### 2.2 Outer geometry

Current behaviour:
- centred broad panel;
- four visible edges;
- rounded corners;
- prominent soft shadow.

Target behaviour:
- folio remains left-biased;
- top edge is strongest;
- left edge is visible but quiet;
- right edge is clean and precise;
- lower edge visually dissolves into the Selección transition;
- radius is near-zero or extremely restrained;
- shadow becomes ambient only.

The surface should read as a **sheet**, not a card.

### 2.3 Internal geometry

Target desktop/laptop balance:
- identity block: approximately 38–42%;
- contextual statement: approximately 58–62%.

The divider is not the visual centre of the sheet.

The Publicaciones title stays dominant but receives a more disciplined width so it does not simply scale with the panel.

Context copy remains bounded to editorial reading measure.

### 2.4 Media relationship

The biomedical/lung image remains active after the folio appears.

The folio should not cover the image so completely that the image becomes decorative wallpaper.

Preferred relationship:
- image supplies texture and respiratory context;
- folio overlaps into the lower image field;
- a meaningful portion of the image remains visible above and around the folio;
- folio placement respects the image’s branching lung structure.

Do not introduce new image assets merely to support the composition.

---

## 3. Publications responsive blueprint

### 3.1 Phone — 390–620

Composition:
- media remains first;
- folio becomes a normal-flow editorial block with only a shallow overlap;
- no desktop-style asymmetric offset that creates side clipping;
- title above context;
- internal divider becomes horizontal or disappears;
- lower edge flows naturally into Selección.

Rules:
- no large shadow;
- no giant title;
- no fixed folio height;
- no horizontal transform positioning;
- no side notch/tab.

The user should perceive:
**image → publication identity → selection**

not:
**image → floating card → selection**

### 3.2 Tablet — 621–880

Composition:
- folio retains modest overlap;
- internal layout may remain stacked until enough width exists for a genuine two-column editorial split;
- edge treatment remains quiet;
- title measure stays controlled.

This corridor must not receive the full laptop composition too early.

### 3.3 Small laptop — 881–1180

Composition:
- two-column folio begins;
- approximate split: 40/60;
- overlap depth remains shallower than workstation;
- panel is deliberately bounded inside the viewport;
- title and context remain visually close enough to read as one opening.

This is the most fragile Publications corridor.

### 3.4 Laptop / desktop — 1181–1440

This is the **primary authored Publications state**.

Composition:
- open folio overlaps image by a deliberate but restrained amount;
- approximately 40/60 internal split;
- left bias is visible;
- folio width remains clearly smaller than the entire canvas;
- right contextual block begins slightly offset from title baseline;
- lower edge visually hands into Selección.

### 3.5 Wide desktop — 1441–1679

Composition expands modestly:
- more breathing room around the folio;
- not larger type;
- title block remains near laptop measure;
- context column gains space but prose width stays bounded.

### 3.6 Workstation — 1680–2048

Workstation rule:
**the canvas grows; the folio does not become giant paper.**

Target:
- folio broadens selectively;
- overall folio width stays governed by composition, not viewport percentage alone;
- title scale remains approximately laptop-like;
- text measure remains fixed/near-fixed;
- image exposure increases around the folio;
- Selección handoff becomes more visible because the page has more room, not because the rule becomes thicker.

---

## 4. Publications → Selección handoff

Selected mechanism:
**Rule Continuation + Shared Folio Axis.**

The folio establishes one horizontal lower rule and one primary left axis.

The Selección heading begins from the same visual system.

Possible implementation:
- pseudo-element on pub-hero__panel or pub-feature;
- lower border becomes visually continuous with pub-section-heading--rule;
- section spacing is reduced enough that the two areas feel related;
- no overlapping heading badge;
- no tab/notch component.

The connection should be perceived more than noticed.

### Regression locks

Protect:
- publication list remains flat;
- feed/search/filter architecture untouched;
- mobile title/context order;
- no horizontal overflow;
- 1024–1366 folio containment;
- 1920–2048 reading measure restraint;
- image crop still meaningful;
- no pseudo-data or decorative metadata.

### Phase 3 tests to add

- folio contained at 1024 / 1366 / 1440 / 2048;
- title and context remain inside folio;
- no horizontal overflow;
- publication feed row geometry unchanged;
- mobile folio is not absolutely positioned;
- folio width at 2048 is not allowed to expand proportionally without bound.

---

# PART II — RESEARCH

## 5. Research final direction — Scientific Margin

Research keeps its existing conceptual architecture.

The sheet remains one integrated scientific surface.

The implementation should change the **hierarchy inside the sheet**, not replace the page.

Existing semantic structure is already ideal:
- research-hero__copy
- research-leadership
- portrait
- scientific lead metadata
- Pedro name / role / bio

No new nested leadership card should be introduced.

### 5.1 Visual concept

The left side is the research programme.

The right side is not “column two”; it is an **academic scientific margin**.

Preferred desktop balance:
- programme: approximately 70–72%;
- leadership margin: approximately 28–30%.

The margin is visibly subordinate but institutionally important.

### 5.2 Scientific margin geometry

Leadership treatment:
- narrower than current proportional relationship;
- divider does not need to span the full sheet;
- Scientific lead / Dirección científica behaves like marginalia;
- portrait and text align to a precise internal axis;
- portrait may interrupt an internal rule very subtly, but must stay fully inside the sheet;
- role/bio measure remains compact.

The programme copy retains visual authority.

### 5.3 Surface geometry

The outer Research sheet remains:
- normal-flow;
- centred/bounded;
- negative-overlap based;
- structurally independent from reveal transforms.

Visual refinement:
- less card-like radius/shadow;
- more edge precision;
- lower edge begins the handoff into the next section.

---

## 6. Research responsive blueprint

### 6.1 Phone — 390–620

Composition:
- programme copy first;
- leadership second;
- leadership separated with a short top rule;
- portrait remains compact;
- no side-by-side scientific margin;
- shallow image-to-sheet overlap only.

The scientific margin idea becomes **scientific annotation below**, not squeezed desktop columns.

### 6.2 Tablet — 621–880

Composition remains primarily stacked.

The tablet must not prematurely become the laptop split-sheet.

Leadership may gain a more horizontal internal arrangement if space allows, but programme and leadership still read sequentially.

### 6.3 Small laptop — 881–1180

This remains the highest-risk Research corridor.

Rules:
- preserve current M6 bounded width;
- programme remains dominant;
- leadership margin begins;
- portrait size remains conservative;
- long Pedro name must not force the sheet outward;
- gap and internal padding shrink before content measure is sacrificed.

### 6.4 Laptop / desktop — 1181–1440

Primary authored Research state:
- approximately 70/30 split;
- leadership divider partial;
- portrait integrated into the margin;
- outer sheet restrained;
- title and lead maintain current reading measure;
- no detached visual card around Pedro.

### 6.5 Wide desktop / workstation — 1441–2048

The outer sheet can grow according to the current workstation rules.

But:
- leadership remains a margin, not a wider panel;
- portrait does not inflate materially;
- name/bio line length stays controlled;
- programme column receives most of any added width;
- title size does not continue scaling indefinitely.

---

## 7. Research → six-line programme handoff

Selected mechanisms:
1. **Continuing Scientific Rule**
2. **Shared Axis**

The sheet establishes a precise axis that is inherited by research-lines__head.

Preferred relationship:
- one subtle line or edge visually continues downward;
- Six research lines aligns with the programme side of the hero sheet;
- explanatory paragraph aligns with a corresponding internal axis;
- the six line records themselves stay untouched and flat.

No overlapping next-section badge.

### Regression locks

Protect:
- Pedro fully inside sheet;
- no transform-owned layout;
- no absolute positioning dependent on image height;
- semantic order unchanged;
- mobile stacked hierarchy;
- six research rows flat;
- 881–1440 anti-stretch;
- workstation reading measure;
- current image loading/crop behaviour unless Phase 3 visual certification demonstrates a needed crop adjustment.

### Phase 3 tests to add/retain

- Pedro containment at 881 / 1024 / 1366 / 1440 / 2048;
- Research sheet containment;
- no horizontal overflow;
- leadership follows programme in DOM;
- mobile leadership is not side-by-side;
- research line rows preserve current list geometry.

---

# PART III — HOME + INIBIC

## 8. Home final direction — Open Editorial Threshold

Home retains its current hero and its hero-to-programme narrative.

The current programme panel is refined into an **open editorial threshold**.

No redesign of the Home hero itself.

### 8.1 Visual concept

The threshold should communicate:
**institution → programme → evidence**

The programme should feel attached to the institution above while opening into the page below.

It should stop reading as a large card containing two modules.

### 8.2 Programme geometry

Selected structure:
- keep programme introduction and six-line matrix inside the same semantic container;
- visually reduce the sense of four closed edges;
- top/left edge carry most of the boundary;
- lower edge softens;
- shadow becomes shallow ambient separation;
- radius becomes minimal;
- line matrix feels like an index printed on the same institutional folio.

This chooses Home A rather than the more radical split Home B.

A small amount of Home B influence is allowed:
the research-line matrix may visually feel less enclosed than the narrative side, but both remain structurally part of the same panel.

### 8.3 Internal relationship

Laptop/desktop:
- intro approximately 32–36%;
- research lines approximately 64–68%;
- stronger editorial axis between them;
- research matrix remains two columns where space genuinely supports it.

Do not make the intro column overly narrow simply to expose more lines.

---

## 9. Home responsive blueprint

### 9.1 Phone — 390–620

- shallow hero overlap;
- programme becomes normal-flow vertical folio;
- intro first;
- research lines below;
- line matrix one column at narrow widths;
- minimal/no obvious shadow;
- lower edge fully dissolves into page.

### 9.2 Tablet — 621–880

- programme remains mostly vertical;
- line matrix may use two columns only if text measure remains comfortable;
- no detached INIBIC object beside it.

### 9.3 Small laptop — 881–1180

- two-part programme threshold begins;
- intro protected from becoming too narrow;
- line matrix retains readable line titles;
- overlap remains smaller than workstation.

### 9.4 Laptop / desktop — 1181–1440

Primary authored Home threshold:
- programme surface visibly overlaps hero;
- low-radius open sheet;
- intro / matrix relationship clear;
- line matrix is disciplined;
- space below is reserved for the INIBIC relationship without creating “card under card”.

### 9.5 Workstation — 1680–2048

- programme gains width, not type scale;
- intro reading measure stays capped;
- matrix gains spacing;
- outer surface does not become excessively tall;
- hero/programme overlap remains proportional.

---

## 10. INIBIC final direction — Architectural Glass Plaque

The current home-affiliation-card semantic aside remains sufficient.

No new semantic container is required.

The Phase 3 task is a material transformation, not a content rewrite.

### 10.1 Material rules

Required:
- official INIBIC mark only;
- translucent background;
- subtle backdrop blur;
- fine cool boundary;
- slight internal top-edge highlight;
- almost no conventional drop shadow;
- compact factual copy;
- no glow;
- no thick frosting;
- no large rounded-corner SaaS aesthetic.

### 10.2 Placement

The plaque belongs to the Home programme composition.

It should read as **institutional accreditation attached to the threshold**, not as an independent content card.

Laptop/desktop:
- docked near lower-right or lower programmatic edge;
- alignment derived from programme panel axes;
- never floating in arbitrary whitespace.

Workstation:
- plaque may become slightly more spatial because more canvas exists;
- still secondary.

### 10.3 Phone

The glass concept must flatten.

Phone behaviour:
- plaque becomes a full-width or near-full-width normal-flow translucent institutional strip;
- no detached corner positioning;
- blur may be reduced for performance/contrast;
- official logo and CTA remain crisp.

### 10.4 Reduced transparency / unsupported backdrop filter

The plaque must remain readable without backdrop-filter.

Fallback:
- high-transparency off-white/very pale institutional tint;
- visible fine border;
- no dependence on background blur for text contrast.

### Regression locks

Protect:
- official mark;
- bilingual copy;
- link target;
- no overlap over research-line links;
- no mobile overflow;
- no low-contrast text;
- Home current-work section position must not jump unpredictably because of plaque positioning.

### Phase 3 tests

- plaque fully contained at 390 / 768 / 1024 / 1440 / 2048;
- CTA visible;
- no overlap with home-programme-lines;
- no horizontal overflow;
- reduced-transparency fallback visually checked manually.

---

# PART IV — TEAM

## 11. Team final direction — Quiet Open Sheet

Team keeps the current conceptual image as the primary emotional moment.

The introduction becomes quieter.

Existing structure is sufficient:
- team-visual-hero
- team-hero
- team-hero__grid
- team-hero__copy
- team-hero__context

### 11.1 Visual concept

The image carries humanity.

The sheet carries orientation.

The sheet should never compete with the image.

Target changes:
- lower overlap depth;
- substantially reduced elevation;
- minimal radius;
- open lower edge;
- narrower overall sheet;
- more visible image around the composition;
- context column feels like a note, not “column two of a card”.

### 11.2 Responsive behaviour

Phone:
- image first;
- intro normal flow;
- nearly flat;
- no pronounced sheet shadow.

Tablet:
- small overlap;
- still predominantly vertical.

Laptop:
- two-column intro returns;
- sheet narrower than current;
- image remains visibly dominant above/around it.

Workstation:
- image gains canvas;
- sheet remains bounded;
- intro/context measures remain laptop-like.

### Regression locks

Protect:
- responsive image sources;
- mobile crop;
- image-first hierarchy;
- leadership/coordinator/roster sections unchanged;
- no person-card redesign;
- no workstation portrait inflation;
- no mobile heading inflation.

### Phase 3 tests

- team hero sheet contained at 768 / 1024 / 1440 / 2048;
- image remains visible above the sheet;
- roster geometry unchanged;
- no horizontal overflow.

---

# PART V — INNOVATION

## 12. Innovation final direction — Clinical Process Spine

Innovation deliberately does not join the floating-surface family.

The hero remains flat.

The project list remains flat.

The new visual intervention is a subtle process axis through the existing four clinical questions:

1. Measure
2. Decide
3. Work
4. Connect

The Phase 1 shorthand of Measure → Decide → Work is expanded here to include the actual fourth existing item, Connect.

### 12.1 Visual concept

The spine communicates continuity of clinical reasoning.

It is not:
- a flowchart;
- a timeline component;
- a wizard;
- four cards.

Possible visual language:
- one thin rule;
- numeric markers already present in the DOM;
- markers sit on or near the rule;
- rule weakens between items rather than using arrows;
- teal used sparingly.

### 12.2 Responsive behaviour

Phone:
- vertical rule;
- each numbered question anchors to the rule;
- normal document flow;
- no fixed heights.

Tablet:
- vertical or two-row treatment depending current question-list geometry;
- never a horizontally overflowing timeline.

Laptop/desktop:
- if questions remain in columns, a subtle horizontal/shared baseline may connect them;
- connection should not overpower the text.

Workstation:
- line extends with composition;
- question text measure does not expand materially.

### Regression locks

Protect:
- Innovation hero;
- long title wrapping;
- existing four questions and order;
- current project list;
- no cards;
- no horizontal overflow at 620–880;
- process spine remains decorative and does not alter semantic reading order.

### Phase 3 tests

- four questions remain present and ordered;
- no overflow at 390 / 620 / 768 / 1024;
- project rows unchanged;
- no raised-card classes/effects introduced.

---

# PART VI — SHARED SYSTEM

## 13. Shared visual vocabulary

Phase 3 may implement the following behaviours:

### Editorial edge
Fine boundary used to establish precision.

### Open lower edge
Surface visually hands into the page below rather than terminating like a card.

### Scientific margin
Research-only narrow leadership composition.

### Folio handoff
Publications-only continuation from hero sheet into Selección.

### Institutional glass plaque
INIBIC-only material treatment.

### Process spine
Innovation-only flat progression cue.

These are not generic reusable components.

Do not create a single “open card” class and apply it everywhere.

---

## 14. Surface hierarchy after Phase 3

### Level A — authored float
- Home programme threshold
- Research split-sheet
- Publications folio

But each has a different geometry.

### Level B — quiet raised/open
- Team introduction

### Special material exception
- INIBIC glass plaque

### Level C — flat
- Home current work
- institutional environment
- six research lines
- study portfolio
- publication selection/feed
- Team leadership/coordinators/roster
- Innovation hero
- Innovation questions/project records
- contact sections

The number of floating surfaces must not increase beyond this without a new explicit design decision.

---

## 15. Typography blueprint

No new font family.

Fraunces + DM Sans + DM Mono remain.

Rules:
- page identity comes from composition, not larger type;
- phone headings stay under M6.4 ceilings;
- workstation does not materially enlarge body type;
- secondary margins use smaller scale, not lighter contrast alone;
- metadata remains mono where already established.

Publications title can remain the strongest editorial wordmark among the recomposed sheets.

Research title remains scientifically direct.

Team title should not become more dramatic than Publications/Research.

---

## 16. Edge / shadow blueprint

Default Phase 3 direction:

- radius: reduce substantially on Level A surfaces;
- border: fine and cool;
- shadow: ambient only;
- no hover lift;
- no animated elevation;
- lower edge may be visually open where the page transition benefits.

Do not globally remove every shadow in one token change.

Surface personality remains page-specific.

---

## 17. Motion blueprint

Phase 3 does not introduce new dramatic motion.

Allowed:
- existing reveal behaviour;
- subtle opacity/translation;
- plaque appearance no more animated than surrounding content.

Do not:
- animate overlap geometry;
- scale sheets;
- animate blur;
- parallax hero media.

Reduced-motion support stays unchanged.

---

# PART VII — IMPLEMENTATION OWNERSHIP

## 18. Expected Phase 3 file ownership

Shared grammar:
- styles/editorial-surfaces.css

Page-specific composition:
- styles/pages/home.css
- styles/pages/clinical.css
- styles/pages/news.css
- styles/pages/team.css
- styles/pages/innovation.css

Special institutional material:
- styles/inibic-affiliation.css

Wide-screen final authority:
- styles/workstation.css

Testing:
- tests/responsive-certification.spec.js
- existing smoke/integrity tests

HTML:
- no HTML change expected for the core recomposition;
- any future HTML change requires explicit justification.

JavaScript:
- no JS change expected for the visual recomposition;
- Index/navigation scripts are out of scope.

---

## 19. Phase 3 implementation order

To limit regression stacking:

1. Publications
2. Research
3. Home programme
4. INIBIC plaque
5. Team
6. Innovation process spine
7. shared cleanup only after page compositions are stable

Each page implementation should:
- change only its relevant stylesheet/shared surface rules;
- add/adjust tests;
- run full CI;
- visually inspect the changed page before starting the next page.

Phase 3 is one implementation phase, but changes should still be committed in page-sized checkpoints.

---

# PART VIII — REGRESSION CERTIFICATION

## 20. Required viewport matrix

Automated behavioural/containment checks:
- 390
- 620
- 768
- 1024
- 1366
- 1440
- 1680
- 2048

Visual certification:
- phone approximately 390;
- laptop 1366 or 1440;
- workstation 1920–2048 when available.

---

## 21. Global non-regression locks

Phase 3 must not regress:

- masthead containment;
- Index / Índice placement;
- Contact remaining out of first-order masthead;
- Index/Search canonical runtime ownership;
- small-phone research-line disclosure;
- tablet full Index research matrix;
- 881–1440 laptop anti-stretch;
- broad workstation Index;
- restrained workstation Search;
- no horizontal overflow;
- reduced motion;
- bilingual visibility rules;
- public API fallbacks;
- smoke-test determinism.

---

## 22. Page-specific acceptance criteria

### Publications
Pass when:
- hero reads as folio, not card;
- image remains part of composition;
- Selección visually inherits folio axis;
- publication list stays flat;
- mobile is simple and normal-flow.

### Research
Pass when:
- programme clearly dominates;
- Pedro reads as scientific margin;
- sheet remains integrated;
- six-line section visually continues from hero;
- Pedro containment survives all widths.

### Home
Pass when:
- programme reads as institutional threshold;
- matrix feels indexed rather than boxed;
- lower edge opens into page;
- hero remains unchanged.

### INIBIC
Pass when:
- plaque feels like institutional material, not glassmorphism;
- official mark stays crisp;
- plaque remains clearly secondary;
- mobile flattening is elegant.

### Team
Pass when:
- image remains the emotional lead;
- intro feels lighter than Research/Publications;
- roster remains flat.

### Innovation
Pass when:
- page still feels flat;
- process questions gain continuity;
- no flowchart/card aesthetic appears.

---

## 23. Explicit rejection criteria

Phase 3 must stop and reconsider if any page begins to show:

- repeated rounded white rectangles;
- increased shadow depth;
- full-width workstation text;
- mobile floating slabs;
- decorative pseudo-science;
- portrait/profile cards inside Research;
- Publication feed cards;
- Team person cards;
- Innovation step cards;
- glass treatment outside INIBIC;
- viewport-specific absolute positioning hacks;
- transform-dependent centring.

---

## 24. Phase 2 decision

The final visual system is deliberately **not uniform**.

Its coherence comes from:
- common typography;
- common institutional colours;
- precision edges;
- restrained materiality;
- consistent responsive discipline;
- flat evidence structures.

Its distinction comes from:
- Home threshold;
- Research scientific margin;
- Publications research folio;
- Team quiet sheet;
- Innovation process spine;
- INIBIC architectural plaque.

This is the blueprint Phase 3 should implement.
