# P1 Professional Identity System — P1.1–P1.8 Baseline

## Status

P1 defines one universal public professional-profile system for the multidisciplinary neumACt team.

The governing principle is:

> **Same institutional dignity, different professional evidence.**

Leadership changes which additional responsibilities are shown. It does not determine whether a person receives a complete, high-quality professional profile.

## P1.1 — Universal professional-profile architecture

Every public team member belongs to one professional-profile population.

The profile sheet is not reserved for:
- the department head;
- principal investigators;
- research-line coordinators.

Physicians, residents, nurses, engineers, scientists, coordinators, technicians and other public contributors use the same profile surface and navigation system.

## P1.2 — Clinical / professional expertise

Optional approved fields:
- `clinical_expertise`
- `expertise_areas`
- `areas_of_expertise`
- `clinical_domains`

The public renderer uses the label **Clinical / professional expertise** so the architecture works for clinical and non-clinical professions.

## P1.3 — Current professional contribution

Optional approved fields:
- `professional_contributions`
- `current_contributions`
- `clinical_contributions`
- `public_contributions`

These describe what the person currently contributes professionally without requiring leadership status.

## P1.4 — Research, innovation, scholarly identity and networks

Optional approved research/innovation fields:
- `scientific_contributions`
- `research_contributions`
- `innovation_contributions`

Optional approved network fields:
- `professional_networks`
- `scientific_networks`
- `society_roles`
- `network_roles`

Scholarly identity supports:
- ORCID
- Google Scholar
- PubMed
- Web of Science / ResearcherID
- institutional profile
- ResearchGate

A provenance-aware `research_footprint` may expose publications, citations and h-index when approved and sourced.

## P1.5 — Leadership is additive

Leadership is rendered at the end of the same professional profile.

Supported public leadership evidence includes:
- research-line coordination;
- department leadership;
- approved structured `leadership_roles`.

The renderer explicitly states that leadership is an additional responsibility within the same professional profile.

No separate elite profile template exists for leaders.

## P1.6 — Sparse and rich states

Sparse profiles remain intentional.

Minimum profile state may contain only:
- name;
- profession / specialty;
- affiliation;
- professional identity facts.

Empty evidence modules do not render.

Rich profiles may progressively add:
- professional biography;
- expertise;
- current contribution;
- research relationships;
- research and innovation contribution;
- professional networks;
- scientific identity;
- research footprint;
- leadership responsibilities.

Richness changes depth, not rank or identity scale.

## P1.7 — Multidisciplinary stress testing

Automated stress fixtures cover:
- ordinary respiratory clinician;
- research-line coordinator;
- department leader;
- research nurse;
- biomedical engineer;
- sparse resident.

Stress tests verify:
- ordinary clinicians can have complete profiles without leadership framing;
- leadership is additive;
- non-clinical professions use profession-relevant evidence;
- private/unapproved evidence does not render;
- sparse states contain no empty modules;
- leadership/coordinator cards launch the universal drawer.

Canonical test:
`tests/professional-profile-stress.spec.js`

## P1.8 — Visual certification

Visual certification covers:
- 390px phone;
- 1440px laptop;
- 2048px workstation.

Profiles certified:
- clinician;
- nurse;
- biomedical engineer;
- research-line coordinator;
- department leader.

The certification enforces that ordinary clinicians and coordinators retain the same:
- sheet geometry;
- identity hierarchy;
- heading scale.

Canonical test:
`tests/professional-profile-visual-certification.spec.js`

Visual captures are written to the existing certification artifact directory.

## Governance

Structured evidence renders only when:
- `visibility` is absent or `approved_public`;
- `person_approval` is absent or `approved`.

The public website is a renderer, not the authoring authority.

The internal editorial system should own:
- evidence authoring;
- approval;
- source/provenance;
- bilingual copy;
- visibility;
- review dates.

## Protected decisions

Future work should not introduce:
- a stronger profile template only for leaders;
- a weaker profile template for ordinary clinicians or non-clinical professionals;
- profession-specific card systems that fragment the Team experience;
- empty evidence modules;
- inferred recognitions or achievements;
- unsourced research metrics;
- leadership as the primary identity of the person.

## Equality invariant

A professional with no leadership role may still have a richer public profile than a coordinator if more approved professional evidence exists.

That is expected.

**Responsibility determines the leadership module. Approved evidence determines profile depth. Neither determines institutional dignity.**
