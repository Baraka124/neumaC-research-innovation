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
