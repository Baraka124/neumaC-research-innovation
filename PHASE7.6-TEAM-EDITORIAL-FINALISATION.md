# Phase 7.6 — Team Editorial Finalisation

## Status

Final Team-page convergence phase. The Phase 7.5.1 hierarchy is locked: programme leadership, research-line coordinators, then the remaining multidisciplinary team without duplicate people.

## Final refinements

- Preserves the accepted rabbit multidisciplinary hero but converts normal delivery to responsive WebP variants for desktop, tablet and mobile.
- Keeps the original synthetic PNG only as the fallback/source asset.
- Localises common public people metadata for EN/ES: professional specialties, routine department labels and the six canonical research-line names.
- Makes the hero image alt text and figure label follow the selected site language.
- Tightens the cross-service section to one factual explanation instead of repeating the multidisciplinary argument.
- Removes Team-specific footer spacing overrides so Team inherits the canonical Landing footer exactly.
- Updates Team structured metadata to describe the actual multidisciplinary programme rather than only physician-investigators.

## Data and hierarchy

No API contract changes. `/api/team/website` and research-line website endpoints remain authoritative. Programme leadership and named line coordinators continue to be excluded from the lower multidisciplinary roster so each public person has one primary placement.

## Media

`assets/team/README.md` documents the synthetic hero source, responsive derivatives, non-evidentiary status and replacement contract.

## Freeze rule

After Phase 7.6, Team should be treated as design-complete. Future changes should normally be limited to approved portraits, public people records, copy corrections, accessibility fixes or shared-system updates—not page-specific visual redesign.
