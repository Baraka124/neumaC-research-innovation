# neumACt Responsive Certification

**Baseline:** current cumulative local public site

## Certified viewport classes

- 1920×1080 — large hospital / research workstation
- 1600×900 — desktop / scaled workstation
- 1366×768 — compact hospital desktop
- 1024×768 — small desktop / tablet landscape corridor
- 834×1194 — iPad portrait class
- 430×932 — large smartphone
- 390×844 — standard smartphone
- 375×812 — compact smartphone
- 360×800 — narrow smartphone

## Pages checked

Landing, Research, Research Line, Publications, Team and Innovation were checked against the shared responsive CSS system. The critical 1366, 1024, 834 and 390 widths were exercised across all six public page classes. The remaining wide and narrow corridors were also checked for horizontal overflow.

## Global navigation checked

The shared masthead and the generated editorial Index/Search surface were exercised at all certified widths. Desktop uses a contained floating surface; tablet and mobile recompose to a full-height navigation/read surface. No tested viewport introduced horizontal overflow.

## Release conditions

- No horizontal document overflow at certified widths.
- Header logo holding field remains visible and proportionate.
- Primary navigation remains usable at desktop/tablet landscape widths.
- Tablet/mobile navigation switches to the editorial Index model.
- Landing Programme and INIBIC credential preserve reading order.
- Shared institutional footer stacks without clipped legal or contact content.

Dynamic API content remains governed by the content-safety rules in `DESIGN_PRINCIPLES.md`: long titles, missing media, bilingual content and variable metadata must continue to be handled without changing these responsive guarantees.
