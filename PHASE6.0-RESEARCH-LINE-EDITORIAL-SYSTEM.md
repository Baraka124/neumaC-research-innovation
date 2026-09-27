# Phase 6.0 — Research Line Editorial System

## Purpose

Replace the legacy research-line detail page with one inherited public architecture for all six neumACt research lines.

The page now prioritises scientific identity, line leadership, authored research scope, current clinical work, publications, the actual line team and collaboration. It deliberately avoids dashboard counts, status-card chrome and decorative pseudo-science.

## Canonical order

1. Line-specific editorial hero and media
2. Research-line coordinator spotlight
3. Scientific scope / long-form line content
4. Methods, capabilities and selected track record when authored
5. Clinical studies and clinical-innovation projects
6. Recent publications
7. Supporting line team
8. Context-aware collaboration CTA

Empty modules do not render.

## Data contract used now

- `GET /api/research-lines/:id/website`
- `GET /api/clinical-trials/website?line=:id`
- `GET /api/innovation-projects/website?line=:id`
- `GET /api/news/website?type=publication&line=:id`

No new public claims are inferred from missing backend fields.

## Media policy

- L02 Airway Diseases uses a dedicated airway-procedure hero crop from the previously accepted design mock-up.
- Marina Blanco Aparicio uses the public portrait supplied for this line.
- Other line hero assets continue to use the replaceable research media slots already established in `assets/research/` until approved alternatives are supplied.

## Leadership rule

The programme PI is not repeated in every line team. The line coordinator is the primary human anchor. If the programme PI is also the coordinator of a specific line, that coordinator feature is sufficient.

## Visual rules

- no hero KPI pills
- no oversized count cards
- no phase/status pill styling in current-work lists
- no decorative waveform/circle/AI-science motifs
- no aggressive arrows; links use restrained chevrons
- no repeated generic `Programme` labels
- no internal platform naming
- broad institutional identity: Área Sanitaria da Coruña e Cee
