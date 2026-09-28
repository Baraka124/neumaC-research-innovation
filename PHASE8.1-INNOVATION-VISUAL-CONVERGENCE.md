# Phase 8.1 — Innovation Visual Convergence

## Why this phase exists

Phase 8.0 corrected the rhetoric and information architecture but still invented a separate visual language. Phase 8.1 keeps the quieter clinical-innovation content while bringing the page back into the accepted Landing / Research system.

## Canonical visual source

Innovation now uses the same destination-page grammar as Research:

- literal destination hero (`Clinical innovation`);
- identical hero title scale and 700-weight Fraunces hierarchy;
- the canonical navy/teal/off-white palette;
- the same section intro grid and vertical rhythm;
- thin rules and editorial rows instead of product cards;
- the same light institutional context band;
- the same dark progressive-disclosure collaboration close;
- the canonical editorial footer.

## Public project contract

`/api/innovation-projects/website` remains authoritative. The renderer only exposes fields that are actually public: title, description, category, recorded stage, partner needs and an optional public URL. Project records use one editorial row grammar rather than badges, cards or invented case-study fields.

## Hero media

`assets/innovation/clinical-innovation-hero-placeholder.jpg` is a synthetic editorial placeholder. It is documented internally in `assets/innovation/README.md`, is not presented as evidence, and uses a wide crop tested for the actual hero slot. Approved photography can replace the same file later.

## Files changed

- `innovation/index.html`
- `styles/pages/innovation.css`
- `scripts/pages/innovation.js`
- `scripts/api.js` (public Innovation renderer only)
- `assets/innovation/*`
- `DESIGN_PRINCIPLES.md`
