# neumACt Public Design Principles

**Status:** canonical design reference for the public website  
**Scope:** landing page first; principles should be reused across Research, Innovation, Articles, Team and line-detail pages.  
**Institutional naming:** **Área Sanitaria da Coruña e Cee · INIBIC · SERGAS**. Public-facing copy should not use the narrower hospital acronym as the institutional identity.

## 1. The website is an editorial front door, not an internal directory

The homepage must answer four questions quickly:

1. What is neumACt?
2. How does the group think and work?
3. What is happening now?
4. Why and how would someone engage with it?

Detailed taxonomies belong on their destination pages. The homepage should not repeat the full Research navigation simply because the data exists.

## 2. Clinical questions are the organising idea

The recurring neumACt narrative is:

**Observe → Investigate → Design → Evaluate → Transfer**

Clinical need is the starting point. Research, technology and innovation are methods for answering that need. This logic should inform copy, page sequencing and visual hierarchy.

## 3. Multidisciplinary by design

Public copy should reflect the real mix of profiles without turning the page into an org chart: specialised clinicians, nursing, biomedical researchers, technical profiles, scientists and external collaborators.

Disciplines are described in relation to the clinical question, not as isolated professional silos.

## 4. Public projection, not a second CMS

The public site is the governed public projection of internal research system.

`internal research system → review / approval → public API → neumact.org`

Wherever possible, content that has already been approved for public visibility should populate the public site automatically. The public website must not require parallel manual maintenance of the same facts.

## 5. Backend-driven components must be content-safe

A live component must tolerate:

- long and short titles;
- missing media;
- zero, one or many records;
- slow API responses;
- unavailable API responses;
- bilingual content;
- variable metadata.

Long backend content must never be allowed to destroy page proportions. Clamp, prioritise and progressively reveal rather than letting a title become a full-screen wall.

## 6. Earn the space

Every visible element must answer one of these questions:

- Does it orient the visitor?
- Does it communicate identity or evidence?
- Does it enable a useful action?
- Does it create necessary hierarchy?

If not, remove it.

Avoid decorative rules, duplicated CTAs, generic subtitles, pseudo-badges, unexplained metrics and ornamental UI that has no informational role.

## 7. Premium means restraint

The visual language is **clinical research institute + scientific editorial publication + modern health technology**, not SaaS, startup dashboard or generic hospital website.

Premium quality comes from:

- proportion;
- typography;
- image quality;
- alignment;
- whitespace with purpose;
- disciplined contrast;
- carefully limited interaction.

Do not compensate for weak hierarchy with more decoration.

## 8. Density should feel intentional

Whitespace is valuable only when it improves reading or hierarchy. Avoid full-screen sections when the content can communicate clearly in less space.

On a typical laptop viewport, the user should understand the purpose of a section without repeatedly scrolling just to reach its conclusion.

The homepage should contain more useful information per scroll than a marketing landing page, while still feeling calm.

## 9. Hero images are atmospheric evidence, not wallpaper

Scientific or clinical imagery can establish identity strongly, but it must:

- support text legibility;
- crop intelligently across viewports;
- feel credible rather than sci-fi;
- avoid decorative overlays without purpose;
- remain secondary to the page's message.

The lung hero establishes the visual bar for future imagery.

## 10. Typography carries the prestige

Use the display serif for major editorial statements, not for every title.

Use sans-serif for navigation, body content and operational information. Use mono sparingly for metadata, sequence labels, research codes and institutional microcopy.

Large serif typography must be controlled by content length. Dynamic titles use stricter size and line-clamp rules than authored section headings.

## 11. Navigation is shared infrastructure

The header is a site-wide component, not a homepage component.

- Real neumACt logo only.
- Research is a direct primary navigation destination; it must never compete with a neighbouring line-menu trigger.
- Research-line shortcuts live in the global Índice and on the Research programme page itself.
- Search, EN/ES, Índice and Contact are the only utility controls.
- The active state is quiet and precise.
- Shared header visual ownership lives in `styles/components.css`.
- Shared header interaction lives in `scripts/site.js`.

Page CSS must not redefine the header.

## 12. Do not duplicate navigation taxonomy in content

Research lines belong in:

- the global Índice for rapid cross-site navigation;
- the Research programme page as the primary scientific gateway;
- individual line pages for evidence and detail.

The homepage should explain the group's research mindset and scientific scope instead of listing the same L01–L06 taxonomy again.

## 13. “Now” should be curated and governed

The homepage activity surface can combine approved:

- publications;
- articles;
- study updates;
- project milestones;
- public scientific events;
- announcements.

The page presents only what deserves current attention. The backend remains the source of truth.

Agenda placeholders must never invent factual dates or events. Until an event is governed from internal research system, placeholders remain clearly non-factual.

## 14. Innovation is a clinical mindset, not a project carousel

Innovation copy should explain *why* innovation belongs in a respiratory clinical environment.

