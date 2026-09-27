# Phase 5.4 — Research Portfolio Redesign

## Objective

Bring `/clinical/` into the editorial system established by the Phase 5.3 landing page while preserving its role as the detailed public research portfolio.

## Removed

- oversized legacy hero and bottom pseudo-metric strip;
- GCP / CE MDR / site-initiation decorative claims;
- six large accordion cards that duplicated line-detail pages;
- full-width study database table;
- standalone 10+ studies billboard;
- always-visible large contact composition;
- affiliation logo wall and empty partner placeholders;
- legacy footer compliance strip.

## Introduced

### Compact research hero

A shorter hero states the research proposition and exposes only meaningful live portfolio figures: research-line count and active/recruiting-study count.

### Editorial research-line index

The six governed lines are rendered as compact rows with code, title, public coordinator, active-study metadata and a limited focus vocabulary. Each row goes directly to the dedicated line page.

### Progressive study portfolio

Studies render as readable editorial rows rather than a dashboard table. Filters live behind a disclosure control. The first seven studies are shown initially; additional records are revealed on demand. Active/recruiting records sort ahead of completed records.

### Research environment

Institutional context is expressed relationally rather than through logos: Área Sanitaria da Coruña e Cee · INIBIC · SERGAS.

### Progressive collaboration contact

The research enquiry form remains governed by the existing public endpoint but stays collapsed until the visitor chooses to start a research conversation.

### Canonical footer

The landing-page editorial footer is reused on the Research page.

## Data ownership

- `/api/research-lines/website` → line index + hero counts + line filter.
- `/api/clinical-trials/website` → study portfolio and study modal.
- existing research contact endpoint → collaboration form.

The page remains a governed projection of internal research system/public research data rather than a manually maintained parallel catalogue.
