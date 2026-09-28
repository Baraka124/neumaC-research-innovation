# Phase K1.1 — Publications editorial rebuild (local baseline)

This phase is intentionally built **locally on top of Global H1.1**, not pushed directly to GitHub.

## Purpose
Replace the legacy Articles/dashboard page with a publication-led editorial surface that reflects the actual public publishing projection.

## Decisions
- Public route remains `/news/` for compatibility.
- Visible navigation name is **Publications / Publicaciones**.
- Global H1.1 masthead and Index/Search remain the shared navigation owner.
- The Publications hero uses a stable canonical media slot: `assets/publications/publications-hero.webp`.
- The hero does **not** change to whichever API item happens to contain an image.
- Main title has no pre-title metadata kicker.
- One featured item only; no carousel/dots.
- `publication`, `article`, `update`, and `highlight` render as distinct editorial object types.
- Legacy `photo_story` is treated only as a compatibility alias for `highlight`.
- No hero statistics, duplicate sidebar counts, publication-dot timeline, or partnerships wall.
- Reader preserves `?post=<id>` deep links and treats scholarly records differently from authored articles.
- Public data remains sourced from the existing `/api/news/website` projection through `scripts/api.js`.

## Changed files
- `news/index.html`
- `styles/pages/news.css`
- `scripts/pages/news.js`
- `scripts/site.js`
- `assets/publications/publications-hero.webp`
- `assets/publications/README.md`
- Static `/news/` navigation labels across public HTML pages (Articles → Publications)
