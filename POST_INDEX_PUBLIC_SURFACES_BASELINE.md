# Post-Index Public Surface Refinement Baseline

## Status

This baseline records the certified public-surface refinements completed after the chapter-aware Scientific Index closeout.

Protected production implementation before this documentation-only closeout:
`c2da8b087dbf8d09e7a302c19554f8c65a6a8c74`

## 1. Scientific Search — discovery surface

Scientific Search is no longer treated as a generic text filter.

Protected behavior:
- Search remains a mode of the same global Scientific Index surface.
- Discovery is organized across Research, People, Publications and Innovation.
- Search uses public governed data already exposed by the site.
- Desktop, tablet and phone compositions remain contained and visually integrated with the masthead.
- Search must not regress to the retired generic filter-panel treatment.

Merged milestone:
- PR #82 — Scientific Search discovery refinement.

## 2. Team identity — documentary photography or institutional initials

The public Team runtime must never represent a named person with synthetic, stock, avatar or rabbit imagery.

Protected rule:
- approved documentary public portrait when available through the governed public-photo field;
- otherwise the existing institutional initials identity treatment;
- no synthetic person placeholder fallback.

This applies consistently to programme leadership, research-line coordinators, the multidisciplinary roster and professional profile sheets.

Legacy rabbit assets may remain archived for provenance but are not part of the public runtime contract.

Merged milestone:
- PR #83 — documentary portraits or institutional initials.

## 3. Publications — scholarly register

Publications owns an information-led scholarly identity rather than repeating Research imagery.

Protected behavior:
- the Publications opening is a scholarly register rather than an image-led hero;
- scientific publications, articles, research updates and highlights remain distinguished within the public register;
- the zero-output state is an intentional editorial register state, not duplicated warning cards;
- record-owned media is preserved when available;
- generic repeated lung imagery must not be reintroduced merely to fill empty media slots.

Merged milestone:
- PR #77 — scholarly Publications register.

## 4. Publication reader — docked scholarly folio

The opened publication/article reader preserves its existing scholarly content model while using a stronger desktop/workstation reading surface.

Protected behavior:
- DOI, authors, journal, rich body, research-line context, related people, URL/history behavior and reading progress remain intact;
- on desktop/workstation, the reader docks beneath the live scientific masthead rather than floating over it as a generic application modal;
- the reader stays synchronized to the actual current masthead height while open;
- mobile preserves its established adaptive full-screen reading behavior;
- the Publications register remains visible as contextual background on larger screens.

Merged milestone:
- PR #85 — docked scholarly publication folio.

## 5. Shared institutional footer

The public site closes with one shared institutional footer system.

Protected behavior:
- dark institutional close remains;
- canonical neumACt vector mark remains the only brand artwork;
- footer logo treatment follows the same quiet institutional signature language as the scientific masthead;
- workstation measure is deliberately bounded rather than spreading across the entire canvas;
- institutional affiliation, navigation, research/collaboration enquiry link and legal navigation remain present;
- phone stacking remains explicit and contained.

Certified reference widths:
- 390 px
- 1440 px
- 2048 px

Merged milestone:
- PR #87 — shared institutional footer refinement.

## Non-regression rule

Future work must not:
- restore the generic Search/filter-panel model;
- restore synthetic person imagery for named Team members;
- restore an image-led Publications hero using repeated Research imagery;
- revert the publication reader to a rounded floating application drawer on desktop/workstation;
- widen the institutional footer linearly with workstation canvas size;
- remove the explicit legal/institutional hierarchy from the footer.

Any replacement must be supported by stronger visual and behavioral certification than the system recorded here.

## Current protected production state

The production implementation recorded by this baseline is:
`c2da8b087dbf8d09e7a302c19554f8c65a6a8c74`

Subsequent work should branch from the latest `main` and preserve these invariants unless a later certified milestone explicitly replaces them.
