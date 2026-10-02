# Floating Editorial Re-composition — Phase 1 Creative Audit

## Status

**Phase 1 only: visual audit + brainstorming. No production CSS/JS changes.**

This document evaluates the current neumACt public-site compositions against the M6.4 responsive contract and the existing Floating Editorial Re-composition specification.

The purpose is not to make more things float. The purpose is to identify where:
- the current composition is already strong and should be protected;
- a surface only needs refinement;
- a surface should be fundamentally recomposed;
- a floating treatment should be removed or reduced;
- a new editorial transition could add meaning;
- a new idea would violate the responsive system and should therefore be rejected before implementation.

All Phase 2 decisions must preserve RESPONSIVE_EDITORIAL_COMPOSITION_CONTRACT.md.

---

## 1. Site-wide diagnosis

The current site has reached a strong institutional baseline. The remaining visual limitation is not lack of polish. It is **repetition of one premium surface formula**:

> image / visual field → white raised rectangle → content → next section

That formula is successful on its own, but when repeated across Home, Research, Publications and Team it weakens page identity.

The next visual leap should therefore come from:
- authored transitions rather than more components;
- different page-specific surface grammars;
- stronger relationship between media, sheet and following section;
- more use of edges, rules, axes and open surfaces;
- less dependence on radius and shadow;
- controlled asymmetry;
- deliberate flatness around the rare floating moments.

The site should remain predominantly Level C flat institutional flow.

---

## 2. Classification matrix

| Area | Decision | Phase 1 diagnosis |
| --- | --- | --- |
| Home hero | KEEP | Strong institutional opening; image, type and navy field already work |
| Home programme threshold | REFINE / PARTIAL RECOMPOSE | Correct concept, but still reads too much as a self-contained premium panel |
| Home INIBIC affiliation | RECOMPOSE | Current secondary card feels appended below another card |
| Home current work | KEEP / REFINE | Flat contrast between publication and innovation is valuable |
| Home institutional environment | KEEP FLAT | Credibility benefits from restraint |
| Research hero + Pedro | KEEP CONCEPT / RECOMPOSE INTERNALLY | Strongest protected idea; needs more authored scientific asymmetry |
| Research → six lines handoff | NEW OPPORTUNITY | Transition can communicate programme → structure without another surface |
| Six research lines | KEEP FLAT | Scientific index is already the correct counterweight |
| Innovation hero | KEEP PRIMARILY FLAT | Directness is a page identity, not a deficiency |
| Innovation process | REFINE FLAT | Potential for a subtle process spine, not elevation |
| Publications hero | MAJOR RECOMPOSE | Current rounded panel is the clearest generic-card moment |
| Publications → Selección | MAJOR NEW OPPORTUNITY | Current handoff is visually abrupt |
| Team visual hero | KEEP | Photography should retain emotional authority |
| Team intro sheet | QUIET RECOMPOSE | Needs less surface weight and more image relationship |
| Team roster | KEEP FLAT | Floating roster/person cards would weaken the institutional tone |
| Contact / enquiry sections | KEEP FLAT | No hierarchy is gained by floating them |

---

## 3. Home — Institutional Threshold

### Current strengths

The Home opening already has one of the site's strongest narratives:

1. institutional respiratory image;
2. large research/innovation statement;
3. raised Programa neumACt threshold;
4. six-line programme structure;
5. current work;
6. institutional environment.

The hero itself should remain structurally intact.

### Current weakness

The current programme panel is a conventional closed raised surface:
- white background;
- visible four-sided boundary;
- radius;
- soft shadow;
- contained two-column interior.

It works, but the eye still reads **hero → card**.

The separate INIBIC affiliation card then introduces a second floating rectangle directly below it, which compounds the card pattern.

### Creative directions to carry into Phase 2

#### A. Open programme sheet
Retain the overlap, but make the programme threshold feel more like an editorial folio:
- reduce or remove conventional radius;
- reduce dependence on shadow;
- allow one edge to visually dissolve into the page;
- use a precise rule/axis to connect the introduction and line matrix;
- let the research-line index feel like programme structure rather than content inside a box.

#### B. Partial-sheet programme
More radical option:
- programme identity and narrative sit on the raised sheet;
- research-line matrix visually continues into the page field;
- the threshold becomes a transition, not a container.

This is worth testing in Phase 2 because it would immediately reduce the “large white card” vocabulary.

