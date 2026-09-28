# Phase 8.0 — Clinical Innovation Editorial System

## Purpose

Replace the legacy public Innovation page's marketing/capability language with a restrained clinical-innovation narrative consistent with the accepted Landing and Research systems.

## Editorial rule

Innovation starts with a clinical or research need, not a technology category.

The page therefore moves through:

1. clinical need;
2. the kinds of questions that may require innovation;
3. governed current projects as evidence;
4. the clinical/research environment that enables evaluation;
5. collaboration around a defined problem.

## Removed legacy patterns

- duplicated four-stage process diagrams and phase KPI strip;
- unsupported capability claims and performance promises;
- hard-coded technology portfolio/status claims;
- regulator/scientific-society/partner logo strip;
- commercial engagement-package language;
- always-visible large contact form;
- badges/pills used as the primary project grammar;
- placeholder partner cards.

## Governed project contract

The public project surface uses `GET /api/innovation-projects/website` and renders only fields available from the public response. The renderer supports the existing contract (`title`, `description`, `category`, development/current stage, `partner_needs`) plus optional public localisation and URL fields when present. It does not invent clinical outcomes, evidence, investigators or project facts.

A record marked `is_featured: true` is used as the lead project when available; otherwise the first public record becomes the editorial lead.

## Synthetic media contract

`assets/innovation/clinical-innovation-hero-placeholder.jpg` is a synthetic editorial placeholder generated for composition. It is explicitly labelled on-page and documented in `assets/innovation/README.md`. It must never be treated as documentary evidence or as a depiction of neumACt personnel/facilities. Approved photography can replace the file in place without changing markup.

## Shared visual language

- Fraunces-led editorial hierarchy;
- off-white / white / institutional navy surfaces;
- thin rules instead of card chrome;
- asymmetric split compositions;
- mono reserved for metadata and section labels;
- dark institutional collaboration close;
- progressive disclosure for the enquiry form;
- shared header/footer remain owned by `styles/components.css` and `scripts/site.js`.

## Files changed

- `innovation/index.html`
- `styles/pages/innovation.css`
- `scripts/api.js` — public innovation renderer only
- `assets/innovation/clinical-innovation-hero-placeholder.jpg`
- `assets/innovation/README.md`

## Non-goals

No backend schema/API changes. No fabricated project detail pages. No new regulatory, performance, funding or partnership claims.