A clinical problem may require a better way to measure, visualise, monitor, transport, decide or work—not only a new treatment.

Homepage innovation should show one strong governed example. Portfolio depth belongs on the Innovation page.

## 15. Collaboration must explain purpose

Institutional affiliation and external collaboration are related but different.

**Our environment:** Área Sanitaria da Coruña e Cee, INIBIC, SERGAS.  
**Our collaborators can include:** technology companies, pharmaceutical industry, universities, research centres and healthcare organisations.

The reason for collaboration should always be explicit: better evidence, better tools and better care for patient cohorts and the public service.

Do not display partner logos merely to fill space. Logos appear only when the relationship is real, public and approved.

## 16. Ask for commitment progressively

Forms should not dominate the page before the visitor has decided to engage.

Homepage contact begins as an editorial invitation and expands the form only after explicit intent. Progressive disclosure reduces visual noise and makes the interaction feel deliberate.

## 17. Footer is orientation, not a dumping ground

The footer should contain only:

- neumACt identity;
- concise institutional context;
- primary navigation;
- a contact path;
- legal links.

Do not use decorative landmarks, floating compliance acronyms, duplicated accreditation claims or oversized empty regions unless they have a clear user-facing purpose.

## 18. Shared chrome should remain shared

Common header and footer decisions should live in shared CSS/JS. Homepage-specific storytelling belongs in `styles/pages/home.css` and homepage markup.

When a page establishes a reusable design pattern, document it here before copying it elsewhere. Reuse the principle and component logic, not accidental page-specific dimensions.

## 19. Responsive design is editorial re-composition

Mobile is not the desktop page squeezed smaller.

At narrower widths:

- reduce simultaneous columns;
- preserve reading order;
- keep primary actions visible;
- simplify secondary metadata;
- maintain minimum touch targets;
- avoid horizontal overflow;
- preserve the hierarchy established on desktop.

## 20. Accessibility is part of the visual system

All interactive elements require keyboard access, focus visibility and meaningful state semantics.

Use native controls where they provide better accessibility. Examples: `<details>/<summary>` for progressive disclosure, real links for navigation, buttons for state changes.

Respect reduced-motion preferences. Never depend on hover alone for essential content.

## 21. Failure states are designed states

A loading, empty or failed API state must never look like a broken blank area.

Every live surface needs a deliberate:

- loading state;
- empty state;
- error state;
- stable fallback layout.

## 22. Page review checklist

Before calling a page finished, ask:

- Is the page explaining something, or merely listing data?
- Are important actions obvious without being loud?
- Has every decorative element earned its place?
- Does the page remain coherent with long backend content?
- Does the section use more height than its information deserves?
- Is any content duplicated elsewhere in navigation?
- Is the institutional naming correct?
- Does the page still work if media or API content is missing?
- Is the mobile reading order intentional?
- Does the page feel like the same neumACt system as the landing page?

## 23. Portfolio pages should orient before they enumerate

A destination page such as Research may contain more data than the homepage, but it should still begin with a clear editorial proposition. The visitor should understand the programme before being asked to scan records.

Research taxonomy belongs on the Research page, but it should be presented as a compact index that points to deeper line pages rather than as six oversized standalone cards.

## 24. A line overview must explain enough to support a choice

The Research overview is a doorway to each line, but it still needs enough editorial substance to help a visitor understand the difference between areas. A concise backend-provided description is therefore first-class content alongside the line title, coordinator when public and useful study metadata.

Capabilities, exhaustive keyword sets, complete track records and deeper evidence belong on the individual line page. Avoid accordions that reproduce the detail page inside the overview.

## 25. Data-heavy sections need progressive disclosure

A public research portfolio should not resemble an internal administration table.

Filters remain available because they are useful, but they should stay visually secondary until requested. The initial view should prioritise readable study titles and the metadata needed to understand them.

Long result sets should show a meaningful first group and progressively reveal the remainder. Do not force the user through a full database dump before they reach the next section.

## 26. Compliance is evidence, not decoration

GCP, regulatory frameworks, accreditation and institutional infrastructure should only appear when they answer a concrete user question or support a documented claim.

Do not use compliance acronyms, regulatory labels, site-initiation claims or accreditation language as decorative hero statistics or footer ornaments.

## 27. One global footer system

The editorial footer established on the landing page is the canonical public footer. Destination pages should reuse its hierarchy and restraint rather than introducing page-specific certification strips, affiliation walls or decorative institutional blocks.

## 28. Context should be concise and relational

Institutional context should explain how the programme is connected to clinical practice and research infrastructure. It should not become a logo wall.

Use concise relational copy and only the institutions that clarify the operating environment: Área Sanitaria da Coruña e Cee, INIBIC and SERGAS.

## 29. Research areas are editorial chapters, not numbered cards

