# neumACt — current local public-site baseline

This folder is the **authoritative cumulative local baseline**. Run this version only.

Included current systems:
- H1.4 institutional masthead + premium Editorial Index/Search
- Direct Research primary navigation (research lines remain in Índice)
- Landing L3.2 calibrated editorial front door
- Research programme rebuilt as the six-line scientific gateway
- L01–L06 shared editorial evidence template
- Publications K1.3 high-fidelity editorial system
- Current Innovation surface
- Current Team surface
- Shared canonical footer/runtime/integrity architecture

Earlier runnable packages are superseded for local testing.

## Run locally

```bash
python -m http.server 8080
```

Open: `http://localhost:8080/`


## Landing correction — L3.2
- Landing hero now states research + innovation, not research alone.
- Spanish/English hero typography is content-safe at desktop and short viewport heights.
- The first raised surface is the neumACt programme, with research lines as programme structure.


## H1.4 — Editorial Index/Search calibration
- Fixed the Index/Search state leak: only one view can render at a time.
- Fixed the search-field accessibility label/layout bug that exposed hidden label text.
- Index now opens as a compact floating editorial surface beneath the masthead.
- Search is a focused mode of the same surface, with a direct close action and contained results.
- Repeated arrows were removed from chapters, utilities and search results; one directional cue remains for the Research overview link.
- Desktop Index avoids an unnecessary internal scrollbar; long search results scroll only inside the results list.


## Institutional affiliation + editorial cleanup
- Landing includes one restrained satellite card linking to the official neumACt research-group profile at INIBIC.
- Synthetic public-facing L01–L06 labels are removed from editorial surfaces; research-line numbers remain internal data for ordering and API compatibility.
- The obsolete scroll-to-top control is removed sitewide; it had entered normal document flow and created the white band before the footer.


## Precision pass — institutional signature
- Native neumACt colour is reserved for actual logo marks; ordinary text references are monochrome.
- Landing INIBIC affiliation is an external institutional credential and remains landing-only.
- Footer is now one canonical site-wide institutional footer.
- Research/innovation/team context clusters use flat ledgers rather than card-like table fragments.
- Responsive calibration includes wide desktop, laptop, tablet and mobile footer/ledger behaviour.

## H1.6 — Brand plate + responsive certification
- The masthead now uses the native colour neumACt wordmark inside a restrained institutional white holding field; ordinary text references remain monochrome.
- Index chapter numbering is removed from the public navigation surface.
- Shared masthead, Index/Search and footer have explicit workstation, tablet and small-phone calibration corridors.
- Responsive certification targets include 1920×1080, 1600×900, 1366×768, 1024×768, 834×1194, 430×932, 390×844, 375×812 and 360×800.


## M6.1–M6.4 responsive editorial system
- M6.1 makes `Index / Índice` part of the navigation family, removes Contact from the first-order masthead, uses an explicit mobile Index trigger and adds small-phone Research Lines disclosure.
- M6.3A refines phone Index/Search choreography without introducing a second runtime owner.
- M6.3B treats 881–1440px as a dedicated laptop corridor, protecting masthead containment and the Research/Pedro split-sheet from workstation stretch.
- M6.3C preserves a broad workstation Index while constraining Search interaction measure and excess vertical footprint.
- Automated certification covers phone, tablet, laptop, wide desktop and 2048px workstation containment/interaction invariants.

## M6.4 — Responsive editorial composition contract
`RESPONSIVE_EDITORIAL_COMPOSITION_CONTRACT.md` is now the canonical governing specification for responsive composition, Index/Search behaviour, typography ceilings, reading measure, Research/Pedro containment, media cropping, floating-surface behaviour, institutional affiliation treatment and future Floating Editorial Re-composition work.

The durable rule is:

> **Mobile, laptop and workstation are different compositions, not three scales of one composition.**

Future visual phases must preserve the protected responsive invariants unless an explicit later phase replaces them with equivalent or stronger cross-device evidence and regression coverage.


## Floating Editorial Re-composition — Phase 3 implemented

The page-specific recomposition defined in Phase 1/2 is now implemented and protected by regression coverage.

Canonical implementation baseline:
`FLOATING_EDITORIAL_PHASE3_BASELINE.md`

Implemented identities:
- Home — Open Editorial Threshold
- INIBIC — Architectural Glass Plaque
- Research — Scientific Margin
- Publications — Open Research Folio
- Team — Quiet Open Sheet
- Innovation — Clinical Process Spine

The site remains predominantly flat outside these authored opening transitions. Phase 4 is visual certification/polish only; it should not reopen the page identities without evidence from screenshots or a regression.


## Floating Editorial Re-composition — Phase 4 complete

Phase 4 visual certification and polish is complete.

Canonical closeout baseline:
`FLOATING_EDITORIAL_PHASE4_BASELINE.md`

Completed evidence-based refinements:
- mobile masthead / Index trigger geometry;
- INIBIC Architectural Glass Plaque material and hierarchy;
- Publications empty-state rhythm;
- Team hero illustration restraint.

Research and Innovation required no Phase 4 production changes after visual review.

Phases 1–4 are now closed as the stable Floating Editorial baseline. Future design work should begin as a new milestone rather than continuing Phase 4 by default.


## Research Line Scientific Identity — R1 initiated

The next milestone is **Research Line Scientific Identity (R1)**.

R1.1 is architecture-only and is governed by:
`RESEARCH_LINE_R1_PHASE1_INFORMATION_ARCHITECTURE.md`

R1 extends the current research-line system additively. It does not reopen the completed Floating Editorial baseline by default.

The milestone direction is:
- scientific identity before decoration;
- governed coordinator/professional evidence from the internal editorial system;
- progressive sparse/rich profile states;
- derived public activity from existing studies/projects/publications;
- explicit provenance, visibility and person approval for manually curated professional facts.


## Research Line Scientific Identity — R1.8 complete

R1.1–R1.8 are implemented and visually certified.

Canonical closeout baseline:
`RESEARCH_LINE_R1_PHASE8_CLOSEOUT_BASELINE.md`

The research-line system now includes scientific identity, structured capabilities, scientific leadership, evidence-linked portfolio activity, research pipeline framing, contribution-led people, external scientific relationships and workstation-specific recomposition.

Certified reference widths: 390px, 1440px and 2048px.


## Professional Identity System — P1.1–P1.8 complete

P1.1–P1.8 are implemented, stress-tested and visually certified.

Canonical baseline:
`PROFESSIONAL_IDENTITY_P1_BASELINE.md`

The governing invariant is:

> **Same institutional dignity, different professional evidence.**

Every public team member belongs to one professional-profile population. Leadership and research-line coordination are additive responsibility modules inside the same profile system, not privileged profile templates.

Certified multidisciplinary states include:
- ordinary respiratory clinician;
- research-line coordinator;
- department leader;
- research nurse;
- biomedical engineer;
- sparse resident.

Certified reference widths: 390px, 1440px and 2048px.

Future Team-profile work should preserve equal sheet geometry and identity hierarchy across professions and leadership states unless a later evidence-based milestone explicitly replaces this contract.
