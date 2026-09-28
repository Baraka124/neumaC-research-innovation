# Phase 7.5.1 — Team Hierarchy & Container Bugfix

## Purpose

Correct two regressions found during browser review without redesigning the accepted Team page.

## Fixes

- Adds `team` to the canonical shared `.container` ownership at normal and wide desktop breakpoints, restoring the same centered content geometry used by Research and Innovation.
- Keeps the Principal Investigator in programme leadership only.
- Keeps named research-line coordinators in the coordinator section only.
- Removes both groups from the remaining multidisciplinary roster to prevent duplicate rendering.
- Reframes research-line links on the remaining team as current public research relationships rather than exclusive line membership.
- Renames the roster section to `Multidisciplinary team / Equipo multidisciplinar` and explains cross-line contribution in concise institutional language.

## Data

No API contract changes. Public Team and research-line endpoints remain authoritative.
