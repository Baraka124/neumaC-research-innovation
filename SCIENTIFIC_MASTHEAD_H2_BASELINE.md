# H2 Scientific Masthead System — H2.1–H2.8 Baseline

## Status

H2 defines the global neumACt scientific masthead as a shared institutional interface rather than a conventional navigation bar.

## Governing principles

> **The masthead is an institutional scientific interface, not a row of links.**

> **Media is part of the interface architecture, not decoration placed inside it.**

The masthead must remain recognisably neumACt even when the logo is visually de-emphasised.

## H2.1 — Scientific masthead architecture

The global masthead is composed of three semantic zones:

1. Institutional lockup
2. Editorial primary navigation
3. Utility interaction cluster

The logo, institutional descriptor and programme identity form one integrated lockup.

Primary navigation is visually centred independently of the left and right zones.

Index, Search and language are utilities, not additional primary navigation destinations.

## H2.2 — Context rail and navigation signature

A thin contextual rail is attached to the lower edge of the masthead.

It communicates:
- current site domain;
- current page / research context;
- a restrained institutional statement.

Examples:
- Research · Research programme
- Research · Airway Diseases
- Innovation · Clinical innovation
- Publications · Scientific output
- Team · Multidisciplinary team

The active navigation state uses a bespoke registration marker and short moving signature rather than a generic underline.

## H2.3 — Index and Search integration

Index and Search remain one editorial surface.

Their top edge aligns with the current masthead state:
- full masthead + context rail;
- scrolled masthead + context rail;
- compact masthead without the rail.

Search is a focused state of the Index system.

On mobile and tablet, the Index is the primary navigation surface.

## H2.4 — Media / interface grammar

Canonical hero media surfaces:
- Home
- Research
- Innovation
- Publications
- Team
- Research line

may receive restrained interface integration:
- soft editorial edge transitions;
- one scientific registration arc;
- low-contrast structural overlays.

The grammar must not become a decorative circle language applied indiscriminately.

Scientific traces should remain sparse enough to preserve the authority of the underlying clinical/research image.

## H2.5 — Scroll / compact state

The full masthead includes the context rail.

After deeper scrolling:
- the masthead compacts;
- the context rail disappears;
- institutional identity remains;
- active navigation state remains;
- Index/Search remain correctly aligned.

The compact state is a recomposition, not merely a scaled version of the full masthead.

## H2.6 — Responsive compositions

### Workstation

The masthead uses the available institutional canvas and preserves a centred editorial navigation field.

### Laptop

The full scientific masthead remains balanced without over-expanding.

### Tablet

The primary navigation collapses into the Index architecture.

### Phone

The masthead retains:
- neumACt identity;
- contextual rail;
- mobile Index entry.

Search/language migrate into the Index where space requires.

The mobile masthead is not a compressed desktop masthead.

## H2.7 — Motion and accessibility

Required:
- keyboard-visible focus treatment;
- current-page semantics;
- language radio semantics;
- Index focus containment;
- Escape close behavior;
- Search focus transfer;
- reduced-motion support;
- no hover-only essential state;
- no horizontal overflow.

Motion is limited to:
- navigation signature tracking;
- Search label reveal;
- Index/Search surface transitions;
- masthead/rail compaction.

## H2.8 — Cross-page visual certification

Canonical certification:
`tests/h2-scientific-masthead-certification.spec.js`

Pages:
- Home
- Research
- Innovation
- Publications
- Team
- Research line

Widths:
- 390px
- 768px
- 1440px
- 2048px

The suite also verifies:
- contextual rail content;
- dynamic research-line title synchronisation;
- active navigation signature;
- Index alignment;
- Search integration;
- compact scroll state;
- mobile Index navigation;
- horizontal containment.

## Protected boundaries

H2 does not reopen:
- R1 research-line internal hierarchy;
- P1 professional-profile architecture;
- page-specific scientific content;
- research portfolio data logic;
- Team professional evidence logic.

Future masthead work should preserve the H2 semantic separation between:
- destination navigation;
- information architecture;
- query/search;
- language/system utilities.

## Signature visual language

The intended neumACt signature is the combination of:

1. **Scientific Context Rail**
2. **Media–Interface Integration**
3. **Scientific Registration Language**

Together these create a masthead system that should remain recognisable without relying solely on the logo.
