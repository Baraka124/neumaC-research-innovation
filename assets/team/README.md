# Team editorial media

## Multidisciplinary rabbit-team coastal laboratory illustration

Canonical source:
- `multidisciplinary-rabbit-team-wooden-lung-synthetic.png` — 2172 × 724, synthetic editorial illustration.

Production derivatives:
- `multidisciplinary-rabbit-team-wooden-lung-desktop.webp` — full 3:1 composition for desktop.
- `multidisciplinary-rabbit-team-wooden-lung-tablet.webp` — 2.35:1 focal crop for tablet, preserving more of the coastal Coruña context.
- `multidisciplinary-rabbit-team-wooden-lung-mobile.webp` — 16:9 focal crop for mobile.

### Meaning and provenance

The illustration is a conceptual metaphor for multidisciplinary respiratory research. It does **not** depict real neumACt personnel, a real facility, a real device or a documented research event.

The scene shows rabbit clinical, nursing, research, engineering and computing profiles working around a wooden lung model in a bright coastal laboratory. The window view suggests **A Coruña** through a softened seafront skyline, with the **Tower of Hercules** visible in the distance. On the wall, a pulmonary X-ray poster marked **“Pulmonary · neumACt 2026”** reinforces the respiratory context.

### Display contract

- Full-bleed immediately below the canonical public header.
- Desktop preserves the full 3:1 composition.
- Tablet and mobile use deliberate pre-cropped WebP derivatives so the wooden lung remains the focal anchor and the browser does not need to download the 2.5 MB source PNG in normal modern-browser use.
- The original PNG remains as the fallback and archival source.
- Text should not be overlaid on the busy illustration.
- The subtle top wash and bottom glass transition belong to the page composition, not to the source asset. They are deliberately restrained so the skyline remains atmospheric rather than promotional.
- The Team introduction overlaps the hero slightly to create one continuous editorial composition rather than two stacked blocks.

### Replacement rule

Approved documentary photography may later replace this semantic slot without changing the Team data model or information architecture. Do not reuse this illustration as scientific evidence or imply that any rabbit represents a named member of the group.


## Phase 7.9 — Team portrait placeholders

For public team members without approved portraits, the page now uses **editorial rabbit placeholders** derived from the Team hero illustration. These are explicit placeholders only.

### Generic placeholder assets

Located in `assets/team/placeholders/`:
- `rabbit-clinician-a.webp`
- `rabbit-clinician-b.webp`
- `rabbit-nurse.webp`
- `rabbit-researcher.webp`
- `rabbit-lab.webp`
- `rabbit-engineer.webp`

### Standardised replaceable person portraits

Located in `assets/team/people/` and named with a predictable person slug, for example:
- `baraka-laiza.webp`
- `francisco-mendez-salazar.webp`
- `adela-antelo-del-rio.webp`

When a real approved portrait becomes available, replace the file **at the same path and filename**. No code changes are required.


## Editorial portrait placeholders

The files in `assets/team/people/` are **synthetic editorial placeholder portraits** used only for public-page composition where confirmed public photographs are not yet available. Each file already uses the final per-person filename so it can later be replaced in-place with a verified portrait without changing the page code.


## Final no-photo portrait rule
All team members without an approved public photograph use the same clean **clinical rabbit portrait** as a clearly synthetic editorial placeholder. The image is neutral, non-sexualized and contains no human hair or exaggerated human anatomy. Each person-specific placeholder still keeps the stable `assets/team/people/<person-slug>.webp` filename so a verified real portrait can replace it in-place later.


## Phase 7.12.1 final corrections
- The hero keeps only the approved `Pulmonary · neumACt 2026` wall title; invented event/date/venue/slogan copy has been removed.
- Synthetic portrait placeholders use one neutral clinical rabbit portrait with natural rabbit anatomy, no human hair and no sexualized human body features.