A research area should be understood before it is categorised. The Research overview therefore leads with the title, a concise description, people and live activity. Internal codes may support filtering and data relations, but they are not the visual identity of the public programme.

Avoid repeated numbered tiles, oversized ghost numerals and identical card anatomy when the content deserves a more editorial reading experience.

## 30. Descriptions outrank taxonomy

On a research portfolio page, a useful two- or three-line description is more valuable than another tag, code or keyword list. Backend-provided descriptions should be treated as first-class public content and given stable, content-safe space.

Keywords remain supporting metadata. They should never substitute for an explanation of what the research area actually investigates.

## 31. Public pages never expose internal-platform vocabulary

Visitors should never need to understand the internal software, publishing workflow or operational system used to maintain content. Public copy speaks only about the research programme, current studies, approved activity and collaboration.

Internal architecture belongs in internal documentation, not in public-facing labels, notes, placeholders or error messages.

## 32. Editorial asymmetry can create hierarchy without ranking science

Magazine-level composition may use unequal columns, staggered rhythm, scientific motifs and varied whitespace to avoid a mechanical card grid. This asymmetry is compositional, not evaluative: it must not imply that one research line is more important than another.

Repeated content should share a design grammar without being forced into identical boxes.

## 33. Do not decorate scientific content to make it feel scientific

Scientific authority should come from the research itself: precise copy, real data, approved media, publications, people and evidence. Decorative circles, waveforms, abstract networks or pseudo-diagrams should not be added merely to signal “science”.

If a visual is used, it should be real, attributable and relevant: an approved clinical image, a genuine chart, a documented study figure or another source that has earned its place.

## 34. Interaction labels must state the action

A bare plus sign, chevron or ambiguous expansion control is not enough for important interactions. Progressive-disclosure controls should say what will happen: for example, “Open inquiry form”, “Filter studies” or “Show more studies”.

Icons may reinforce the label but must not carry the meaning alone.

## 35. Vogue-level editorial quality means confidence, not ornament

Borrow the confidence of high-end editorial design: strong typography, disciplined crops, controlled asymmetry, sharp hierarchy and selective moments of surprise. Do not borrow fashion styling literally.

The scientific institution remains the subject. The design should make complex work feel considered, current and worth reading.

## 36. Never publish design commentary as content

Internal design reasoning must never appear as public copy. Sentences such as “the description matters as much as the title” explain a design choice to the team; they do not explain the research to a visitor.

Public copy should answer a visitor question, describe the programme, provide evidence or support an action.

## 37. Literal copy beats campaign copy on institutional pages

Editorial confidence does not require slogans. Research destination pages should prefer durable, descriptive headings such as “Research areas”, “Clinical studies” or “Research collaboration” when a more expressive sentence does not add concrete meaning.

Use memorable language selectively, especially on the landing page. Deeper programme pages should become more precise as the visitor moves closer to the evidence.

## 38. Tightening is a design phase

Once the information architecture is correct, improve quality by removing rather than adding. Review vertical rhythm, repeated metadata, decorative treatment, duplicated keywords and interaction chrome before introducing another visual device.

A premium page should feel edited.

## 39. Use the page width as editorial composition, not empty space

When a content block spans the page, both sides must have a job. Do not place all meaningful content in one narrow column and leave the rest as decorative whitespace. On research-area overviews, use a clear split between scientific narrative and practical orientation such as coordination, current activity and the route to the detail page.

Whitespace remains important, but it should separate ideas rather than compensate for missing composition.

## 40. Titles and explicit CTAs may both lead to detail pages

For editorial overviews, the title can be a conventional text link and the section can also provide an explicit action such as “View research line”. Avoid making the entire large surface clickable: it turns an editorial spread back into a card and makes interaction less predictable.

## 41. Public identity must also be enforced on backend-derived copy

Static HTML checks are not enough when public descriptions come from a shared data source. Legacy acronyms or naming can re-enter the website through live content. The public rendering layer should normalise known legacy institutional naming to the approved public identity before display.


## 42. Leadership hierarchy should be explicit, not inferred

When one person carries programme-wide scientific responsibility, present that role once in a deliberate leadership feature rather than forcing the visitor to infer it from repeated line-level metadata. The same person may still appear later as coordinator of a specific line; those are distinct roles and should remain visually distinct.

## 43. Repeated metadata labels should become column grammar

If the same label would repeat in every row, move it into the section structure when possible. A single `Coordination` column heading is stronger than six identical `Coordination` labels. Repeat the data, not the chrome.

## 44. Overview rows only show information about that research line

A research-line overview row should explain that line: title, concise scope, focus terms, coordinator and route to the detail page. Project inventories, study inventories, portfolio counts and unrelated programme metadata belong in their own sections or on the detail page.

## 45. Replaceable media slots are part of the content architecture

Editorial photography should live in stable, semantic file slots named by purpose rather than by campaign or date. Synthetic placeholders may establish composition during design, but approved photography should later replace the same files without changing templates or API contracts.

