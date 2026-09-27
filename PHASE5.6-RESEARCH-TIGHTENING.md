# Phase 5.6 — Research tightening

## Goal

Tighten `/clinical/` after the Phase 5.5 editorial pass. The page should feel edited, factual and institutionally confident rather than rhetorically styled or decorated to look scientific.

## Changes

- Removed the public design-commentary sentence about descriptions and titles.
- Removed all decorative research-area circles, waveforms, grids and pseudo-scientific motifs.
- Reduced research-area vertical padding and section spacing.
- Kept the asymmetric editorial composition without using card backgrounds or decorative hover fills.
- Made backend research descriptions fully readable instead of three-line clamped copy.
- Added explicit `Coordination / Coordinación` metadata where a public coordinator exists.
- Replaced `Explore research area` with the literal `View research line / Ver línea de investigación` action.
- Removed public `L01`-style prefixes from study rows; the public research-area name is sufficient.
- Changed the study section from design commentary to factual portfolio language.
- Replaced the study filter plus sign with a labelled chevron state.
- Reframed the context section around clinical practice, biomedical research and public service.
- Replaced campaign-style collaboration copy with a direct `Research collaboration / Colaboración en investigación` heading.
- Replaced the contact `<details>` interaction with an explicit button, labelled open/close states, a separate close control and focus management.
- Links from study enquiries automatically open the research enquiry form.

## Design principles reinforced

- Scientific authority comes from real content, not decorative scientific graphics.
- Internal design reasoning never becomes public copy.
- Literal institutional copy is preferable to slogans on deep programme pages.
- Tightening and removal are legitimate design phases.

## Validation

Run:

```bash
python scripts/integrity_check.py
node --check scripts/site.js
node --check scripts/api.js
```

The integrity suite now also prevents the decorative research motifs and the removed design-commentary pullquote from returning.
