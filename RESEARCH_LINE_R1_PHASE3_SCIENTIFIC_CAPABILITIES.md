# Research Line Scientific Identity — R1.3 Scientific Capabilities Architecture

## Status

Architecture specification only. No production HTML, CSS or JS changes.

## Objective

Replace the current flat capability list with a structured, editorial representation of **what the research line can actually do**.

The capabilities system should help:
- researchers;
- clinical collaborators;
- funders;
- industry partners;
- prospective trainees;
- internal teams

understand the line’s practical scientific strengths without reading a long narrative.

---

## 1. Governing principle

> **Capabilities should describe scientific capacity, not merely repeat disease keywords.**

The page already has keywords and a research summary.

R1.3 must add structure, not duplication.

---

## 2. Canonical capability families

### A. Clinical domains

What patient/disease areas the line works in.

Examples:
- severe asthma;
- COPD;
- bronchiectasis;
- cystic fibrosis;
- alpha-1 antitrypsin deficiency.

### B. Clinical capabilities

What the clinical/research team can do in care-linked research.

Examples:
- advanced phenotyping;
- biologic therapy pathways;
- complex-airway pathways;
- longitudinal follow-up;
- specialist clinical assessment.

### C. Research capabilities

What research methods/capabilities are available.

Examples:
- multicentre studies;
- observational studies;
- real-world evidence;
- patient-reported outcomes;
- biomarker studies;
- epidemiology;
- clinical trial participation.

### D. Translational capabilities

Optional and evidence-led.

Examples:
- biological-sample research;
- microbiome;
- laboratory collaborations;
- biomarker translation;
- specimen-linked studies.

### E. Digital & innovation capabilities

Optional.

Examples:
- telemedicine;
- remote monitoring;
- conversational AI;
- digital phenotyping;
- precision follow-up;
- connected-device research.

---

## 3. Visual behavior

R1.3 must **not** become five generic cards.

Preferred composition:
- flat editorial groups;
- strong group labels;
- thin separators;
- concise item lists;
- asymmetric or two-column layout where appropriate;
- restrained teal as structural accent only.

The capabilities section should feel like a **scientific capability map**, not a feature grid.

---

## 4. Progressive density

### Minimum state

One general capability group is allowed when only the legacy flat `capabilities` field exists.

### Structured state

Two or more semantic groups render when governed grouped data exists.

### Rich state

All relevant groups may render, but empty families disappear.

No line is required to populate all five families.

---

## 5. Data contract

Additive structure:

```json
{
  "capability_groups": [
    {
      "type": "clinical_domains",
      "label": {
        "en": "Clinical domains",
        "es": "Ámbitos clínicos"
      },
      "summary": {
        "en": "",
        "es": ""
      },
      "items": [
        {
          "label": {"en": "Severe asthma", "es": "Asma grave"},
          "description": {"en": "", "es": ""},
          "visibility": "approved_public",
          "display_priority": 10
        }
      ]
    }
  ]
}
```

Allowed group types:
- `clinical_domains`;
- `clinical_capabilities`;
- `research_capabilities`;
- `translational_capabilities`;
- `digital_innovation_capabilities`.

---

## 6. Legacy compatibility

Current `line.capabilities` remains valid.

Migration rule:
1. if `capability_groups` contains approved public groups, render grouped architecture;
2. otherwise render current `capabilities` as one general capabilities group;
3. never require a data migration before the public page can render.

This makes R1.3 additive and regression-safe.

---

## 7. Editorial rules

Capability items should be:
- short;
- concrete;
- professionally meaningful;
- non-promotional;
- verifiable from real line activity.

Avoid:
- vague claims such as “world-class research”;
- duplicated keywords;
- long paragraphs;
- unverifiable superiority claims;
- turning current projects into capabilities unless they represent repeatable capacity.

---

## 8. Relationship to other dossier layers

### Hero
States **what the line studies**.

### Capabilities
States **what the line can do**.

### Current activity
States **what the line is doing now**.

### Portfolio/evidence
Shows **where that activity is visible**.

### Leadership
Shows **who provides scientific leadership and relevant evidence**.

These layers must remain conceptually distinct.

---

## 9. Example: Airway Diseases

A future structured example could be:

### Clinical domains
Severe asthma · COPD · bronchiectasis · cystic fibrosis · alpha-1 antitrypsin deficiency

### Clinical capabilities
Advanced phenotyping · biologic therapy · complex-airway pathways · longitudinal specialist follow-up

### Research capabilities
Real-world evidence · multicentre observational studies · PROs · biomarker studies · clinical trials

### Translational capabilities
Microbiome · biological-sample collaborations · biomarker translation

### Digital & innovation capabilities
Telemedicine · remote monitoring · conversational AI · precision follow-up

This is illustrative only. Public content must come from governed approved data.

---

## 10. Responsive behavior

Desktop/workstation:
- 2–3 editorial columns or staggered groups;
- reading measure remains restrained;
- no large decorative cards.

Tablet:
- two-column or stacked groups depending content length.

Phone:
- one-column normal flow;
- group labels remain visible;
- no horizontal scrolling;
- no compressed chip clouds.

---

## 11. Accessibility

- semantic headings for group labels;
- list semantics for capability items;
- color is never the only grouping signal;
- descriptions remain readable at zoom;
- optional icons must be decorative or properly labelled;
- grouped content remains understandable without visual layout.

---

## 12. Regression boundaries

R1.3 must not change:
- hero identity;
- coordinator system;
- current activity;
- portfolio data endpoints;
- publications;
- people/connections;
- masthead/footer;
- responsive system.

The first implementation should touch only capability rendering and its tests.

---

## 13. R1.3 acceptance criteria

R1.3 is successful when:
- users can distinguish domains from capabilities;
- the line no longer reads like a flat keyword list;
- sparse data still looks intentional;
- legacy capabilities still render;
- grouped data remains optional;
- the section stays editorial and institutional;
- no generic card/dashboard aesthetic is introduced.
