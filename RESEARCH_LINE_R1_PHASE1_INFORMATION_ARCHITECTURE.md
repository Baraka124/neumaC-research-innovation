# Research Line Scientific Identity — R1.1 Information Architecture

## Status

**Phase 1 architecture baseline. No production UI changes.**

This document defines the information architecture, publishing contract and regression boundaries for the next neumACt milestone: turning each research-line page from a well-designed activity page into a governed **scientific dossier**.

R1.1 deliberately does not redesign `/line/`. It defines what the page must communicate, what neumDesk/Grounded should own, what can be derived automatically, and how rich and sparse profiles must both remain intentional.

---

## 1. Product objective

Each research line should answer, in order:

1. **What scientific problem does this line address?**
2. **What is its clinical/scientific proposition?**
3. **Who provides scientific leadership?**
4. **What capabilities does the line actually have?**
5. **What is active now?**
6. **What evidence has the line produced?**
7. **Which people, networks and institutions contribute?**
8. **How can an external collaborator engage?**

The page is not a CV, staff directory, dashboard or marketing landing page.

It is a **living institutional scientific dossier**.

---

## 2. Existing public architecture to preserve

The current line template already has a strong base and remains the starting point:

- line hero;
- scientific summary;
- keywords;
- about/research-area narrative;
- clinical & scientific capabilities;
- selected track record;
- coordinator;
- current activity metrics;
- studies and innovation;
- recent publications;
- people & contributions;
- cross-programme connections;
- research enquiry.

Existing public endpoints already provide:
- `GET /api/research-lines/website`;
- `GET /api/research-lines/:id/website`;
- `GET /api/team/website`;
- `GET /api/clinical-trials/website?line=:id`;
- `GET /api/innovation-projects/website?line=:id`;
- `GET /api/news/website?type=publication&line=:id`.

R1 must extend this model rather than replace it.

---

## 3. Current architectural weaknesses found in R1.1 audit

### 3.1 Coordinator editorial copy is partly hard-coded in the public frontend

`scripts/api.js` currently contains:
- `LINE_COORDINATOR_MEDIA`;
- `LINE_COORDINATOR_EDITORIAL`.

This means some approved coordinator summaries live in code instead of governed content.

That is acceptable as a temporary editorial override, but it is not suitable for:
- professional milestones;
- recognitions;
- society roles;
- guideline participation;
- appointments;
- invited positions;
- scholarly identifiers;
- visibility/approval changes.

**R1 direction:** migrate these concepts into governed public-profile data owned by neumDesk/Grounded.

### 3.2 Capabilities are currently structurally flat

The public renderer accepts `line.capabilities`, but the user experience does not distinguish between:
- disease domains;
- clinical capabilities;
- research methods;
- translational capabilities;
- digital/innovation capabilities.

R1 should introduce semantic grouping while preserving compatibility with the current flat field.

### 3.3 Track record is too generic

`line.track_record` can display useful facts, but it does not distinguish:
- clinical leadership;
- scientific leadership;
- guidelines/consensus;
- networks/registries;
- awards/recognition;
- programme milestones.

R1 should preserve a concise public view while enabling structured provenance beneath it.

### 3.4 Current activity metrics are informative but not yet navigational

The line page already computes:
- active clinical trials;
- other active studies;
- innovation projects;
- publications.

R1 should turn these into **evidence-linked navigation**, not decorative metrics.

### 3.5 Rich and sparse coordinator profiles are not yet first-class states

A senior coordinator may have substantial public information; another may prefer or have only:
- role;
- specialty;
- short bio;
- selected projects.

The design must not create empty award/milestone boxes.

**Rule:** optional evidence modules render only when public-approved data exists.

---

## 4. Canonical research-line dossier hierarchy

### Layer A — Scientific identity

Always present.

Fields:
- public line title;
- concise research proposition;
- substantive summary;
- hero media;
- thematic keywords.

New optional fields:
- `clinical_question`;
- `research_approach`;
- `public_subtitle`.

Purpose:
Establish the scientific problem and approach before operational detail.

Example conceptual hierarchy:

**Scientific question**  
How can complex airway disease be characterised and treated more precisely?

**Research approach**  
Phenotyping · biomarkers · advanced therapies · real-world evidence · digital follow-up

These must be editorial text, not inferred automatically from arbitrary tags.

---

### Layer B — Scientific scope & capabilities

Always supports the line identity; individual groups appear only when populated.

