# Phase 5.2 — Landing page editorial compression

This pass refines the public landing page without changing the shared header contract.

## Decisions

- The photographic lung hero is retained, but capped to a laptop-friendly 560–640px height.
- The hero message now foregrounds **clinical and translational respiratory research** instead of repeating the service label.
- The four research metrics remain, but the ledger is denser and no longer includes a redundant portfolio CTA.
- All six research lines remain visible on the homepage as a compact three-column research atlas. The full Research page remains the place for depth.
- Homepage research rows are populated by `/api/research-lines/website` and only show meaningful secondary metadata (for example, active-study counts).
- The former large “Evidence in motion” publication feature is replaced with **Now at neumACt**: one backend-governed featured public item, three recent public outputs, and a reserved public agenda surface.
- The agenda currently uses explicit non-factual placeholders with dates marked TBC. It is intentionally ready for a future governed public-events endpoint.
- Innovation now shows one governed featured project rather than a homepage carousel.
- Institutional context is text-first. Weak raster logo treatments are removed from the landing page.
- Contact and footer spacing are tightened on the homepage.

## Ownership

- Shared header/navigation: `styles/components.css` + `scripts/site.js`
- Homepage composition: `styles/pages/home.css`
- Public dynamic data: `scripts/api.js`
- Homepage markup: `index.html`

No page-specific header rules were introduced.
