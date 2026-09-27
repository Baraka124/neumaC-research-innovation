# Research editorial media

This folder owns the replaceable editorial media used on `/clinical/`.

- `pi-pedro-marcos.jpg` — current real portrait crop supplied from the existing institutional profile reference.
- `research-hero-clinician-lungs.jpg` — synthetic editorial placeholder; replace with approved photography when available.
- `line-*.jpg` — synthetic research-line placeholders, except that the transplantation image is derived from the existing neumACt lung visual. They are intentionally named by research line so approved photography can later replace each file without changing public-page markup or API contracts.

All public rendering uses `object-fit: cover`; replacement images should therefore keep their important subject away from extreme edges.