#### C. INIBIC architectural plaque
Replace the current appended card treatment with a unique institutional credential:
- official INIBIC mark only;
- translucent physical-glass-like plaque;
- fine edge;
- restrained internal highlight;
- subtle blur/refraction;
- almost no conventional shadow;
- no generic rounded SaaS glassmorphism.

This treatment must remain unique to INIBIC and must not become a reusable glass-card system.

### Regression locks

Do not disturb:
- Home hero readability and existing laptop height calibration;
- six-line programme availability;
- current-work flat composition;
- mobile vertical reading order;
- mobile typography ceilings;
- 1024–1440 anti-stretch behaviour;
- 1680+ workstation composition rules.

Any Phase 2 Home proposal must explicitly show phone, laptop and workstation variants before implementation.

---

## 4. Research — Scientific Split-Sheet

### Current strengths

Research is the composition with the strongest existing conceptual foundation:
- hero media establishes scientific context;
- one integrated sheet contains programme identity and scientific leadership;
- Pedro is structurally part of the programme narrative;
- normal-flow negative overlap prevents the historic transform/off-right failure;
- the six-line programme below remains flat.

The concept should be preserved.

### Current weakness

The current split still behaves like two fairly conventional UI columns:
- programme copy;
- full-height divider;
- leadership block.

The surface itself is still a regular closed white rectangle.

### Creative direction: scientific margin

Recompose the leadership area as a **scientific editorial margin** rather than a second card-like column.

Possible characteristics:
- stronger 70/30 or 72/28 asymmetry;
- divider shorter than the full sheet height;
- portrait deliberately breaks one alignment axis;
- Dirección científica behaves like marginalia;
- name/role hierarchy feels like an academic folio;
- leadership remains visibly integrated, never nested.

The left programme narrative remains dominant.

### New transition opportunity: sheet → six-line index

The hero sheet should establish a structural axis that the six-line programme inherits.

Possible mechanisms:
- a rule from the sheet continues into the research-line heading;
- the research-line media column aligns with a sheet axis;
- the lower sheet edge terminates deliberately into the next section rule;
- a title baseline or left rail is shared across both sections.

Goal:

> programme identity → programme structure

not:

> hero panel → unrelated next section

### Regression locks

Non-negotiable:
- no transform-owned structural positioning;
- Pedro portrait remains fully inside the sheet at all certified widths;
- 881–1440 laptop proportions remain bounded;
- phone returns to logical stacked reading order;
- semantic DOM order remains unchanged;
- six-line rows remain Level C flat;
- no nested profile card;
- no new absolute positioning dependent on hero height.

This page carries the strongest regression risk and should receive the strictest Phase 3 test coverage.

---

## 5. Publications — Editorial Research Folio

### Current strengths

The page already has:
- strong biomedical image field;
- large serif Publicaciones identity;
- useful contextual explanation;
- clean Selección section below;
- a publication index that is correctly flat.

### Current weakness

The current hero panel is the clearest example of the repeated premium-card formula:
- large white rounded rectangle;
- broad shadow;
- centred internal split;
- discrete end before Selección.

The image therefore reads partly as wallpaper behind the component.

### Major creative direction: research folio

Publications should become the most editorially authored float on the site.

Potential Phase 2 explorations:
- sharper or asymmetric edge treatment;
- reduced radius;
- very shallow/no conventional shadow;
- 38/62 or 40/60 internal split;
- divider placed by hierarchy, not centre;
- panel position determined by the lung-image crop/negative space;
- one visually open edge;
- publishing-like paper/folio logic rather than application-panel logic.

### Major transition opportunity: folio → Selección

The current gap between hero panel and Selección should become an authored handoff.

Promising mechanisms:
- bottom folio rule continues into the Selección heading rule;
- lower folio edge visually dissolves into the white section;
- title axis carries directly into the selection index;
- a small metadata rail may bridge the two only if it represents real information.

Do not invent decorative pseudo-data merely to make the design feel editorial.

### Regression locks

Protect:
- publication page reading measure;
- mobile single-column hierarchy;
- publication index remains flat;
- no additional floating cards in the publication list;
- laptop panel remains bounded;
- workstation growth expands composition, not text;
- image crop remains meaningful at 390 / 1366–1440 / 2048.

This page is the best candidate for the most substantial Phase 3 visual change.

---

## 6. Team — Quiet Human Sheet

### Current strengths

The conceptual image already provides a human/emotional opening. The roster and leadership lists are correctly flat.

