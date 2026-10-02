# Elite Institutional Refinements 01–04 — Baseline

## Status

Refinements 01–04 are implemented, certified and merged.

## 01 — Global typography normalization

The site now uses canonical semantic type roles for:
- hero titles;
- section headings;
- subheads;
- leads;
- body text;
- labels and metadata;
- reading text and captions.

Typography remains responsive, but major semantic roles now share the same underlying scale across Home, Research, Innovation, Publications, Team and Research Line pages.

## 02 — Global spacing and rhythm

Major sections now use shared vertical rhythm tokens.

The system distinguishes:
- major section spacing;
- compact section spacing;
- tight section spacing;
- section-header spacing;
- content gaps;
- grid gaps.

Page-specific layout remains authoritative for composition; the rhythm layer normalizes cadence without flattening page identity.

## 03 — Governed media–interface system

The shared `sci-media` primitive now provides the site-wide media grammar.

Principles:
- clean authored crop;
- no generic decorative overlays;
- restrained border/background ownership;
- optional captions and metadata;
- compatibility with page-specific art direction.

Canonical hero media surfaces on Home, Research, Innovation, Publications, Team and Research Line pages opt into the governed system.

## 04 — Scientific figure / diagram language

The shared scientific figure system uses:
- `sci-figure`;
- `sci-process`;
- semantic steps;
- restrained rules and nodes;
- mono scientific labels;
- captions and explanatory notes.

The first live implementation is the existing Innovation sequence:

Measure → Decide → Work → Connect

No new scientific claims were introduced. Existing content was promoted into a semantic, reusable scientific figure.

## Certification

Canonical test:
`tests/elite-refinements-1-4-certification.spec.js`

Certification includes:
- computed typography equality for major semantic roles;
- section-rhythm equality;
- governed media participation;
- semantic scientific figure structure;
- horizontal containment;
- 390px / 1440px / 2048px visual captures.

## Protected decisions

Future work should not:
- reintroduce arbitrary one-off type scales for equivalent semantic roles;
- create independent section spacing systems without evidence;
- add decorative media overlays as a default treatment;
- create generic card-based diagrams where a scientific process/figure grammar is appropriate.

Page identity remains differentiated through layout, imagery, content density and composition—not inconsistent typography or spacing.
