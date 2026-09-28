# Phase 7.2 — Team Visual Convergence

## Why this phase exists

The previous Team editorial pass introduced a page-specific visual language that felt disconnected from the accepted Landing and Research pages. Phase 7.2 removes that drift.

## Canonical visual source

Team now inherits the accepted Research destination-page grammar directly:

- `#fbfaf7` destination canvas and white content surfaces;
- 700-weight Fraunces for major editorial hierarchy;
- DM Mono teal metadata/kickers;
- the same hero scale and vertical density as Research;
- thin blue-grey rules instead of card shells;
- the same light context band and dark institutional close;
- the canonical editorial footer.

## People system

1. Hero uses governed public coordinator portraits only. No synthetic people.
2. Scientific leadership reuses the compact portrait-led grammar proven by the Research PI feature.
3. Research-line coordinators are portrait-led editorial rows, not cards and not tiny directory entries.
4. The broader team is a quiet two-column people index. Filtering is secondary and collapsed by default.
5. A selected person opens a flat editorial profile sheet; the main page remains calm.
6. External collaborators appear only when named public records exist.

## Media contract

Known approved local portrait overrides remain in stable research asset paths. Portraits use `object-fit: cover` with face-safe vertical focal positions. Missing portraits fall back to initials without changing row geometry.

## Files changed

- `team/index.html`
- `styles/pages/team.css`
- `scripts/pages/team.js`
- `DESIGN_PRINCIPLES.md`