### Current weakness

The Team intro remains a large rounded raised sheet. Even though it is intentionally quieter than Research/Publications, it still participates in the same visual family.

### Creative direction

Keep photography first and make the introduction feel lighter:
- substantially lower elevation;
- smaller/less obvious overlap;
- weaker radius/shadow;
- potentially open lower edge;
- narrower text sheet;
- deliberate image exposure beside or behind the introduction;
- warm paper/off-white relationship rather than a generic floating card.

The Team page should be the quietest major surface treatment.

### Regression locks

Protect:
- photography as the dominant opening moment;
- mobile content order;
- portrait/image crop consistency;
- roster stays flat;
- no person card system;
- no increased mobile heading scale;
- no workstation portrait inflation.

---

## 7. Innovation — Clinical Process Field

### Current strengths

Innovation is valuable precisely because it does **not** depend on a floating hero.

The direct split hero, large serif statement and current textual/process sections give it a distinct identity.

### Decision

Do not add a floating hero merely for cross-page consistency.

### Creative opportunity

Explore a flat **process spine** through the clinical reasoning sequence:
- Measure;
- Decide;
- Work.

Possible treatment:
- one quiet longitudinal rule/axis;
- restrained progression cue;
- no icons required;
- no flowchart UI;
- no elevated step cards.

The Innovation page should remain the proof that “premium” does not require floating.

### Regression locks

Protect:
- current flat hero structure;
- long-title wrapping;
- phone typography ceilings;
- existing project list remains flat;
- no added surface family.

---

## 8. INIBIC — One-off institutional material language

The affiliation treatment deserves a unique material language because it represents institutional provenance, not content hierarchy.

The official mark is mandatory.

### Preferred Phase 2 direction

**Architectural glass plaque**, not glassmorphism.

Qualities:
- genuinely translucent;
- background context remains visible;
- fine cool edge;
- minimal radius;
- restrained blur;
- tiny internal highlight;
- almost no traditional shadow;
- crisp official logo and type;
- compact factual copy.

### Reject

- frosted SaaS card;
- neon glow;
- large blur;
- floating stack of institutional cards;
- synthetic/redrawn institutional logos;
- using the same glass treatment elsewhere.

### Regression locks

Protect:
- official INIBIC artwork;
- readable contrast;
- no mobile overflow;
- no overlap obscuring programme links/content;
- affiliation remains secondary to the neumACt programme;
- fallback/static copy should remain semantically equivalent to dynamic copy.

---

## 9. New visual language candidate: editorial edges

Phase 1 strongly supports exploring **edges rather than shadows** as a neumACt signature.

Potential vocabulary:
- 1px rules;
- interrupted rules;
- one edge continuing into the next section;
- a portrait crossing an internal axis;
- an open surface missing one conventional boundary;
- fine glass-plaque edge;
- aligned section/title baselines.

Why it fits:
- precision;
- documentation;
- evidence;
- scientific publishing;
- clinical restraint.

This could create depth and continuity without increasing decoration.

---

## 10. New structural language candidate: open surfaces

A surface does not always need four visually closed sides.

Promising uses:
- Publications folio bottom edge dissolves into Selección;
- Home programme identity remains raised while research-line structure visually continues into the page;
- Team introduction may have a visually open lower edge;
- Research sheet may use an internal scientific margin rather than full-height divider.

Open surfaces should be tested carefully against accessibility and mobile normal-flow requirements.

---

## 11. Rejected directions before Phase 2

Do not explore:
- floating cards for research-line rows;
- floating cards for publications;
- floating person/roster cards;
- floating innovation projects;
- site-wide glassmorphism;
- more shadows as a substitute for composition;
- giant mobile headlines;
- workstation-only visual drama that damages laptop geometry;
- decorative pseudo-scientific graphics;
- transform-based essential layout;
- new Contact masthead treatment.

These directions conflict with the established site identity or M6.4 contract.

---

## 12. Phase 2 composition targets

Phase 2 should produce responsive blueprints—not code—for five identities:

### Home
**Institutional Threshold**
- programme surface: refine or partially open;
- INIBIC: one-off architectural plaque.

### Research
**Scientific Split-Sheet**
- programme dominant;
- Pedro as scientific margin;
- authored handoff into six-line index.

### Publications
**Editorial Research Folio**
- most substantial recomposition;
- asymmetric paper/folio logic;
- direct handoff into Selección.

