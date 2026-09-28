# Phase 6.3 — Team and collaborations

Built on `neumac-phase6.2-line-live-editorial-full.zip` (27 September 2026).

## Apply

Copy the files in this overlay into the Phase 6.2 website root, preserving their paths. This is a website update, not a backend deployment. It has not been published.

Changed files:
- team/index.html
- styles/pages/team.css
- scripts/pages/team.js
- scripts/api.js — only the Team dispatcher changed; Phase 6.2 line-page logic is preserved.

## Page

Scientific leadership (Pedro) → six research coordinators → multidisciplinary team → collaborations. Pedro's line-coordinator role remains visible in its own context. María Delgado remains a coordinator even though she is affiliated with another department.

Includes bilingual static labels, search, role and line filters, progressive directory disclosure, native expandable profiles, selected publications, scholarly identity links when supplied, graceful image fallbacks and retry controls.

Approved portraits: Pedro, Marina and Angélica. Existing Phase 6.2 media assets are reused; missing portraits use initials. Biographies remain in their authored language. No staff biographies or organisation partnerships have been invented.

Collaboration separates institutional context from potential collaboration routes. External public people appear separately when returned and not already presented as coordinators. There is no fabricated partner logo wall.

## Data

GET /api/team/website is authoritative for visible people. GET /api/research-lines/website supplies line metadata. The existing public detail endpoints supply team-to-line relations, fetched with concurrency limited to two. Only people already returned by the public team endpoint are displayed. The adapter accepts future research_lines[] relations. Programme PI status uses explicit programme_role or the confirmed Pedro ID; can_be_pi is never interpreted as programme leadership.

The current public API still needs an eventual consolidated membership contract to remove detail-page fan-out. No backend file was changed in this delivery.

## Validation

- JavaScript syntax: passed.
- Existing site integrity suite: passed.
- DOM integration checks against captured live public responses: passed for leadership, six coordinators, portraits, pagination, name search, filter reset, language switching, line membership completion, image failures, empty and failed responses.
- All six public line detail responses retrieved successfully.
- Desktop/mobile browser visual QA remains unverified: Chromium downloads failed in this environment. Responsive CSS is implemented, but visual sign-off is still needed.

The separate standalone HTML preview embeds the captured public responses and images so the layout and interactions can be reviewed without installing the project. Its snapshot banner and embedded data are not part of the production overlay.
