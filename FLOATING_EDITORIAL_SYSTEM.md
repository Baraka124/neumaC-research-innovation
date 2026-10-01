# neumACt Floating Editorial System

**Status:** M2 shared visual contract  
**Applies to:** Research, Publications, Team and selected future identity surfaces  
**Implementation:** `styles/editorial-surfaces.css`

## Purpose

The floating language is a controlled editorial device, not a card style. It exists to create hierarchy between an atmospheric or evidentiary visual field and a concise authored information surface.

It must preserve the neumACt public design principles: clinical research institute + scientific editorial publication + modern health technology; premium through restraint; mobile as editorial re-composition.

## Surface hierarchy

### Level A — Editorial Float

Use only for major identity moments such as a page opening where an image or visual field and an editorial sheet belong together.

Current candidates:
- Research hero
- Publications hero

Rules:
- one major float per opening composition;
- strong but restrained elevation;
- thin institutional border;
- no glassmorphism;
- no decorative gradients on the sheet;
- the overlap must remain visibly intentional;
- content must still work with long text, missing media and bilingual copy.

### Level B — Raised Sheet

Use for important contextual compositions that need separation but should not visually compete with a hero.

Current candidate:
- Team editorial introduction

Rules:
- lower elevation than Level A;
- smaller radius;
- overlap optional and modest;
- should feel like an editorial page lifted from the canvas, not an app card.

### Level C — Flat Institutional Flow

Default for the majority of the site.

Use for:
- research-line rows;
- studies;
- publication indexes;
- project records;
- people indexes;
- institutional context;
- collaboration information.

Rules:
- borders and spacing provide hierarchy;
- no unnecessary shadows;
- no repeated rounded containers;
- information density remains calm but efficient.

## Responsive behaviour

### Desktop
- Level A may use a substantial controlled overlap.
- The surface remains visually connected to the media below or behind it.
- Text measure and grid proportions must prevent the surface from becoming a full-width banner without purpose.

### Tablet
- Reduce overlap and column count.
- Preserve the relationship between visual field and editorial sheet.
- Avoid narrow secondary columns.

### Mobile
- Never preserve desktop absolute positioning merely by shrinking it.
- Re-compose the sheet in document flow.
- Retain only a small overlap so the floating identity remains perceptible.
- The surface must fit completely inside the viewport.
- Portraits, titles and actions must never be clipped.
- Long dynamic titles must be constrained before they become full-screen walls.

## Geometry

Shared geometry is defined in `styles/editorial-surfaces.css` using:
- `--editorial-surface-bg`
- `--editorial-surface-border`
- `--editorial-surface-border-soft`
- `--editorial-float-radius`
- `--editorial-raised-radius`
- `--editorial-float-shadow`
- `--editorial-raised-shadow`
- responsive overlap tokens

Page CSS owns layout. The shared system owns the visual character of the surface.

## What this system is not

Do not use it to:
- turn every section into a card;
- create ornamental floating boxes;
- imitate SaaS dashboards;
- add depth where a flat rule and spacing would communicate better;
- conceal weak hierarchy with shadows;
- imply scientific ranking through visual prominence.

## Review test

Before creating a new floating or raised surface, ask:

1. Is this a major identity or orientation moment?
2. Does the surface clarify the relationship between media and information?
3. Would a flat composition work just as well?
4. Does the mobile version become a real re-composition?
5. Is this the only surface at this hierarchy level in the immediate composition?
6. Does the design still work without the image or with longer backend content?

If the answer to 1 or 2 is no, use Level C.