Canonical capability groups:

1. **Disease / clinical domains**
2. **Clinical capabilities**
3. **Research capabilities**
4. **Translational / laboratory capabilities**
5. **Digital / data / innovation capabilities**

Proposed compatibility model:

```json
{
  "capability_groups": [
    {
      "type": "clinical_domains",
      "label": {"en": "Clinical domains", "es": "Ámbitos clínicos"},
      "items": []
    }
  ]
}
```

Fallback:
If `capability_groups` is absent, current `capabilities` remains valid and renders in one general group.

---

### Layer C — Scientific leadership preview

The line page should show a restrained leadership preview, not a mini-CV.

Required:
- name;
- coordinator role;
- specialty / professional context;
- approved portrait if available;
- concise scientific biography.

Optional evidence signals:
- current clinical leadership;
- current scientific leadership;
- selected recognition;
- professional society / programme role;
- guideline or consensus contribution.

The preview should display **a maximum of 2–3 selected signals**, chosen by editorial priority.

It must never display every available milestone.

A link/action may open a richer scientific profile when more public-approved information exists.

---

### Layer D — Full scientific leadership profile

Progressive disclosure only.

This is the structured replacement for a long flat biography.

Possible modules:

#### Identity
- full name;
- professional title;
- specialty;
- institution;
- current appointment.

#### Professional focus
A short authored statement describing the person's scientific/clinical focus.

#### Career & leadership
Selected appointments and leadership roles.

#### Selected milestones
High-signal chronological or thematic milestones.

#### Recognition
Awards, honours, recognised professional lists, fellowships or invited distinctions.

#### Scientific contribution
- guidelines;
- consensus documents;
- multicentre programmes;
- principal-investigator roles;
- programme development.

#### Networks & professional societies
Only current/relevant public roles.

#### Research footprint
Derived automatically from public neumACt data:
- active studies;
- innovation projects;
- line-linked publications;
- cross-line participation.

#### Scholarly identity
Optional:
- ORCID;
- PubMed;
- institutional profile;
- Google Scholar where appropriate;
- other approved scholarly links.

---

## 5. Coordinator public-profile data contract

R1 proposes a flexible evidence model rather than one giant biography field.

### Core person fields

```json
{
  "public_profile": {
    "headline": {"en": "", "es": ""},
    "short_bio": {"en": "", "es": ""},
    "professional_focus": {"en": "", "es": ""},
    "current_appointment": {"en": "", "es": ""},
    "scholarly_links": []
  }
}
```

### Structured evidence item

```json
{
  "id": "uuid",
  "type": "recognition",
  "title": {"en": "", "es": ""},
  "organisation": "",
  "year": 2026,
  "period_start": null,
  "period_end": null,
  "description": {"en": "", "es": ""},
  "source_url": "",
  "source_label": "",
  "display_priority": 50,
  "visibility": "approved_public",
  "verified_at": "2026-10-02T00:00:00Z",
  "person_approval": "approved"
}
```

Recommended `type` values:
- `appointment`;
- `clinical_leadership`;
- `scientific_leadership`;
- `recognition`;
- `award`;
- `society_role`;
- `guideline`;
- `consensus`;
- `network_role`;
- `registry_role`;
- `programme_milestone`;
- `invited_position`;
- `education` only when materially relevant.

The frontend must not infer prestige or rank evidence items. Editorial priority is explicit.

---

## 6. Public governance states

Every manually curated professional-profile item should support:

- `private` — visible only internally;
- `draft` — editorial work in progress;
- `pending_person_approval`;
- `approved_public`;
- `archived`.

A public page may render only `approved_public`.

Recommended provenance metadata:
- source URL/document;
- source organisation;
- verified date;
- editor;
- person approval state;
- optional review/expiry date.

This allows neumDesk/Grounded to manage public professional facts without hard-coding them into the website.

---

## 7. Grounded / neumDesk ownership model

### neumDesk owns
- authoring;
- evidence entry;
- source/provenance;
- visibility;
- person approval;
- ordering;
- bilingual editorial copy;
- public/private state.

### Grounded may assist with
- identifying missing profile information;
- proposing structured evidence from approved internal/public sources;
- flagging stale items;
- detecting duplicate milestones;
- suggesting public summaries;
- previewing what a line/profile would publish.

Grounded must **not** publish automatically.

### Public website owns
- rendering;
- responsive composition;
- graceful sparse/rich states;
- links between public evidence;
- schema/SEO output;
- read-only display.

