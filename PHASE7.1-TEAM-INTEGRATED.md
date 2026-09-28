# Phase 7.1 — Team integrated into the accepted public design system

## Why this replaces the previous Team experiments
The former Team implementation still used the older public-site grammar: animated bronchial hero, KPI strip, profile cards, avatar directory, publication carousel, opportunities, constellation graphic and affiliation cards. A later experimental overlay changed the structure but introduced a separate people-directory aesthetic. Both felt disconnected from the accepted Landing, Research and line-detail work.

## Canonical Team sequence
1. **People / orientation** — editorial hero, no invented people imagery and no decorative science canvas.
2. **Scientific leadership** — one substantial human feature for programme leadership.
3. **Research-line coordination** — six full-width editorial rows tied directly to the six research lines.
4. **Multidisciplinary team** — name-first editorial masthead with quiet research-line filtering; no search box, result count or database language.
5. **Public profile sheet** — right-side reading surface for biography, line relationships and scholarly identifiers.
6. **External collaboration** — dark institutional interlude showing only approved external profiles and the real operating environment.

## Deliberately removed
- hero KPI row
- animated bronchial canvas
- small-avatar staff directory
- centre-screen profile modal
- Team-page publication carousel
- open-opportunity cards
- constellation/network graphic
- logo/affiliation card wall
- public loading text about internal relationship enrichment
- duplicated collaboration taxonomy

## Data architecture
No API contract was changed. `scripts/pages/team.js` consumes:
- `/api/team/website`
- `/api/research-lines/website`
- `/api/research-lines/:id/website` for approved line/team relationships

Line-detail enrichment runs with two concurrent workers. The page remains usable if enrichment fails.

## Visual inheritance
The page intentionally reuses the accepted visual grammar rather than copying components verbatim:
- Fraunces display hierarchy
- DM Mono metadata
- flat editorial surfaces
- thin rules instead of cards
- off-white / white / institutional navy sequencing
- Landing/Research vertical rhythm
- full-width editorial rows
- restrained teal interaction accents
- canonical footer identity: Área Sanitaria da Coruña e Cee · INIBIC · SERGAS
