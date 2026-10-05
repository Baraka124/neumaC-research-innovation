# neumACt production visual baseline

Status: FROZEN  
Baseline date: 2026-10-05  
Baseline merge: PR #137 / commit `99bb8a8d9662de74af0d0f54f8e45729b6fcf887`

This file records the approved public-site baseline after the workstation, laptop, functional and content-integrity audits. Future work should treat this state as the reference point.

## 1. Naming and institutional hierarchy

- Public product name: **neumACt**.
- The scientific masthead visible affiliation is **Área Sanitaria da Coruña e Cee**.
- **INIBIC** and **SERGAS** remain part of institutional context, footer, metadata and relevant content, but are not repeated in the primary masthead affiliation line.
- Avoid reintroducing obsolete `neumACT` casing.

## 2. Frozen shared masthead

The current masthead geometry, hierarchy and responsive behavior are approved.

Protected characteristics:
- neumACt logo and institutional lockup remain visually separate from primary navigation.
- Primary navigation is independently balanced on wide desktop.
- Research & Innovation and Área Sanitaria da Coruña e Cee remain subordinate to the neumACt mark.
- Index/Search and EN/ES controls retain their present placement and interaction model.
- The secondary scientific context rail remains restrained.
- Mobile, laptop and workstation geometries must not be changed to solve a problem observed at only one breakpoint.

Any future masthead modification requires:
1. evidence of a concrete defect,
2. audit of the current rule cascade before editing,
3. responsive certification at phone, laptop and workstation widths.

## 3. Frozen page identities

The pages are intentionally related but not visually identical.

### Home
- Scientific-glass opening composition is approved.
- INIBIC affiliation card remains a secondary floating institutional element.
- Research programme and current-work compositions remain editorial rather than dashboard-like.

### Research
- Editorial research portfolio structure is approved.
- Leadership, research lines, studies and enquiry surfaces retain their present hierarchy.

### Innovation
- Wide workstation layout may use additional horizontal space.
- Laptop/mobile composition remains constrained and readable.
- Do not convert the clinical process or project register into generic cards.

### Publications
- Scholarly-register identity is approved.
- Featured typographic record, year chronology, research-area selector, search and reader are protected.
- Long live titles/authors/source/context must wrap inside their own geometry and may never collide with adjacent sections.
- Do not flatten Publications into the visual grammar of Training or Research.

### Training / Formación
- Training pathway, research environment, development register and clinical-innovation sequence are approved.
- Training is a primary public destination and must remain in smoke/responsive certification.

### Team
- People-led editorial hierarchy is approved.
- Coordinator and contributor geometry must remain deterministic and responsive.

## 4. Responsive baseline

Core certification widths include:
- 390px phone
- 620px large phone
- 768px tablet
- 1024px small laptop
- 1366px laptop
- 1440px desktop
- 1680px wide desktop
- 2048px hospital workstation

Do not solve workstation issues by globally widening reading measures. White space is intentional where it supports editorial readability.

## 5. Functional surfaces that are frozen

The following interaction models are approved and should be preserved unless a real usability defect is demonstrated:
- Index opening/closing and Escape behavior
- Search mode within the shared Index surface
- language switching and persistence
- Publications article reader and URL semantics
- research-area/publication filters
- enquiry-form progressive disclosure and recoverable states
- mobile Index/disclosure behavior
- research-line and Team profile navigation

## 6. Production integrity rules

Every future UI change should pass:
- clean public-page load with no local 404s or script errors
- HTML/CSS integrity and contrast checks
- canonical/social metadata checks
- JS syntax checks
- no horizontal overflow across certified widths
- current smoke and responsive certification suites

Avoid:
- placeholder/public draft cards,
- duplicated institutional naming,
- stale metadata,
- unnecessary visual convergence between distinct page identities,
- opportunistic redesign during bug fixes.

## 7. Change policy after freeze

The default workflow from this baseline is:

**Audit → identify a concrete defect or requirement → make the smallest justified change → certify → merge.**

Do not perform broad aesthetic passes without explicit authorization.

The next planned creative milestone after this freeze is the clinician-facing promotional video. Video-production work may select, sequence and frame existing approved UI states, but should not trigger site redesign unless the recording exposes a genuine production defect.
