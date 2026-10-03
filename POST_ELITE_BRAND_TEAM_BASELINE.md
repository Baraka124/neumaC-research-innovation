# Post-Elite Brand + Team Refinement Baseline

## Status

This baseline records two certified refinements completed after the Elite Institutional Refinements 01–08 closeout:

1. canonical neumACt wordmark reconstruction as native vector geometry;
2. Team opening recomposition from synthetic scene-setting imagery to a people-led institutional editorial surface.

Production baseline before this documentation closeout:
`6506d3f890765ce6b525996d3d39327c0fe66047`

## 1. Canonical neumACt native vector mark

The approved neumACt wordmark remains the brand source of truth.

The previous `logo.svg` preserved the correct visual identity but embedded the approved raster artwork inside an SVG wrapper. PR #73 replaced that wrapper with native vector paths traced from the certified canonical artwork.

Protected invariants:
- canonical 988 × 286 coordinate system;
- approved neumACt silhouette and distinctive long-stem / curved-foot `t`;
- blue → cyan / teal → green brand progression;
- no replacement icon;
- no generic font reconstruction;
- no embedded PNG/base64 image inside `logo.svg`.

Certification:
- canonical full-resolution reference capture;
- silhouette comparison against the approved artwork;
- actual masthead render inspection;
- regression check limiting site visual changes to the logo region;
- Playwright A-guard rejects `<image>` and embedded raster data.

Merged implementation:
- PR #73 — canonical neumACt native vector.

## 2. Team people-led institutional opening

The previous Team opening used a synthetic rabbit laboratory scene as an editorial metaphor. After the post-vector cross-page visual audit, that scene remained the strongest top-level visual break from the institutional public-site system.

PR #75 removed the synthetic scene from the public Team opening.

The Team page now begins with:
- multidisciplinary-programme framing;
- large editorial Team identity;
- existing factual Team context;
- a professional-domain rail covering clinical care, nursing, research, engineering, and computing/data;
- direct progression into programme leadership, research-line coordinators and the multidisciplinary roster.

Protected invariants:
- no synthetic rabbit hero or rabbit hero preload on the public Team opening;
- no repeated Home / Research / Innovation hero photography used as a substitute;
- Team identity is carried by its professional structure and people architecture;
- the P1 universal professional-profile system beneath the opening remains unchanged;
- Team remains part of shared cross-page typography, masthead and responsive certification.

Responsive contract:
- workstation: five-domain rail;
- tablet: three-column recomposition;
- phone: two-column recomposition with the final domain spanning the row;
- no horizontal overflow across 390, 620, 768, 1024, 1366, 1440, 1680 and 2048 px certification widths.

Certification:
- integrity / metadata checks;
- complete Playwright smoke suite;
- phone, laptop and workstation visual captures;
- Team-specific H2, Elite 01–04, Elite 05–08 and responsive regression contracts updated without weakening unrelated page coverage.

Merged implementation:
- PR #75 — people-led Team editorial opening.

## Non-regression rule

Future design work must not restore:
- raster-wrapped `logo.svg`;
- the generic font approximation rejected during the earlier A–E pass;
- the synthetic rabbit Team hero;
- an image-led Team opening solely to satisfy obsolete tests.

Any future replacement of the Team opening with documentary group photography must use genuine approved institutional media and must pass the same responsive and cross-page certification before merge.

## Current protected production state

The production implementation recorded by this baseline is:
`6506d3f890765ce6b525996d3d39327c0fe66047`

Subsequent work should branch from the latest `main` and preserve this baseline unless an explicitly stronger, visually certified milestone replaces it.