Use `object-fit: cover`, document the expected crop, and keep the important subject away from extreme edges.

## 46. Read-more is a content safety valve, not a default interaction

Research descriptions should remain concise on overview pages. When live copy exceeds the intended rhythm, clamp it to a stable editorial preview and provide a literal `Read more / Leer más` control. Do not truncate silently with ellipses, and do not make every description expandable when it already fits.

## 47. Research-line pages tell one scientific story

A line detail page is not a dashboard and not a copy of the internal database. Its sequence should answer: what is this line, who leads it, what does it investigate, what is active now, what evidence has emerged, who contributes, and how can someone collaborate.

The same module grammar is inherited by every line, while empty or irrelevant modules disappear cleanly.

## 48. The line coordinator is the human anchor of the line

Programme-wide leadership belongs on the programme overview. On a specific research-line page, the coordinator becomes the primary person: use a substantial editorial portrait, name, line role, affiliation and concise public biography.

Do not repeat the programme PI on every line simply because the person appears in an inferred team relation. If the programme PI also coordinates a specific line, the coordinator treatment is sufficient on that page.

## 49. Hero media must be specific to the line

Do not reuse the same lung image across every respiratory research page. Airway disease, transplantation, interventional pneumology, sleep, thoracic surgery and precision medicine should each have a relevant approved media slot.

The subject can be anatomy, a clinical procedure, a device, imaging, a laboratory method or another truthful representation of that line. Synthetic media may be used temporarily as a replaceable placeholder, never as evidence.

## 50. Current work is not a KPI block

Clinical studies and clinical-innovation projects are evidence of activity. Present them as readable editorial lists with title, restrained metadata and a calm route to more information. Avoid large counts, status pills, coloured badges and admin-table styling unless the metadata is necessary to understand the item.

## 51. Studies and innovation remain distinct but visually related

A research line may contain both clinical trials/studies and clinical-innovation projects. Keep those concepts distinct in the information architecture while giving them one visual grammar so the visitor understands them as two forms of current work within the same line.

## 52. Metadata should support reading, not become the design

Phase, recruitment status, project stage and category should appear as quiet text when useful. Do not turn every attribute into a pill, badge or labelled box. Repetitive metadata chrome is one of the fastest ways for a public research page to feel generated or administrative.

## 53. The detail system must degrade gracefully with live data

The public line template should never fabricate content to fill a composition. If a line has no authored track record, capabilities, publications, team members or innovation projects, that module should disappear or reduce naturally. The layout must remain intentional in every valid data state.

## 54. Editorial assets can override live media without forking the data model

When an approved public portrait or line-specific editorial image is available before the backend media record is updated, the public renderer may use a documented, name-scoped local override. The backend remains the default source of truth for everyone else. Overrides must be explicit, replaceable and isolated in the media mapping rather than scattered through templates.

## 55. Coordinator features are one composition, not three columns

A research-line lead section should read as one editorial unit: portrait + identity on one side, scientific scope on the other. Do not split portrait, name/biography and scientific narrative into three narrow vertical columns. That geometry creates fragile wrapping and large dead space.

The portrait and identity must feel inseparable. The scientific story then sits beside them as a distinct but related reading block.

## 56. Public names must never be forced into vertical towers

A person's name should normally occupy one or two lines at desktop sizes. If a name wraps into three or four large lines, reduce the display scale or increase its measure before changing the person's name treatment.

Honorifics such as `Dr.` or `Dra.` are metadata, not the visual identity. The name itself should carry the hierarchy.

## 57. Coordinator biography is a concise public profile, not a CV

The coordinator biography on a research-line page should explain scientific focus and leadership in roughly three to five readable lines. Chronological career history, publication totals, training dates and institutional appointments belong on a dedicated people profile if one exists.

Where an approved editorial summary exists, prefer it to a raw backend biography. The public language layer must also prevent an English-only biography from appearing inside a Spanish page.

## 58. Use whitespace instead of full-height divider rules

Do not use full-height vertical borders to manufacture structure between portrait, profile and scientific content. Strong typography, column width and spacing should establish the hierarchy. A short horizontal rule may separate modules when needed, but structural lines should never dominate the reading experience.

## 59. The hero owns the line narrative

A research-line hero should already answer what the line is, what it focuses on and why the accompanying image belongs there. Do not repeat the same scientific description immediately below the hero in a second `About this line` block.

Use the space after the hero for new information: who coordinates the line, what is active now, what evidence exists and who contributes.

## 60. Live figures must be earned by public records

A number on a public research page is evidence, not decoration. Counts for clinical trials, clinical studies, clinical innovation and publications must be derived from the current public API response for that line on the current page load.

Never invent a large number because it improves the composition. If a valid category is zero, show zero or let the corresponding chart explain the absence.