### Team
**Quiet Human Sheet**
- photography dominant;
- minimal raised treatment;
- roster remains flat.

### Innovation
**Clinical Process Field**
- intentionally flat;
- potential process spine;
- no float added.

For each identity, Phase 2 must show:
- phone;
- 1024 small laptop;
- 1366/1440 laptop;
- 1680 wide desktop;
- 1920/2048 workstation.

---

## 13. Regression gate for all future phases

No Phase 2 concept is eligible for implementation unless it can answer:

1. What current strength is preserved?
2. What exact design problem is being solved?
3. Why is a float/overlap necessary here?
4. What becomes flatter or simpler to compensate?
5. How does the composition differ on phone, laptop and workstation?
6. What reading/interaction measure remains constrained?
7. Which current regression invariant could this idea threaten?
8. What new test or visual check will protect the changed invariant?

### Existing protected invariants

At minimum preserve:
- no horizontal overflow;
- masthead containment;
- explicit mobile Index / Índice;
- Contact out of primary masthead;
- Index/Search canonical state ownership;
- phone Index → Search → Index behaviour;
- small-phone research-line disclosure;
- tablet full research-line matrix;
- laptop anti-stretch corridor;
- Research normal-flow overlap;
- Pedro portrait containment;
- workstation broad Index folio;
- workstation Search interaction restraint;
- mobile typography ceilings;
- reduced-motion support.

A visual idea that requires weakening these protections must be rejected or redesigned before implementation.

---

## 14. Phase 1 conclusion

The site does **not** need more floating design.

It needs a smaller number of more authored transitions.

Priority for Phase 2:
1. Publications — strongest recomposition opportunity.
2. Research — strongest protected concept, refine internally.
3. Home — refine threshold and replace appended affiliation-card logic.
4. Team — reduce surface weight.
5. Innovation — preserve flatness and explore process continuity.

The most promising shared visual vocabulary is not “premium cards”. It is:

> **editorial edges + controlled asymmetry + open surfaces + media-aware overlap + deliberate section handoff**

That vocabulary should be explored in Phase 2 while each page retains its own identity.


---

## 15. Phase 1B — Competing visual directions

The purpose of this section is to avoid locking onto the first attractive solution.

Each page gets multiple directions. Some are deliberately conservative, some more architectural. Phase 2 should carry forward only the options that create a clearer editorial relationship without violating the responsive contract.

---

## 16. Home alternatives — Institutional Threshold

### Home A — Open Editorial Threshold

**Idea**

Keep the existing hero-to-programme overlap, but convert the current closed raised panel into an editorial sheet with fewer visible boundaries.

Desktop/laptop:
- programme narrative remains on the left;
- six research lines remain on the right;
- top and left edges are strongest;
- lower edge visually softens into the page;
- radius becomes almost imperceptible;
- shadow is reduced to ambient separation only;
- a thin editorial rule aligns the programme introduction with the research-line matrix.

Phone:
- no large floating slab;
- normal-flow programme block with a shallow overlap from the hero;
- lines become a disciplined vertical index;
- no edge effects that create horizontal cropping.

Workstation:
- wider composition is allowed;
- prose measure remains nearly laptop-like;
- the line matrix gains breathing room, not larger text.

**Strength**

Strongest evolution of what already works. Low conceptual risk, high refinement value.

**Regression risk**

Low to medium. Main danger is over-widening the matrix at 1024–1440 or reintroducing a giant surface on mobile.

**Carry forward**

YES. This should be the default Phase 2 Home direction.

---

### Home B — Partial Sheet + Programme Field

**Idea**

Split the current programme panel conceptually into two layers:

- left: raised/open programme identity sheet;
- right: six-line research programme lives directly on the page field.

The two still share axes and spacing so they read as one composition.

Desktop/laptop:
- programme sheet overlaps hero;
- line matrix begins slightly lower and visually continues beyond the sheet;
- one rule from the programme sheet becomes the top rule of the line matrix.

Phone:
- both collapse back into one normal-flow sequence;
- no side-by-side “floating + flat” trick on narrow widths.

Workstation:
- sheet remains intentionally narrower than the research-line field;
- stronger asymmetry is permitted.

**Strength**

This is the most distinctive Home option. It immediately breaks the “white box contains everything” pattern.

**Regression risk**

Medium to high. The split can become awkward at 1024–1180 and may create perceived imbalance if the line matrix floats too far from the programme identity.

