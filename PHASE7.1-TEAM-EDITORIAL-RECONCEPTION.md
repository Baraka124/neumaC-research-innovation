# Phase 7.1 — Team Editorial Reconception

## Why this phase exists

Phase 6.3 correctly modelled the people relationships but presented them with too much public-directory grammar: search fields, counts, small staff rows, accordions and collaboration categories. Phase 7.1 keeps the governed data model and replaces that presentation with the editorial people system established by the neumACt public design principles.

## Editorial hierarchy

1. **People behind the research** — the page opens with the multidisciplinary idea rather than a staff-directory proposition.
2. **Scientific leadership** — the programme PI receives one substantial portrait-led feature.
3. **Research coordinators** — six equal scientific anchors, each visibly attached to a research line. No numbered ranking and no mini-directory rows.
4. **Multidisciplinary team** — portrait-led public profiles. Research-line tabs and one professional-contribution control support discovery without turning the page into a database query surface.
5. **Editorial profile sheet** — a right-side reading surface contains biography, research-line connections, selected work and scholarly identifiers. `<details>` accordions are removed.
6. **Research through collaboration** — collaboration is explained as a response to scientific need, not as a catalogue of partner types. Real public external people appear only when governed records exist.

## Data rules retained

- existing public Team endpoint remains the people source;
- existing Research Lines endpoint remains the line source;
- line-detail public endpoints enrich non-coordinator memberships;
- enrichment remains limited to two requests at a time;
- Pedro's programme-wide PI role remains distinct from line coordination;
- approved local portrait overrides remain isolated and replaceable;
- no collaborator, relationship, publication or metric is fabricated;
- missing data degrades by omission rather than invented filler.

## Public-language safety

The renderer now prefers `public_bio_en` / `public_bio_es` when available. The legacy `public_bio` field is used only as an English fallback, preventing an English-only raw biography from being injected into the Spanish page. Spanish biography content therefore disappears cleanly until a governed Spanish version exists.

## Removed directory/admin patterns

- person search box;
- visible result counts;
- `X people · Y shown` language;
- small 64px staff rows;
- profile accordions;
- visible relationship-loading diagnostics;
- generic collaboration-type taxonomy;
- oversized "show more" pagination control.

## Interaction

The roster can be explored by research line or professional contribution. Selecting **View profile / Ver perfil** opens an accessible right-side profile sheet. `Escape`, the close action and backdrop close it; focus returns to the trigger.

## Ownership

- `team/index.html` — page narrative and accessible profile-sheet shell.
- `styles/pages/team.css` — Team-specific editorial composition.
- `scripts/pages/team.js` — governed public rendering, relationship enrichment, filters and profile sheet.
- `styles/components.css` / `scripts/site.js` — shared header, footer and global behaviour remain unchanged.