## 61. Clinical innovation is a first-class research output

Every line can contain both clinical studies/trials and clinical-innovation projects. The line system must never collapse innovation into generic `projects` or omit it because the studies module is already populated.

Clinical innovation should appear in the live activity summary, in the portfolio visualisation and in the current-work list whenever public records exist.

## 62. Editorial charts summarise; they do not decorate

Charts on public research pages must answer a clear question with live data: current activity by type, publication activity over time, or innovation maturity. Use restrained axes, typography and colour; avoid gradients, 3D effects, ornamental grids and dashboard chrome.

Every chart must fit its container at all supported breakpoints. Use responsive SVG viewBoxes, `min-width: 0` on grid children and graceful empty states rather than horizontal overflow.

## 63. Coordinator and activity belong together

After the scientific hero, the next major composition pairs the line coordinator with the current public activity of that line. The coordinator is the human anchor; the live portfolio is the evidence anchor.

Do not place another long scientific-scope essay between them. The visitor should move directly from identity to leadership and evidence.

## 64. Loading is part of the editorial experience

When a page depends on several public API calls, do not reveal half-built modules that jump into place independently. Hold the line experience behind a restrained skeleton until the essential line identity and public evidence streams have resolved or failed gracefully.

A loading state should approximate the final geometry so that content does not shift dramatically when data arrives.

## 65. Shared architecture allows line-specific visual character

All research lines inherit the same hierarchy, data contract and responsive rules. Their character can still differ through truthful hero media, coordinator portraits and the mix of evidence returned by the line.

Variation must come from the science and the public records, not from six separate templates.

## 66. Clinical innovation begins with a problem, not a technology category

The public Innovation page begins with a respiratory clinical or research need: something that may need to be measured, monitored, visualised, decided, communicated or organised differently.

AI, devices, software, imaging, logistics and other technologies appear only when a real project or defined use case requires them. Do not organise the page around a catalogue of fashionable technologies.

## 67. Innovation projects are evidence, not a carousel

Current public innovation projects demonstrate how the programme works. Present them as readable editorial records with title, concise scope, category and current stage when those fields are available from the public API.

Do not fabricate clinical questions, outcomes, investigators, validation results, funding, regulatory status or project maturity to complete a composition. Missing information should disappear cleanly.

## 68. Capability claims must be specific and supportable

Do not publish unsupported performance numbers, recruitment promises, regulatory-pathway claims, institutional-access promises or generic statements such as “world-class”, “cutting-edge” or “rapid validation”.

When a capability genuinely matters, describe the concrete environment, infrastructure or documented experience that supports it. Evidence should carry the prestige.

## 69. Innovation collaboration is scientific, not a commercial package

Public collaboration language should start from a defined clinical or research need. Appropriate routes can include clinical/research collaboration, technology evaluation and co-development.

Avoid sales language about priority access, exclusive opportunities, shared reward, guaranteed timelines, network access or intellectual-property arrangements unless a specific approved public programme actually establishes those terms.

## 70. Synthetic editorial media must remain replaceable and non-evidentiary

Synthetic imagery may establish composition when approved clinical photography is not yet available, but it must never imply that a depicted person, facility, device or result belongs to neumACt.

Document synthetic provenance in the asset folder rather than publishing internal design commentary on the page. Store the image in a stable semantic media slot so approved photography can replace it without changing the template or API contract.

## 71. Destination pages inherit the established public visual grammar

Research, Innovation, Team, Articles and line-detail pages are not independent redesign opportunities. They inherit the visual system established by Landing and the accepted Research page: the same Fraunces/DM Sans/DM Mono hierarchy, the same navy/teal/off-white palette, the same container widths, rule language, section density, focus treatment and editorial footer.

A destination page may vary its composition when the content requires it, but it must not introduce a new palette, a new display-weight convention, a new card language or a different spacing system merely to appear distinctive.

## 72. Image crop and focal position are part of the component contract

Approved and placeholder media must be tested inside the actual responsive slot, not judged as standalone images. Define the expected aspect ratio, `object-fit` and focal `object-position` for each semantic slot.

Portraits should preserve faces and shoulders without forcing important facial features against the crop. Clinical hero media should keep the relevant clinical action or evidence inside the crop across desktop and mobile widths. When a crop cannot do this reliably, replace the source image rather than compensating with overlays or decorative framing.

## 73. Leadership is a role within the team, not a separate caste

A Team page may orient visitors with programme leadership and research-line coordinators, but those roles must not visually demote the wider team. Leadership is shown first for scientific orientation; the complete public roster remains a first-class section with readable names, professional contributions and research relationships.

Do not turn non-leadership profiles into tiny directory rows after giving coordinators oversized editorial treatments.

## 74. Multidisciplinary team pages explain why the mix of professions matters

The Team page should explain that contemporary respiratory research can require specialist and primary care, nursing, biomedical and laboratory research, study coordination, engineering, computing, data and contributions from other clinical services or research partners.