**Carry forward**

YES, but as an exploratory Phase 2 alternative to Home A rather than the default.

---

### Home C — Docked Programme Ledger

**Idea**

Remove most of the floating illusion and dock the programme directly against the bottom of the hero, using a strong editorial rule instead of a floating sheet.

**Strength**

Extremely institutional and restrained.

**Weakness**

It may over-correct and remove one of the strongest moments on the homepage.

**Regression risk**

Low technically, but high identity risk.

**Carry forward**

NO as primary direction. Keep only as a reference if A/B still feel too card-like.

---

## 17. INIBIC alternatives — institutional credential

### INIBIC A — Architectural Glass Plaque

**Idea**

A thin physical-glass-like plaque sits adjacent to or partly over the Home programme threshold.

Visual logic:
- transparent enough to reveal background;
- subtle blur/refraction;
- crisp official INIBIC mark;
- fine cool edge;
- tiny internal highlight;
- very small or no traditional shadow;
- restrained factual copy.

Phone:
- plaque becomes a normal-flow translucent strip or lightly separated block;
- no detached floating corner object.

Laptop:
- docked to the programme composition, never hanging randomly in empty space.

Workstation:
- may appear slightly more spatial, but remains secondary.

**Strength**

Potentially the most distinctive institutional detail on the site.

**Regression risk**

Medium. Contrast, blur performance, and positioning near the programme threshold require careful testing.

**Carry forward**

YES. Preferred INIBIC direction.

---

### INIBIC B — Etched Institutional Rail

**Idea**

No floating plaque. INIBIC appears as a slim translucent horizontal or vertical rail attached to the programme edge, like etched signage.

**Strength**

Even more restrained and less card-like.

**Weakness**

Could make the official mark too small or visually underpowered.

**Regression risk**

Low to medium.

**Carry forward**

YES as fallback if Glass Plaque A feels too decorative.

---

### INIBIC C — Conventional Raised Credential

**Idea**

Keep the current compact card but refine radius/shadow/type.

**Strength**

Safe.

**Weakness**

Does not solve the underlying “card beneath card” problem.

**Carry forward**

NO.

---

## 18. Research alternatives — Scientific Split-Sheet

### Research A — Scientific Margin

**Idea**

Preserve one integrated sheet, but make Pedro’s side behave like an academic marginal column.

Desktop/laptop:
- approximately 70/30 or 72/28 balance;
- programme copy is dominant;
- leadership block narrower;
- divider is partial rather than full-height;
- portrait can slightly interrupt a rule or axis;
- “Dirección científica” reads like marginalia.

Phone:
- leadership moves below programme copy in normal flow;
- divider becomes a short top rule;
- portrait remains compact and contained.

Workstation:
- programme side may gain canvas;
- leadership side remains intentionally narrow.

**Strength**

Best refinement of the existing Research concept. Preserves identity while making it much more authored.

**Regression risk**

Medium. Pedro containment and laptop 1024–1440 proportions remain the critical guard.

**Carry forward**

YES. Preferred Research direction.

---

### Research B — Offset Scientific Ledger

**Idea**

The programme identity remains on the main sheet, but Pedro’s leadership block is slightly offset vertically inside the same surface, beginning lower than the title.

This creates a more journal-like hierarchy without changing DOM order.

**Strength**

Elegant, restrained, easier than a more radical layout.

**Weakness**

If offset is too small it becomes visually meaningless; too large and it looks accidental.

**Regression risk**

Medium.

**Carry forward**

YES as a secondary variant to test inside Phase 2.

---

### Research C — Portrait Edge Break

**Idea**

Pedro’s portrait intentionally crosses one internal edge/rule of the sheet while still remaining fully inside the outer surface.

**Strength**

Could create a memorable scientific portrait gesture.

**Weakness**

Easy to drift into magazine/profile styling rather than institutional research.

**Regression risk**

High on responsive widths.

**Carry forward**

NO as a primary route. A very subtle version may be borrowed by Research A.

---

## 19. Research → six-line transition alternatives

### Transition A — Continuing Scientific Rule

A fine vertical or horizontal rule established in the Research sheet continues into the six-line programme heading.

**Strength**

Very low decoration, high continuity.

**Carry forward**

YES. Preferred.

### Transition B — Shared Axis

The research-line media column, heading axis, or metadata rail aligns exactly with one internal sheet axis.

**Strength**

