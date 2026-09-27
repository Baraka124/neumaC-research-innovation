# neumAC R&I — Consolidation Phase 3

## Purpose
Phase 3 converges repeated cross-page components and browser behaviour into canonical shared owners. It remains a consolidation pass, not a visual redesign.

## CSS convergence
- Extracted exact top-level rules repeated across at least 4 of the 6 principal page stylesheets.
- Moved 122 canonical shared rules into `styles/shared.css`.
- Removed 508 repeated rule occurrences from `home.css`, `clinical.css`, `innovation.css`, `line.css`, `news.css`, and `team.css`.
- `styles/shared.css` loads between `foundation.css` and the page stylesheet, so page-owned variants retain normal cascade precedence.
- Shared rules that originally belonged to only 4–5 pages are scoped with zero-specificity `:where(body[data-page=...])` selectors. This prevents consolidation from leaking a component into pages that never owned it.
- Removed empty historical media blocks and malformed duplicate selector fragments left behind by older patch layers.

## Behaviour convergence
New `site.js` is the canonical owner for:
- EN/ES state and persistence (`huac_lang`, with legacy `lang` compatibility).
- Desktop/mobile language control synchronization.
- Mobile drawer open/close state and body scroll locking.
- Cookie-banner visibility/acceptance.
- Scroll progress and back-to-top behaviour.
- Smooth in-page anchors.
- Reveal observer + blank-page safety fallback.
- Shared header-image failure safety.

Repeated inline implementations of those behaviours were removed from page HTML. `header-enhance.js` now remains a header-specific enhancement layer rather than a competing owner of shared site state.

## Presentation ownership tightened
- Drawer body locking is class-driven (`body.is-drawer-open`).
- Cookie visibility is class-driven (`.cookie-banner.is-visible`).
- Hero accent animation uses `.hero-accent-line` / `.is-drawn` instead of injected `cssText`.
- Accordion pulse and cursor presentation moved from JavaScript into CSS classes.
- Skip-link offsets and generated team initials are class-owned.
- API-down and form-validation presentation are class-owned instead of injected CSS strings.

## Consolidation metrics
Compared with the Phase 2 baseline:

| Metric | Phase 2 | Phase 3 | Change |
| --- | ---: | ---: | ---: |
| Principal page CSS bytes | 279,382 | 215,589 | -22.8% |
| Total CSS bytes | 374,293 | 354,294 | -5.3% |
| Total HTML bytes | 426,279 | 346,790 | -18.6% |
| Inline executable script blocks | 72 | 19 | -73.6% |

The CSS total includes the new `styles/shared.css`; the reduction therefore reflects true deduplication rather than moving duplicated rules to another file.

## Deliberately unchanged
- API/backend contracts.
- Page-specific news/article rendering.
- Bronchial-tree canvas rendering.
- Research/study/project data behaviour.
- Runtime values that genuinely depend on measured geometry or animation state (for example accordion height and nav-pill transform).
- No visual redesign.

## Validation record
- `python scripts/integrity_check.py`: passing.
- All root JavaScript files: `node --check` passing.
- 19 remaining inline executable script blocks: syntax checked, 0 failures.
- Core pages, shared stylesheets and `site.js`: HTTP 200 from a local static server.
- Automated Chromium screenshot/rendering hangs in this container, so pixel-level browser validation is intentionally left to the local desktop/mobile check before committing.

## Commit suggestion
`refactor(ui): converge shared components and site runtime`
