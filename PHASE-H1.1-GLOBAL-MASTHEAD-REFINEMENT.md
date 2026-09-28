# Global H1.1 — Editorial Masthead Refinement

H1.1 preserves the accepted H1 architecture and improves execution quality.

## Refinements
- Removed hover-induced text/padding shifts from Index chapters, research lines and Search results.
- Added a subtle current-chapter rail instead of relying only on colour.
- Simplified mobile Index chrome to one brand/action row; Search is available directly in that row.
- Search mode now uses its own focused heading/close treatment instead of duplicating the Index toolbar.
- Replaced font-dependent search glyphs with consistent SVG search icons.
- Research-line labels now follow active EN/ES language using canonical mappings/fallbacks.
- Language changes immediately refresh Index line labels and latest-content date formatting.
- Search now indexes live public innovation projects through `/api/innovation-projects/website`.
- People search uses controlled bilingual role labels for common public roles.
- Replaced “View portfolio / Ver cartera” with the clearer “View research / Ver investigación”.
- Removed a duplicate mobile-toggle state assignment in the shared runtime.

## Shared owners
- `styles/components.css`
- `scripts/site.js`
- `DESIGN_PRINCIPLES.md`

No page-specific header fork was introduced.
