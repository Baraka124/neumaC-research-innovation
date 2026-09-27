# Phase 6.1 — Research Line Lead Refinement

## Purpose

Phase 6.1 is a surgical refinement of the coordinator + scientific-scope section introduced in Phase 6.0. The underlying research-line architecture, APIs, hero, current-work modules, publications, team and collaboration sections remain unchanged.

## Problem corrected

The first Phase 6.0 composition could become visually immature on wide screens because the section behaved like three narrow columns: portrait, a constrained name/biography tower, and scientific scope. This caused long names to wrap vertically, biographies to become excessively tall and the scope column to hold large unused areas.

## New composition

The section now uses two editorial zones:

1. **Coordinator feature** — an internal portrait + identity composition.
2. **Scientific scope** — the line narrative as its own reading block.

The coordinator feature itself uses a 4:5 editorial portrait, a name sized to remain within approximately two lines, specialty, institutional affiliation and a concise public biography.

## Marina Blanco Aparicio

L02 continues to use the approved real public portrait at:

`assets/research/coordinators/marina-blanco-aparicio.jpg`

A short bilingual editorial biography is used on the public line page instead of displaying the long English backend biography verbatim. This is an explicit public-page editorial override; other coordinators continue to use the backend public biography as the fallback source.

## Removed / reduced

- no honorific prefixed to the large display name;
- no full-height divider between coordinator and scientific scope;
- no narrow biography tower;
- no raw long-form coordinator CV in the line layout;
- no mixed-language Marina biography when the site is in Spanish.

## Responsive behaviour

At wide desktop sizes the coordinator and scientific narrative sit side by side. Below 1120px they stack while the portrait and identity remain paired. On mobile the coordinator feature becomes a single column, preserving the editorial portrait before the identity text.

## Files changed

- `scripts/api.js`
- `styles/pages/line.css`
- `DESIGN_PRINCIPLES.md`
- `scripts/integrity_check.py`