---

## 8. Scientific activity model

Current metrics remain:

- clinical trials;
- other studies;
- innovation projects;
- publications.

R1 adds semantic behavior:

- each metric links/scrolls to the corresponding evidence;
- counts remain derived from public records;
- metrics must never be manually duplicated;
- zero-count metrics may remain visible only when their presence helps orientation;
- a small provenance line may state that figures are drawn from the current public research portfolio.

Future optional metrics must be evidence-based and non-competitive.

Do not add vanity metrics merely because they are available.

---

## 9. Portfolio & evidence narrative

The current two-column section is retained conceptually but reframed as a research pipeline.

### Current research portfolio
May contain:
- interventional trials;
- observational studies;
- translational studies;
- registries;
- clinical innovation projects.

### Recent evidence
May contain:
- peer-reviewed publications;
- guidelines;
- consensus documents;
- selected research outputs.

The page should communicate:
**active investigation → scientific output**, without implying that every publication originated from a currently listed study.

---

## 10. Networks & external scientific relationships

Optional section, only when governed public data exists.

Possible relationship types:
- multicentre research network;
- registry;
- scientific society programme;
- consortium;
- university/research institute collaboration;
- partner hospital;
- funded collaboration;
- guideline/consensus group.

Each relationship should support:
- name;
- relationship type;
- short description;
- period;
- URL;
- source/provenance;
- visibility.

Do not automatically expose commercial or industry relationships without explicit public approval and appropriate context.

---

## 11. Rich vs sparse profile behavior

### Minimum viable coordinator state

A coordinator with only:
- name;
- specialty;
- role;
- short approved bio;
- portrait or initials

must still look complete.

No empty modules should appear.

### Rich coordinator state

A coordinator may additionally expose:
- appointments;
- milestones;
- recognitions;
- society roles;
- guideline work;
- scholarly links;
- public research footprint.

The page should reveal richer information progressively.

**Richness changes depth, not hierarchy.**

The scientific line remains the primary subject.

---

## 12. Editorial density rules

To prevent profile content from overtaking the research line:

- leadership preview: maximum 3 evidence signals;
- milestones: selected, not exhaustive;
- recognition: evidence-led, never badge-led;
- society roles: current or scientifically relevant only;
- guideline/consensus work: selected contributions;
- scholarly links: concise external identity row;
- long CV-style lists are prohibited.

---

## 13. Existing frontend compatibility

R1 should preserve current fields during migration:

| Current field | R1 interpretation |
| --- | --- |
| `description` | substantive public summary |
| `deep_content` | research-area narrative |
| `capabilities` | fallback ungrouped capabilities |
| `track_record` | fallback selected evidence |
| `coordinator.public_bio` | fallback short bio |
| `coordinator.public_photo_url` | approved public portrait |
| `coordinator.specialization` | professional context |
| `line.team` | explicit line membership |
| studies endpoint | activity/portfolio evidence |
| projects endpoint | innovation evidence |
| publications endpoint | scholarly evidence |

New R1 fields must be additive.

No current public field should be removed in Phase 1.

---

## 14. Regression boundaries for the R1 milestone

Until an explicit later phase changes them, preserve:

- canonical masthead and Index/Search;
- Phase 3/4 page identities;
- current research overview architecture;
- current line-page semantic order;
- current study/project/publication endpoints;
- global footer;
- mobile/laptop/workstation composition contract;
- Team and Publications fixes already certified;
- graceful API failure states.

R1.1 introduces **no production selectors, markup or runtime behavior**.

---

## 15. Phase 2 entry contract

R1.2 may begin only after this architecture is accepted.

R1.2 scope:
- design the scientific leadership profile system in detail;
- define exact sparse/rich module behavior;
- define coordinator preview vs full profile;
- define the fields that must be added to neumDesk/Grounded;
- decide whether the full profile is an in-page sheet, routed profile page, or responsive hybrid;
- create implementation/regression plan before production work.

No visual implementation should start by simply expanding the existing coordinator bio block.

---

## 16. R1.1 conclusion

The next milestone is not a cosmetic research-line redesign.

It is a shift from:
**research line + coordinator bio + activity lists**

to:
**scientific identity + governed leadership + capabilities + current portfolio + evidence + networks + contributions**.

The public site remains the presentation layer.

neumDesk/Grounded becomes the governed editorial intelligence layer.

That separation is the foundation for every later R1 phase.
