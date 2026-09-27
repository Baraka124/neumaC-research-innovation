# Phase 5.5 — Research Editorial Pass

## Purpose

Move the Research destination from a compact information index to a distinctive editorial portfolio while preserving live backend data and the shared neumACt navigation/footer system.

## Locked decisions

- Research-line codes are data metadata, not public visual branding.
- Research-line descriptions are rendered directly in the overview and clamped for resilience.
- The six lines use an asymmetric magazine grid so the page reads as a scientific publication rather than a dashboard.
- Scientific motifs are abstract CSS marginalia only; they do not claim scientific meaning.
- Study records are presented as an editorial index with title first and protocol/phase/sponsor second.
- The collaboration form remains collapsed by default, but the trigger explicitly says “Open inquiry form”.
- Public-facing files do not expose the name of the internal platform.
- Shared header/footer ownership is unchanged.

## Reusable patterns

1. Editorial chapter component: eyebrow → display title → description → live metadata → focus terms → action.
2. Asymmetric 12-column content rhythm that collapses to one column on mobile.
3. Abstract motif layer using CSS only, kept below copy and intensified slightly on hover.
4. Explicit progressive-disclosure CTA with separate open/close labels.
5. Editorial registry rows for data-heavy public portfolios.

These patterns can inform Team, Innovation, Articles and individual Research Line pages, but should be adapted to each page's information hierarchy rather than copied mechanically.
