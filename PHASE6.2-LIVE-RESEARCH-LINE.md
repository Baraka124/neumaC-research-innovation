# Phase 6.2 — Live Research Line Editorial System

## Purpose

Phase 6.2 refines the inherited research-line page into the accepted public architecture: scientific identity in the hero, coordinator-led human context, a live evidence layer, compact current work, publications, team and collaboration.

## Architecture

The hero now owns the line description and line-specific visual. The previous repeated `About this line / Scientific scope` block has been retired.

Immediately below the hero, a two-part editorial composition pairs:

1. the research-line coordinator, using an approved public portrait when available; and
2. a live activity area built from the public clinical-study, clinical-innovation and publication endpoints.

## Live evidence

The following figures are calculated from the current public API responses on every page load:

- active interventional clinical trials;
- active non-interventional clinical studies;
- active clinical-innovation projects; and
- public publication records linked to the line.

The dashboard contains three responsive SVG summaries:

- current activity by type;
- publications by year; and
- clinical-innovation maturity by development stage.

No figure is hard-coded for visual effect.

## Clinical innovation

Clinical innovation remains a first-class public concept. It is represented in the headline metrics, live charts and current-work list. Studies and innovation share an editorial grammar but remain semantically distinct.

## Media

Approved line-specific media overrides were added without forking the template:

- L02 Airway Diseases uses a dedicated airway/respiratory-device hero crop.
- L04 Respiratory Failure & Sleep Medicine uses the accepted ventilatory-support hero crop.
- Marina Blanco Aparicio uses the approved public portrait already supplied.
- Angélica Consuegra Vanegas uses the supplied public portrait.
- Pedro Jorge Marcos Rodríguez explicitly maps to the approved real portrait so his L06 coordinator feature cannot fall back to initials while that local asset exists.

These files remain replaceable media slots under `assets/research/`.

## Loading

The line page now keeps the main content behind a geometry-matched skeleton while the line record and its evidence streams load. Failed secondary evidence calls degrade to empty/hidden modules rather than blocking the line identity.

## Responsive safety

All dashboard grids use `minmax(0, 1fr)` and all charts are responsive SVGs using viewBoxes. Chart containers clip their own rendering and collapse from three columns to two and then one column at smaller widths.

## Public-content rules retained

- no internal platform naming;
- no legacy hospital acronym in rendered public copy;
- programme PI is not repeated as a supporting team member on every line;
- line coordinator is the primary person on the line page;
- the shared canonical header remains owned by `styles/components.css` and `scripts/site.js`.
