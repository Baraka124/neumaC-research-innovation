# Floating Editorial Re-composition — Phase 3 Implementation Baseline

## Status

**Canonical implementation baseline after Phase 3.**

This document records what is now implemented in production-facing CSS and protected by automated regression coverage.

Phase 3 is complete when this baseline is merged and green.

No further page-specific recomposition should occur before Phase 4 visual certification unless a regression requires it.

---

## 1. Implemented page identities

### Publications — Open Research Folio
Implemented in:
- `styles/pages/news.css`
- `styles/workstation.css`

Protected characteristics:
- sharper/open folio geometry;
- restrained shadow/radius;
- asymmetric identity/context split;
- direct visual handoff into Selección;
- phone normal-flow flattening;
- workstation width restraint;
- publication feed remains flat.

### Research — Scientific Margin
Implemented in:
- `styles/pages/clinical.css`
- `styles/workstation.css`

Protected characteristics:
- normal-flow Research split-sheet retained;
- programme remains dominant;
- Pedro remains an integrated scientific margin;
- no detached profile card;
- no transform-owned structural positioning;
- continuing axis into six research lines;
- laptop anti-stretch retained.

### Home — Open Editorial Threshold
Implemented in:
- `styles/pages/home.css`
- `styles/workstation.css`

Protected characteristics:
- Home hero unchanged;
- programme threshold made more open and editorial;
- safe stack below 1100px retained;
- six-line index remains complete;
- workstation growth increases breathing room rather than type scale.

### INIBIC — Architectural Glass Plaque
Implemented in:
- `styles/inibic-affiliation.css`

Protected characteristics:
- exact official embedded INIBIC mark retained;
- one-off translucent material treatment;
- restrained blur and near-shadowless edge;
- phone normal-flow flattening;
- non-backdrop-filter fallback remains readable;
- treatment must not propagate elsewhere.

### Team — Quiet Open Sheet
Implemented in:
- `styles/pages/team.css`
- `styles/workstation.css`

Protected characteristics:
- photography remains emotional lead;
- intro surface lighter, narrower and less elevated;
- phone/tablet remain stacked;
- workstation sheet remains bounded;
- leadership, coordinators, roster and public profile architecture unchanged.

### Innovation — Clinical Process Spine
Implemented in:
- `styles/pages/innovation.css`

Protected characteristics:
- hero remains flat;
- four prompts remain semantic articles;
- Measure → Decide → Work → Connect connected by editorial spine only;
- desktop/tablet horizontal progression;
- phone vertical progression;
- no cards, arrows, icons or raised process steps;
- project records remain flat.

---

## 2. Authoritative cascade ownership

Phase 3 deliberately uses later page-scoped overrides rather than rewriting every historical base declaration.

This is intentional.

Authoritative rules are:

- page stylesheet Phase 3 block = final page-specific composition;
- `styles/workstation.css` Phase 3 block = final 1680+ authority where present;
- `styles/inibic-affiliation.css` Phase 3 block = final INIBIC material authority;
- existing base/page rules remain fallback and shared structural grammar;
- print rules remain untouched.

Do not delete earlier declarations solely because a Phase 3 selector overrides them later. Remove them only if a future cleanup proves they are unreachable across every supported corridor and print mode.

---

## 3. Why no broad CSS deletion was performed

The consolidation audit found:
- exactly one Phase 3 identity block per page/system;
- no duplicate Phase 3 implementations;
- older rules still provide base geometry, fallback behaviour, or print/intermediate support;
- repeated media-query blocks are layered responsive ownership, not accidental duplication.

Therefore Phase 3 consolidation intentionally avoids speculative deletion.

This is a regression-first decision.

---

## 4. Regression coverage now protecting Phase 3

The responsive certification suite now protects:

### Publications
- folio containment from 390 to 2048;
- mobile normal flow;
- workstation width cap;
- flat feed.

### Research
- Pedro containment;
- leadership/sheet ratio;
- mobile/tablet stacking;
- six-line handoff rule;
- laptop anti-stretch.

### Home
- threshold containment;
- stacked vs split corridors;
- phone single-column six-line index;
- INIBIC placement relationship.

### INIBIC
- official embedded mark;
- containment;
- phone flattening;
- readable fallback.

### Team
- image-led opening;
- sheet containment;
- stacked phone/tablet layout;
- workstation width restraint;
- roster/profile architecture intact.

### Innovation
- four ordered prompts;
- phone vertical spine;
- desktop horizontal progression;
- flat project rows.

Global guards continue to protect:
- no horizontal overflow;
- masthead containment;
- Index/Search behaviour;
- Contact masthead policy;
- workstation Search restraint;
- mobile typography ceilings;
- reduced-motion behaviour.

---

## 5. Phase 4 entry condition

Phase 4 is visual certification and polish, not another redesign phase.

Phase 4 may:
- adjust small spacing;
- tune crop/focal position;
- refine rule lengths;
- refine shadow/edge opacity;
- refine plaque translucency;
- correct visual imbalance;
- remove any residual “card” feeling discovered in screenshots.

Phase 4 should not:
- invent a new page identity;
- replace the chosen compositions;
- alter semantic order;
- weaken regression tests;
- broaden floating surfaces;
- reintroduce large rounded cards;
- change masthead/Index architecture.

---

## 6. Required Phase 4 visual evidence

At minimum inspect:
- phone around 390px;
- laptop around 1366–1440px;
- workstation around 1920–2048px when available.

Pages to inspect:
- Home;
- Research;
- Publications;
- Team;
- Innovation.

Special inspection:
- INIBIC plaque material quality and contrast;
- Publications folio → Selección handoff;
- Research Pedro containment and scientific margin;
- Team image dominance;
- Innovation process spine subtlety.

Automated success is necessary but not sufficient for visual certification.

---

## 7. Phase 3 conclusion

The Floating Editorial system is now implemented as **different page identities governed by one responsive contract**, rather than one reusable premium-card style.

The site now uses:
- fewer conventional floating signals;
- more precise editorial edges;
- controlled asymmetry;
- page-specific material/structural language;
- flat evidence sections around rare authored opening moments.

Phase 4 should now validate the result visually and make only evidence-based polish corrections.
