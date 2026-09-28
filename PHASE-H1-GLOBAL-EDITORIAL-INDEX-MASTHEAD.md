# Global H1 — Editorial Index Masthead Foundation

## Baseline
This phase was applied after the accepted public-page work, including Phase 7.12.1 Team Freeze and Phase 8.1 Innovation Visual Convergence.

## Shared implementation
The masthead remains owned globally by `styles/components.css` and `scripts/site.js`; no page-specific header stylesheet fork was introduced. The new behaviour therefore propagates automatically to Landing, Research, Innovation, Articles, Team, research-line pages and secondary public pages that use the canonical header.

## Delivered
- Persistent navy institutional masthead with the existing visible desktop primary navigation.
- New `Index / Índice` control in the utility cluster.
- Full-width editorial Index surface with Research, Innovation, Articles and Team chapters.
- Live six-line research index fed by the public research-lines endpoint.
- Quiet institutional utilities and latest-article context.
- Integrated masthead Search for pages, research lines, public people and articles.
- `Cmd/Ctrl+K` and the header search control now open the integrated Search surface.
- Search results can deep-link to Team profiles and public Articles; Articles accepts `?post=<id>` and opens the requested reader after API content loads.
- Research chevron remains as a faster six-line route and is visually simplified to avoid competing with Index.
- Adaptive behaviour: desktop attached surface, compressed laptop/tablet layout, full-height editorial Index on iPad portrait/mobile.
- Existing mobile drawer remains in the DOM as graceful fallback but is retired from normal ≤880px interaction; the hamburger now opens the editorial Index.
- Existing active-page teal marker and EN/ES state are preserved.

## Files changed
- `styles/components.css`
- `scripts/site.js`
- `scripts/pages/news.js`
- `DESIGN_PRINCIPLES.md`

## Validation
The repository integrity suite passes after the shared masthead changes.
