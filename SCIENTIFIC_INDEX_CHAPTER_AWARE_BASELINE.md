# Scientific Index — Chapter-Aware Baseline

## Status

The Scientific Index chapter-aware refinement is implemented, visually certified and merged.

Protected production baseline before this documentation closeout:
`c3da28b468007c068765599acff2e7afdcba6de1`

The interaction milestone was implemented in PR #79 and its post-merge test-fixture stabilization in PR #80.

## Problem closed

The previous Scientific Index could correctly mark Innovation, Publications or Team as the active chapter while the centre column remained hard-coded to **Research lines**.

That produced a semantic contradiction: the shell looked global, but its information architecture still behaved like a Research-only menu.

This baseline closes that mismatch.

## Canonical chapter behavior

The left chapter rail is an in-place controller for the centre register.

Selecting a chapter updates the centre without navigating away from the current page. Navigation happens only through the explicit chapter action.

### Research

Centre identity:
- Research lines / Líneas de investigación

Content:
- live public research-line data, ordered by line number

Explicit destination:
- Open research / Abrir investigación

### Innovation

Centre identity:
- Innovation pathway / Ruta de innovación

Stable public destinations:
- Clinical question / Pregunta clínica
- Current projects / Proyectos actuales
- Research & technical collaboration / Colaboración en investigación y tecnología

Explicit destination:
- Open innovation / Abrir innovación

### Publications

Centre identity:
- Scholarly register / Registro científico

Stable public destinations:
- Selected output / Selección
- Recent output / Producción reciente
- Search the scholarly register / Buscar en el registro científico

Explicit destination:
- Open publications / Abrir publicaciones

### Team

Centre identity:
- People & programme / Personas y programa

Stable public destinations:
- Programme leadership / Dirección del programa
- Research-line coordinators / Coordinación de las líneas
- Multidisciplinary team / Equipo multidisciplinar
- Research collaboration / Colaboración en investigación

Explicit destination:
- Open team / Abrir equipo

## Mobile contract

The phone/tablet disclosure belongs to the currently selected chapter.

Protected rules:
- Research may display a line count.
- Innovation, Publications and Team display section counts, not research-line language.
- The disclosure's chapter destination follows the currently selected chapter.
- Selecting Team must never produce a “6 lines” label.
- The chapter rail still exposes exactly four primary chapters.
- Mobile chapter switching remains in-place until the explicit destination link is activated.

## Search contract

Search remains a second state of the same Scientific Index surface.

The chapter-aware refinement does not replace or duplicate Search. Existing search behavior, filters, result sources and focus handling remain protected.

## Ownership

`scripts/site.js` owns:
- Index open/close/search state;
- selected chapter state;
- centre chapter rendering;
- live Research-line data.

`scripts/index-navigation.js` remains an enhancement layer. It may read the selected chapter to adapt device choreography and disclosure language, but it must not become a second chapter-state owner.

`styles/index-navigation.css` owns the device-aware Index composition.

## Non-regression rules

Future work must not:
- hard-code Research lines as the centre content for every chapter;
- make the active chapter visually disagree with centre content;
- make the mobile disclosure use Research-specific labels for non-Research chapters;
- convert the chapter rail back into immediate navigation if that removes the in-place scientific-index interaction;
- create a second independent Index state machine;
- regress the integrated Search state;
- alter page content merely to satisfy Index navigation.

Any later change to the Scientific Index should preserve chapter/content agreement at desktop and mobile and pass the dedicated chapter-aware certification.

## Certification

Certified behaviors include:
- page-aware opening on Innovation, Publications and Team;
- in-place switching across all four chapters;
- explicit chapter navigation targets;
- live Research-line rendering;
- desktop semantic agreement;
- phone Team state with “4 sections” rather than “6 lines”;
- no horizontal overflow;
- complete site smoke suite;
- post-merge GitHub Pages deployment.

## Current protected state

Production implementation:
`6260606e9482c97585be6488a2296a8c6e05675c`

Current fully green repository state after deterministic Publications test stabilization:
`c3da28b468007c068765599acff2e7afdcba6de1`

Subsequent work should branch from the latest `main` and preserve this Index interaction contract unless an explicitly stronger, visually certified model replaces it.
