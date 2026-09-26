# neumAC R&I — Consolidation Phase 1

This folder is the first clean baseline produced from the uploaded site snapshot.

## What changed

- `core.css` and `polish.css` are retired.
- Design variables now live only in `styles/tokens.css`.
- Global reset/typography/accessibility primitives live in `styles/foundation.css`.
- Shared header/navigation/card/control/motion rules live in `styles/components.css`.
- Embedded `<style>` blocks were extracted into `styles/pages/*.css`.
- The obsolete 102px two-tier-header body offset was removed. Header geometry now uses `--hdr` (68px desktop, 60px mobile).
- The homepage announcement bar now calculates its offset from `--hdr`.
- Existing JavaScript/API behavior and page markup were intentionally preserved in this phase.

## Intentionally NOT done yet

- Inline `style="..."` attributes are not yet converted to semantic classes.
- `header-enhance.js`, `animations.js`, and page-local script blocks are not yet consolidated.
- Visual redesign is not started yet; this phase establishes a legible cascade first.

## Local replacement workflow

Copy the contents of this folder into your local repository working tree, review the diff, run the checks, then commit and push from your machine.

Suggested commit message:

`refactor(ui): establish canonical CSS foundation`