Describe disciplines in relation to the research question and patient pathway, not as an organisational chart or a collection of professional silos. Cross-service participation should not be mislabeled as external collaboration merely because a person sits outside Pulmonology.

## 75. Portrait systems are editorial infrastructure

Public people imagery should use a deliberate crop contract rather than relying on the raw source proportions. Leadership, coordinator and roster portraits may use different display sizes, but they should share consistent face-safe framing, restrained tonal treatment and stable aspect ratios.

Do not crop foreheads, chins or identifying features simply to fill a slot. When a known approved portrait needs a different focal position, encode that position explicitly in the public renderer or page CSS.

## 76. The complete team deserves readable scale

Once leadership and coordination roles have been explained, the complete public roster must still read as a primary institutional section. Do not compress the remaining team into tiny rows, badges or low-contrast metadata simply because more people are present.

Use enough portrait and typographic scale for names, professional contribution and research-line relationships to be readable without interaction. Filters and profile drawers are optional utilities, not prerequisites for understanding who is in the group.

## 77. Public people roles are shown once; research-line links are not ownership

On the Team page, programme leadership and named research-line coordinators may receive dedicated orientation sections, but the same people should not be rendered again in the remaining-team roster. Each public person should have one primary placement in the page hierarchy.

Research-line relationships on a person profile describe current public research activity or contribution. They must not imply that multidisciplinary staff are owned by, permanently assigned to, or restricted to one research line. The wider team can work across lines and services according to the clinical or scientific question.

## 78. Public people metadata follows the selected language

Names remain as authored, but professional roles, common specialties, department labels and the six canonical research-line names should follow the active EN/ES language when a reliable public translation is known.

Do not allow a Spanish page to become a patchwork of English line names, or an English page to inherit untranslated routine labels such as `Neumología`, merely because the source record is shared. Unknown authored terms may remain unchanged rather than being guessed.

## 79. Editorial hero media must be delivered for the slot, not only composed for it

Once a hero image is accepted visually, prepare responsive production derivatives that preserve its focal subject at desktop, tablet and mobile widths. Use efficient modern formats where possible, keep the original source as a fallback, and preload only the variant appropriate to the current breakpoint.

Performance optimisation must not change the intended crop, invent content or reduce important faces/actions to unreadable scale.


## 80. Public people copy is descriptive, not philosophical

Team pages should state who participates, what roles they hold and how collaboration is organised. Avoid contrastive or manifesto-style language such as “not professional silos”, explanations of the page design, or claims about interdisciplinarity that the roster already demonstrates.

When cross-service participation matters, describe it literally: which kinds of services or expertise may contribute, and under what project/study context. Do not invent fixed organisational relationships from public data.


## 81. Hero imagery and opening content may form one editorial composition

A destination-page hero does not have to end before the page content begins. When the accepted imagery benefits from it, the opening content surface may overlap the lower edge of the hero slightly so image and information read as one editorial composition.

Keep the overlap shallow, preserve the shared container width, and avoid floating-card styling or heavy shadows. Local visual cues such as a city skyline should remain atmospheric; do not add redundant location labels when the image already supplies the context.

## 82. Deeper team profiles use progressive editorial disclosure

The multidisciplinary roster should remain readable without interaction. When a visitor wants more context on a non-leadership team member, open a restrained right-side editorial profile sheet rather than replacing the roster with cards, accordions or a generic centred modal.

The sheet may show only governed public information: portrait, professional role, affiliation, authored public biography, current research-line relationships and approved scholarly-profile links. Omit missing sections cleanly rather than inventing biography, expertise or outputs. Programme leadership and research-line coordinators continue to use their dedicated research-line pathways instead of duplicating the same profile interaction.


## 83. The wider team is an editorial people index

The multidisciplinary roster should not look like an HR directory or a grid of employee cards. Keep people first-class through generous name typography, restrained portrait/monogram treatment, horizontal editorial rhythm and progressive disclosure. The compact roster shows identity and professional context; deeper research relationships, biography and scholarly profiles belong in the profile reading surface. Missing public data is omitted rather than replaced with generic prose.


83. Adaptive editorial profile behaviour: multidisciplinary team profiles must not use one fixed spatial model across all devices. Large desktop may use an inset side sheet, laptops a tighter drawer, tablets a wide or bottom-origin reader, and mobile a full-screen vertical reader.
84. Replaceable placeholder portrait contract: when approved portraits are unavailable, Team may use clearly non-documentary editorial placeholders. Placeholder assets should be named with stable person slugs so real portraits can later replace them without code changes.

85. Team profile deep links and browsing: public multidisciplinary profiles may expose stable person-slug URLs and previous/next navigation, but must preserve the same factual public-data rules and return cleanly to the Team context.


