# Research Line Scientific Identity — R1.8 Closeout Baseline

## Status

R1.8 whole-page visual recomposition and certification is complete.

The research-line page is now treated as one continuous scientific dossier rather than a sequence of independently designed modules.

## Certified composition

The current research-line hierarchy is:

1. Research-line hero / scientific identity
2. Scientific scope and capabilities
3. Scientific leadership
4. Current activity / portfolio intelligence
5. Research pipeline
   - Current research portfolio
   - Recent scientific evidence
6. People & contributions
7. Scientific networks & external collaborations
8. Across the programme
9. Research enquiry

## Responsive baseline

The governing responsive rule remains:

> **Mobile, laptop and workstation are different compositions, not three scales of one composition.**

Certified widths:
- 390px phone
- 1440px laptop
- 2048px workstation

### Phone

- one-column scientific reading flow;
- leadership evidence stacks without becoming a staff profile;
- research pipeline becomes sequential;
- contribution evidence remains explicit;
- external scientific relationships remain readable without horizontal compression;
- persistent site chrome is excluded from certification captures so page composition can be judged independently.

### Laptop

- the 1440px composition remains the primary balanced editorial reference;
- no R1.8 widening or density changes are applied in the laptop corridor;
- leadership, pipeline, people and networks retain the established restrained hierarchy.

### Workstation

- research-line pages no longer remain constrained by the global 1380px laptop maximum;
- above 1700px the line page uses a controlled 1680px editorial canvas;
- hero, scientific leadership, research pipeline and contributor ledger recompose to use the additional space;
- global site layout tokens remain unchanged.

## R1.1–R1.8 completed system

R1.1 — Scientific dossier information architecture  
R1.2 — Scientific leadership preview and trajectory drawer  
R1.3 — Structured scientific capabilities with legacy fallback  
R1.4 — Evidence-linked current activity / portfolio intelligence  
R1.5 — Scientific networks and external relationships  
R1.6 — Research pipeline / evidence narrative  
R1.7 — Contribution-led people view  
R1.8 — Whole-page visual recomposition and responsive certification

## Protected decisions

Future work should not casually reopen:
- person-centric full profile pages;
- generic capability cards;
- dashboard treatment of activity metrics;
- logo-wall treatment of scientific networks;
- staff-directory treatment of contributors;
- causal linking of publications to studies unless explicit governed provenance exists;
- workstation fallback to a centered 1380px laptop composition.

Any future changes to these areas should be justified by new evidence and accompanied by responsive regression coverage.

## Certification evidence

The deterministic rich-line certification harness is:
`tests/research-line-visual-certification.spec.js`

It verifies:
- section ordering;
- horizontal containment;
- rich scientific leadership state;
- research pipeline composition;
- contribution-led people state;
- external scientific relationships;
- workstation canvas expansion.

The corresponding visual artifacts are produced through the existing Site Integrity workflow.

## Next milestone

R1.9 should be treated as a **cross-line stress test**, not another design phase.

Its purpose is to verify that the same architecture remains intentional when research lines have:
- sparse coordinator information;
- no scientific networks;
- legacy flat capabilities only;
- zero activity metrics;
- many contributors;
- very long or very short titles;
- different combinations of studies, projects and publications.

R1.9 should prefer fixture diversity and regression coverage over further visual invention.
