# Elite Institutional Refinements 05–08 — Baseline

## Status

Refinements 05–08 are implemented, certified and merged.

## 05 — Photography governance

Public imagery now declares an explicit role:

- `documentary` — approved real people / real institutional photography;
- `editorial` — authored scientific or clinical imagery used to support narrative;
- `illustrative` — intentionally synthetic or illustrative visual storytelling;
- `placeholder` — temporary fallback media only.

Rules:
- documentary media is not stylised to imitate illustration;
- illustrative media is never presented as documentary evidence;
- placeholder media is visually subordinate and identifiable in the system;
- authored crops remain page-specific through composition, not generic overlays;
- default photographic treatment uses no saturation/contrast effects.

## 06 — Iconography system

Shared interface icons now use one canonical line-icon grammar:
- controlled optical sizes;
- consistent stroke width;
- round linecaps and joins;
- currentColor inheritance;
- aligned search and close controls.

The editorial Index mark is protected and is not replaced by the generic icon system.

## 07 — Microinteraction and motion discipline

Motion is governed by canonical tokens:
- instant;
- fast;
- base;
- slow.

Principles:
- motion communicates interaction/state, not decoration;
- typical interaction transitions remain short and restrained;
- large interface surfaces use the base timing only where spatial continuity matters;
- reduced-motion collapses animations and transitions globally;
- photography does not receive aggressive zoom/parallax treatment.

## 08 — Loading, empty and error states

The shared `state-panel` language provides:
- neutral empty state;
- explicit error state;
- success variant;
- dark-surface variant;
- semantic label / title / supporting copy hierarchy.

Live adoption includes:
- Publications;
- Team;
- Research Line;
- global Index / search surfaces.

Existing stable compatibility hooks remain in place, so refinement 08 is additive rather than destructive.

Geometry-matched skeletons remain the preferred loading pattern where layout stability matters.

## Certification

Canonical test:
`tests/elite-refinements-5-8-certification.spec.js`

Certification includes:
- governed photography-role checks;
- Team documentary/placeholder distinction;
- canonical icon computed styles;
- motion-duration and reduced-motion checks;
- forced empty API states;
- forced Research Line error state;
- horizontal containment;
- 390px / 1440px / 2048px visual captures.

## Protected decisions

Future work should not:
- make synthetic/placeholder imagery visually indistinguishable from documentary photography;
- introduce unrelated icon weights/sizes for common controls;
- add decorative continuous motion without functional purpose;
- bypass `prefers-reduced-motion`;
- introduce page-specific ad-hoc empty/error components when the shared state language fits.