85. Synthetic team placeholders stay neutral: placeholder portraits may use the Team rabbit visual language, but they must read as institutional portrait surrogates — one rabbit, posed toward camera, neutral professional clothing, no human hair, no sexualized anatomy, and no activity scene. Real approved portraits always take precedence.
86. One strong layered opening is enough: the Team introduction may rise into the hero as a single editorial surface, but later sections should return to flat institutional rhythm rather than repeating floating cards.


## Global H1 — Editorial Index Masthead

85. **The masthead is a site-wide system, never a page-specific composition.** Landing, Research, Innovation, Articles, Team, research-line pages and secondary public pages inherit the same header behaviour from shared owners.
86. **Primary destinations remain visible on desktop.** `Inicio / Home`, `Investigación / Research`, `Innovación / Innovation`, `Artículos / Articles` and `Equipo / Team` are not hidden behind a hamburger on ordinary desktop/laptop widths.
87. **Índice / Index is the programme map.** The Index control opens one editorial navigation surface containing the four programme chapters, the six research lines, institutional utilities and current-content context. It is not a card dashboard.
88. **Research keeps a fast path.** The chevron beside Research may expose the six research lines directly; explanatory research copy belongs to the research page or Index rather than a second competing mega-menu.
89. **Search belongs to the masthead spatial system.** Header search and `Cmd/Ctrl+K` open Search inside the same Index surface. Search may resolve pages, research lines, people and public articles; it must not launch a visually unrelated modal.
90. **Responsive navigation re-composes.** Large desktop uses an attached editorial surface below the navy masthead; tablets simplify its columns; iPad portrait and mobile use a full-height editorial index rather than a narrow off-canvas drawer.
91. **Institutional navigation uses typography and rules, not decorative cards.** Fraunces chapter titles, DM Mono identifiers, whitespace, hairline separators and the existing teal orientation accent carry hierarchy.
92. **The header is intentionally calm while closed.** Creative depth appears only when the visitor explicitly opens Index or Search. The closed masthead must not become a utility portal or compete with page content.


93. **Navigation labels follow the active language.** The global Index and Search must use reliable EN/ES names for canonical research lines and routine people metadata rather than exposing whichever source-language string happens to arrive from the API.
94. **Editorial interaction should not move the layout.** Hover and focus states in the Index, line list and Search results may change colour, background and arrow position, but should not shift the text block itself through padding changes.
95. **Mobile Index prioritises navigation immediately.** The full-height mobile Index uses one compact brand/action bar; avoid stacking a second toolbar above the chapter list when Search can live in the same top action cluster.
96. **Search reflects real public content.** When a filter is offered for a public content type, Search should query/index the corresponding public records when available rather than presenting only the destination landing page.

## Publications editorial rules

- Publications is an editorial index, not a dashboard. Avoid hero KPIs, duplicate counts, sidebars and decorative output timelines.
- Do not force publications, articles, updates and highlights into one generic card system; each content object should expose the metadata appropriate to its type.
- Featured content is a single editorial decision, never an auto-rotating carousel.
- The Publications hero uses one stable governed media slot. Live post imagery belongs to the featured/content surfaces and must not unexpectedly replace the page identity image.
- The main page title should stand on its own without redundant mono metadata immediately above it.
- A scholarly publication record is not automatically a neumACt-authored article. Bibliographic records and long-form editorial reading surfaces must remain distinct.


## Publications K1.2 — advanced editorial architecture
- Publications is a progressive-disclosure research index: discover → browse → read. The public surface must not expose backend complexity as dashboard UI.
- Different publication object types must retain distinct visual grammar. Scholarly records do not require imagery; articles/highlights may use media; updates remain compact.
- One curated Selection replaces carousels and rotating featured content.
- Research-line filtering is a secondary facet, not a duplicate Research page.
- Detail surfaces adapt spatially: large-screen editorial reader, desktop drawer, tablet raised sheet, mobile full-screen reader.
- H1.1 masthead remains a shared global owner and must not be forked inside Publications.


## Publications K1.3 / Global H1.2

- Publications uses a compact image-led opening: the hero establishes scientific context, while the raised editorial panel carries the page title and factual scope. The image must never force the reader to scroll excessively before reaching content.
- Scholarly output is presented as an index, not as repeated cards. Publication rows prioritize date, title/authors, journal/DOI and research-line context. Decorative arrows are not repeated on every row.
- Metadata labels are permitted when they describe the content object itself (for example `Publicación científica`), but not as decorative kickers above major page titles.
- The Global Index is a compact editorial navigation surface, not a second page. Desktop Index height should remain controlled, use the same shared H1 owner files, and avoid repeated utilities or decorative arrows.
- Public-facing copy must remain factual. Avoid slogans, self-congratulatory claims and language that implies clinical impact or authorship beyond the recorded data.

