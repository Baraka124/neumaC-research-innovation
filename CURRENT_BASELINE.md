# neumACt — current local public-site baseline

This folder is the **authoritative cumulative local baseline**. Run this version only.

Included current systems:
- H1.4 institutional masthead + premium Editorial Index/Search
- Direct Research primary navigation (research lines remain in Índice)
- Landing L3.2 calibrated editorial front door
- Research programme rebuilt as the six-line scientific gateway
- L01–L06 shared editorial evidence template
- Publications K1.3 high-fidelity editorial system
- Current Innovation surface
- Current Team surface
- Shared canonical footer/runtime/integrity architecture

Earlier runnable packages are superseded for local testing.

## Run locally

```bash
python -m http.server 8080
```

Open: `http://localhost:8080/`


## Landing correction — L3.2
- Landing hero now states research + innovation, not research alone.
- Spanish/English hero typography is content-safe at desktop and short viewport heights.
- The first raised surface is the neumACt programme, with research lines as programme structure.


## H1.4 — Editorial Index/Search calibration
- Fixed the Index/Search state leak: only one view can render at a time.
- Fixed the search-field accessibility label/layout bug that exposed hidden label text.
- Index now opens as a compact floating editorial surface beneath the masthead.
- Search is a focused mode of the same surface, with a direct close action and contained results.
- Repeated arrows were removed from chapters, utilities and search results; one directional cue remains for the Research overview link.
- Desktop Index avoids an unnecessary internal scrollbar; long search results scroll only inside the results list.


## Institutional affiliation + editorial cleanup
- Landing includes one restrained satellite card linking to the official neumACt research-group profile at INIBIC.
- Synthetic public-facing L01–L06 labels are removed from editorial surfaces; research-line numbers remain internal data for ordering and API compatibility.
- The obsolete scroll-to-top control is removed sitewide; it had entered normal document flow and created the white band before the footer.


## Precision pass — institutional signature
- Native neumACt colour is reserved for actual logo marks; ordinary text references are monochrome.
- Landing INIBIC affiliation is an external institutional credential and remains landing-only.
- Footer is now one canonical site-wide institutional footer.
- Research/innovation/team context clusters use flat ledgers rather than card-like table fragments.
- Responsive calibration includes wide desktop, laptop, tablet and mobile footer/ledger behaviour.

## H1.6 — Brand plate + responsive certification
- The masthead now uses the native colour neumACt wordmark inside a restrained institutional white holding field; ordinary text references remain monochrome.
- Index chapter numbering is removed from the public navigation surface.
- Shared masthead, Index/Search and footer have explicit workstation, tablet and small-phone calibration corridors.
- Responsive certification targets include 1920×1080, 1600×900, 1366×768, 1024×768, 834×1194, 430×932, 390×844, 375×812 and 360×800.