Architecturally strong and almost invisible.

**Carry forward**

YES. Can coexist with Transition A.

### Transition C — Overlapping next-section label

The six-line heading partially overlaps the hero sheet boundary.

**Strength**

More dramatic.

**Weakness**

Risks introducing another floating moment.

**Carry forward**

NO unless Phase 2 proves it can remain extremely restrained.

---

## 20. Publications alternatives — Editorial Research Folio

### Publications A — Open Research Folio

**Idea**

Transform the current white hero panel into a paper-like editorial folio:
- shallow or zero radius;
- reduced shadow;
- one visually open edge;
- asymmetric 38/62 or 40/60 internal structure;
- divider positioned by content hierarchy;
- title block deliberately narrower;
- context begins slightly higher/lower than title baseline.

The folio still overlaps the biomedical image but no longer looks like a UI card.

Phone:
- normal-flow white editorial block;
- image remains above;
- no heavy overlap;
- title and context become one vertical publication opening.

Laptop:
- primary authored state;
- strongest asymmetry;
- panel remains bounded.

Workstation:
- panel may widen moderately;
- text measures remain capped;
- biomedical image remains visually active around the folio.

**Strength**

Strongest overall Publications direction and most compatible with the page’s subject matter.

**Regression risk**

Medium.

**Carry forward**

YES. Preferred.

---

### Publications B — Journal Leaf

**Idea**

Treat the opening like a journal leaf laid across the image:
- slightly offset left/right;
- thin top and side rules;
- lower edge nearly disappears into the page;
- subtle “paper” tonal difference from the background;
- almost no shadow.

The word Publicaciones becomes the dominant printed gesture.

**Strength**

More distinctive than A; potentially beautiful.

**Weakness**

Can become too stylised if paper metaphors are pushed too far.

**Regression risk**

Medium to high.

**Carry forward**

YES as the ambitious alternative.

---

### Publications C — Split Image/Folio Handoff

**Idea**

The biomedical image and editorial content share the hero horizontally rather than vertically. The folio partly overlaps into the image field and directly aligns with Selección below.

**Strength**

Breaks the current formula completely.

**Weakness**

Could become too much like Innovation’s split hero and reduce page distinction.

**Regression risk**

High, especially 1024–1366.

**Carry forward**

NO as primary. Keep only as a fallback if A/B cannot create enough distinction.

---

## 21. Publications → Selección transition alternatives

### Transition A — Rule Continuation

The lower edge/rule of the folio continues into the Selección section heading.

**Carry forward**

YES. Preferred.

### Transition B — Shared Folio Axis

The title block’s left axis becomes the publication-list title axis below.

**Carry forward**

YES. Should be combined with A.

### Transition C — Selection tab / notch

A small notch or tab visually links the folio to Selección.

**Weakness**

Too component-like and risks looking like application UI.

**Carry forward**

NO.

---

## 22. Team alternatives — Quiet Human Sheet

### Team A — Quiet Open Sheet

**Idea**

Keep the current photograph and intro sequence, but reduce the sheet to a quiet paper field:
- much lower elevation;
- smaller overlap;
- reduced radius;
- one visually open edge;
- no dramatic shadow;
- context column remains restrained.

Phone:
- almost fully normal flow;
- photograph first, copy second.

Laptop:
- small overlap remains;
- intro field deliberately narrower than current.

Workstation:
- image gets more breathing room;
- sheet does not simply scale up.

**Strength**

Strongest Team direction because it preserves the human image as the emotional lead.

**Regression risk**

Low to medium.

**Carry forward**

YES. Preferred.

---

### Team B — Caption Rail

**Idea**

Instead of a large sheet, use a narrow editorial rail below/alongside the image, with the main Team heading and short lead occupying the page field.

**Strength**

Very distinctive and less card-like.

**Weakness**

Could weaken the hierarchy of the Team title and make the opening feel fragmented.

**Regression risk**

Medium.

**Carry forward**

YES as an exploratory alternative.

---

### Team C — Full Bleed Editorial Overlay

**Idea**

Place much of the Team intro directly over the photograph.

**Weakness**

Readability, crop dependence and accessibility risk are too high.

**Carry forward**

NO.

---

## 23. Innovation alternatives — Clinical Process Field

### Innovation A — Clinical Process Spine

**Idea**

Keep the existing flat hero and section flow, but connect Measure → Decide → Work with one quiet scientific progression line.