## Global H1.3 — institutional masthead lockup
- The neumACt wordmark, research descriptor and institutional affiliation form one canonical lockup. They must align as a unit and must never wrap independently into ad-hoc header layouts.
- On wide desktop, the masthead uses a three-zone optical grid: brand lockup / primary navigation / utilities. This keeps primary navigation truly centred regardless of the unequal left and right content widths.
- Responsive simplification is intentional: full lockup on wide desktop; affiliation line drops first; descriptor drops next; mobile keeps the wordmark only.
- The right utility cluster has hierarchy. Index is the primary interface control; Contact remains present but visually quieter. Search and language are utilities, not competing calls to action.
- Masthead refinements belong only to the shared header owner. Page styles must not locally override the brand lockup.


## Landing precision principles
- The landing page is the institutional front door, not a dashboard. Avoid vanity counts or derived figures whose semantics are ambiguous.
- The first screen should identify neumACt and orient the visitor to its actual research programme.
- Research lines are more useful than generic process diagrams on the landing page.
- Public current-activity surfaces must contain governed real data only; never render TBC/fake agenda placeholders.
- The raised-overlay composition may be used as a signature device, but the surface must carry real orientation content rather than decorative copy.
- Homepage section titles stand on their own; decorative kickers are omitted unless they encode real object metadata.
- Placeholder hero media must be explicitly replaceable and must not drive factual claims about the institution.


92. Landing current-work convergence: the homepage should show a minimal cross-section of governed activity rather than duplicate dedicated Publications or Innovation pages. One current public research output and one current clinical innovation project are sufficient.
93. Homepage reduction rule: once a dedicated destination exists, the landing page should preview it rather than recreate its internal information architecture.


## Landing L3 calibration
- Homepage sections should become denser after the opening programme orientation; the landing is an institutional front door, not a second copy of dedicated content pages.
- Never fabricate decorative media for governed records. If a current publication or project has no public media, use a deliberate text-led layout.
- Institutional environment and contact surfaces should be factual and compact; they must not visually outrank the research programme.


## Landing L3.1 — microcalibration
- Final landing calibration is reduction-only: no additional sections or decorative UI.
- Hero media remains a replaceable placeholder; layout must not depend on the placeholder artwork.
- The research-programme overlay uses restrained radius/shadow and compact line density so it reads as editorial structure, not a card component.
- Current Work is self-explanatory from its governed records; avoid explanatory meta-copy that repeats the visible composition.
- Hover states may clarify interaction but must not create card-like movement or layout shift.
- The runnable baseline is cumulative; historical phase notes are development history, not separate runtime choices.


## 26. A primary destination must not compete with its own shortcut menu

If a main navigation label is itself an important page, do not place an adjacent dropdown control that encourages visitors to bypass it. The Research programme is the scientific gateway to L01–L06, so **Research remains a direct link**. Research-line shortcuts live in the global Índice, where their relationship to the programme is explicit.

## 27. Research-line pages are evidence pages, not dashboards

A public research line should communicate scientific scope, coordination and current evidence. Use factual counts only when they are derived from current public records. Avoid charts, maturity graphics and metric cards when they merely visualise small counts or make the page resemble internal administration software.


### Brand and research-line display
- Use the coloured neumACt wordmark treatment only when the brand name is acting as a display identity on a light surface; body-copy mentions remain normal text and dark surfaces use the inverse logo for contrast.
- Research-line numbers are implementation/order metadata, not primary public-facing labels. Prefer the actual scientific area name.
- Do not add floating utility arrows or back-to-top controls merely as decoration; directional icons must communicate a real destination or external transition.
- Institutional credibility should be sourceable and quiet: one verified affiliation/profile card is stronger than a logo wall.


### Brand colour discipline
The blue–teal–green neumACt colour treatment is reserved for the actual logo asset or an explicit brand-mark context. The word “neumACt” inside headings, prose, search copy, metadata, and institutional descriptions is normal text and inherits the surrounding typographic colour. On dark mastheads the official mark is shown as an inverse mark for contrast; the native-colour mark is used on a light logo plate in the institutional footer.

### Institutional clusters
Grouped facts should read as ledgers: aligned columns, hairline rules, restrained labels, and no card chrome unless the grouped object genuinely behaves as a card.


## Brand mark discipline

The blue → teal → green neumACt treatment belongs to the **actual logo mark only**. Ordinary written references to neumACt inherit the surrounding text colour. On dark institutional chrome, the native colour logo must sit on a restrained light holding field rather than being recoloured or treated as decorative text.

## Responsive certification is a release requirement

Every cumulative public baseline must be checked at representative workstation, tablet and phone widths. At minimum: 1920×1080, 1600×900, 1366×768, 1024×768, 834×1194, 430×932, 390×844, 375×812 and 360×800. A release fails certification if any core public page or the Index/Search system introduces horizontal overflow, clipped primary actions or accidental content overlap. Responsive changes should recompose hierarchy rather than merely shrink desktop geometry.
