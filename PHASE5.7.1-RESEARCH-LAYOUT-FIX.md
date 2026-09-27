# Phase 5.7.1 — Research layout hotfix

## Cause
A stale shared rule from the older card-grid system still targeted `#researchLinesList` and forced the container to render as a two-column CSS grid. Phase 5.7 introduced full-width editorial chapters, so the legacy rule caused two complete chapters to be placed side by side and their internal main/aside grids to collide visually.

## Fix
- Removed the obsolete shared `#researchLinesList` two-column grid rule.
- Made `.research-chapters` explicitly sequential (`display:block`) in the Research page stylesheet.
- Added integrity guards preventing the legacy grid contract from returning.
- Added a browser regression asserting the first two chapters stack vertically at equal width.

No content, API contract, line routing, header, studies, contact or footer behaviour was changed.