The spine should behave more like an editorial axis than a flowchart.

Desktop/laptop:
- line may shift from vertical to horizontal depending section geometry;
- labels remain text-led.

Phone:
- one simple vertical progression rule;
- no diagram complexity.

**Strength**

Gives Innovation a distinct signature while preserving flatness.

**Regression risk**

Low.

**Carry forward**

YES. Preferred.

---

### Innovation B — Section Pulse

**Idea**

Rather than a continuous spine, each process section begins with a short repeated rule/marker that visually “pulses” through the page.

**Strength**

Even more restrained.

**Weakness**

May be too subtle to create meaningful identity.

**Carry forward**

YES as fallback.

---

### Innovation C — Raised Process Steps

**Idea**

Each Measure / Decide / Work stage becomes a raised card.

**Carry forward**

NO. Explicitly rejected.

---

## 24. Shared compositional vocabulary to test in Phase 2

Phase 1B suggests a restrained shared vocabulary across pages:

### Editorial edge
A precise 1px boundary or rule that establishes hierarchy.

### Interrupted edge
A rule deliberately broken by a portrait, label or transition.

### Open surface
A sheet whose visual hierarchy does not depend on four closed edges.

### Scientific margin
A narrow secondary column behaving like academic marginalia rather than a UI sidebar.

### Folio handoff
A surface edge or axis that continues directly into the next section.

### Institutional glass plaque
A one-off INIBIC treatment with physical translucency, not reusable glassmorphism.

### Process spine
A flat editorial progression cue for Innovation.

These are **behaviours**, not generic components. They should not be mechanically reused on every page.

---

## 25. Phase 1B shortlist

The strongest directions to carry into Phase 2 are:

| Page | Primary direction | Secondary direction |
| --- | --- | --- |
| Home | Open Editorial Threshold | Partial Sheet + Programme Field |
| INIBIC | Architectural Glass Plaque | Etched Institutional Rail |
| Research | Scientific Margin | Offset Scientific Ledger |
| Research handoff | Continuing Scientific Rule + Shared Axis | — |
| Publications | Open Research Folio | Journal Leaf |
| Publications handoff | Rule Continuation + Shared Folio Axis | — |
| Team | Quiet Open Sheet | Caption Rail |
| Innovation | Clinical Process Spine | Section Pulse |

Phase 2 should not attempt every option. It should compare the primary and secondary routes visually and choose one system per page.

---

## 26. Regression matrix for Phase 2 blueprints

### Home
Fragile corridors:
- 1024–1180 programme split;
- 1366–1440 hero/programme proportion;
- mobile programme stacking.

Must test:
- no line-matrix overflow;
- no INIBIC overlap with programme links;
- no oversized workstation panel.

### Research
Fragile corridors:
- 881–1180;
- 1366–1440;
- mobile leadership stacking.

Must test:
- Pedro fully contained;
- no transform layout dependency;
- leadership never becomes a detached profile card;
- six-line index remains flat.

### Publications
Fragile corridors:
- 1024–1366;
- mobile title/context flow;
- 1920–2048 folio breadth.

Must test:
- title/context remain readable;
- folio does not become giant workstation paper;
- Selección handoff does not create overlap clipping;
- publication rows remain untouched.

### Team
Fragile corridors:
- 768–1024;
- mobile image crop;
- 1680+ sheet width.

Must test:
- image remains primary;
- no oversized sheet;
- roster untouched.

### Innovation
Fragile corridors:
- long title on phone;
- process spine at 620–880 transition.

Must test:
- no new cards;
- no horizontal process overflow;
- progression cue remains decorative and accessible.

### INIBIC
Fragile corridors:
- small phone width;
- contrast over variable background;
- placement relative to Home programme.

Must test:
- official mark remains crisp;
- readable contrast;
- plaque never obscures programme content;
- reduced-transparency fallback remains legible if backdrop-filter support is limited.

---

## 27. Phase 1B conclusion

The strongest creative direction is now clearer:

- Home should become **more open**, not more decorated.
- Research should become **more scientific**, not more dramatic.
- Publications should become **more editorial**, not more card-like.
- Team should become **quieter**, not more premium-looking.
- Innovation should become **more continuous**, not more elevated.
- INIBIC should become **more material/institutional**, not another card.

The site can therefore gain visual sophistication while actually using **fewer conventional floating signals**.

Phase 2 should now convert these shortlisted directions into responsive composition blueprints before any production implementation.
