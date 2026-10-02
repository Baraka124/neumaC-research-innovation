const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(), 'phase4-visual-artifacts');

const VIEWPORTS = [
  { width: 390, height: 844, name: 'phone' },
  { width: 1440, height: 900, name: 'laptop' },
  { width: 2048, height: 1152, name: 'workstation' },
];

const line = {
  id: 'r1-cert-line',
  line_number: 2,
  name: 'Airway Diseases',
  short_name: 'Airway Diseases',
  description: 'Characterisation, stratification and management of airway diseases including severe asthma, COPD, bronchiectasis and cystic fibrosis, with a focus on precision respiratory medicine and advanced therapies.',
  deep_content: 'The line integrates specialist respiratory care with clinical investigation, translational collaboration and digital innovation. Its work spans complex airway phenotyping, therapeutic evaluation and longitudinal follow-up.',
  keywords: ['Severe asthma','COPD','Bronchiectasis','Cystic fibrosis','Biologics','AAT'],
  capability_groups: [
    { type:'clinical_domains', visibility:'approved_public', items:[
      {label_en:'Severe asthma',label_es:'Asma grave',visibility:'approved_public'},
      {label_en:'COPD',label_es:'EPOC',visibility:'approved_public'},
      {label_en:'Bronchiectasis',label_es:'Bronquiectasias',visibility:'approved_public'}
    ]},
    { type:'clinical_capabilities', visibility:'approved_public', items:[
      {label_en:'Advanced phenotyping',label_es:'Fenotipado avanzado',visibility:'approved_public'},
      {label_en:'Biologic therapy pathways',label_es:'Circuitos de terapias biológicas',visibility:'approved_public'}
    ]},
    { type:'research_capabilities', visibility:'approved_public', items:[
      {label_en:'Real-world evidence',label_es:'Evidencia en vida real',visibility:'approved_public'},
      {label_en:'Multicentre observational studies',label_es:'Estudios observacionales multicéntricos',visibility:'approved_public'}
    ]},
    { type:'digital_innovation_capabilities', visibility:'approved_public', items:[
      {label_en:'Remote monitoring',label_es:'Monitorización remota',visibility:'approved_public'},
      {label_en:'Digital follow-up',label_es:'Seguimiento digital',visibility:'approved_public'}
    ]}
  ],
  track_record: ['Multicentre clinical research','Precision respiratory medicine','Digital follow-up initiatives'],
  scientific_relationships: [
    {type:'registry',name:'European Airway Registry',description:'Multicentre clinical registry collaboration.',visibility:'approved_public',url:'https://example.org/registry',display_priority:10},
    {type:'scientific_society',name:'Respiratory scientific working group',description:'Current scientific working-group participation.',visibility:'approved_public',display_priority:20},
    {type:'academic_collaboration',name:'University respiratory research collaboration',description:'Academic collaboration in translational respiratory research.',visibility:'approved_public',display_priority:30}
  ],
  coordinator: {
    id:'coord-1',
    full_name:'Marina Blanco Aparicio',
    specialization:'Pneumology',
    public_bio:'Respiratory physician focused on complex airway disease, advanced therapies and precision follow-up.',
    scientific_leadership:{
      evidence:[
        {type:'scientific_leadership',description:{en:'Coordinates the Airway Diseases research line and contributes to multicentre clinical research.',es:'Coordina la línea de Enfermedades de la vía aérea y contribuye a investigación clínica multicéntrica.'},visibility:'approved_public',display_priority:10},
        {type:'recognition',description:{en:'Approved professional recognition relevant to respiratory research.',es:'Reconocimiento profesional aprobado relevante para la investigación respiratoria.'},visibility:'approved_public',display_priority:10},
        {type:'network_role',description:{en:'Participates in respiratory scientific networks and working groups.',es:'Participa en redes científicas respiratorias y grupos de trabajo.'},visibility:'approved_public',display_priority:10}
      ],
      scholarly_identity:[
        {label:'ORCID',url:'https://orcid.org/0000-0000-0000-0000',visibility:'approved_public'},
        {label:'Google Scholar',url:'https://scholar.google.com/',visibility:'approved_public'}
      ],
      research_footprint:{publications:78,citations:4320,h_index:25,source:'Certification fixture',verified_at:'2026-10-02'}
    }
  },
  team:[
    {id:'person-1',full_name:'Ana Researcher',specialization:'Pneumology'},
    {id:'person-2',full_name:'Luis Engineer',specialization:'Biomedical Engineering',role_on_line:'Digital innovation contributor'}
  ]
};

const studies = [
  {id:'trial-1',title:'Precision biologics in severe asthma',description:'Interventional respiratory study.',study_type:'interventional',status:'active',phase:'Phase IV',principal_investigator_id:'coord-1',co_investigators:['person-1']},
  {id:'study-1',title:'Longitudinal airway phenotyping cohort',description:'Observational multicentre cohort.',study_type:'observational',status:'active',co_investigators:['person-1']}
];

const projects = [
  {id:'project-1',title:'Remote airway follow-up platform',description:'Digital innovation for longitudinal respiratory follow-up.',current_stage:'pilot',category:'Digital health',lead_investigator_id:'person-2'}
];

const publications = [
  {id:'pub-1',title:'Multidomain remission in severe asthma: a multicentre real-world study',journal_name:'Respiratory Research',authors_text:'Blanco-Aparicio M, et al.',published_at:'2026-05-01'},
  {id:'pub-2',title:'Precision phenotyping in complex airway disease',journal_name:'European Respiratory Journal',authors_text:'Research Group, et al.',published_at:'2025-11-01'}
];

const team = [
  {id:'coord-1',full_name:'Marina Blanco Aparicio',specialization:'Pneumology',is_public:true},
  {id:'person-1',full_name:'Ana Researcher',specialization:'Pneumology',is_public:true},
  {id:'person-2',full_name:'Luis Engineer',specialization:'Biomedical Engineering',is_public:true}
];

async function stubLineApi(page) {
  await page.route('**/api/**', async route => {
    const url = route.request().url();
    if (url.includes('/api/research-lines/r1-cert-line/website')) return route.fulfill({ json:{data:line} });
    if (url.includes('/api/research-lines/website')) return route.fulfill({ json:{data:[line]} });
    if (url.includes('/api/team/website')) return route.fulfill({ json:{data:team} });
    if (url.includes('/api/clinical-trials/website')) return route.fulfill({ json:{data:studies} });
    if (url.includes('/api/innovation-projects/website')) return route.fulfill({ json:{data:projects} });
    if (url.includes('/api/news/website')) return route.fulfill({ json:{data:publications} });
    return route.fulfill({ json:{data:[]} });
  });
}

async function captureSection(page, viewport, name, selector) {
  const section = page.locator(selector);
  await expect(section).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await section.screenshot({
    path: path.join(OUTPUT, `r1-line-${viewport.name}-${viewport.width}-${name}.png`),
    animations:'disabled'
  });
}

test.beforeAll(() => fs.mkdirSync(OUTPUT,{recursive:true}));

for (const viewport of VIEWPORTS) {
  test(`R1.8 rich research line visual certification — ${viewport.name}`, async ({page}) => {
    await stubLineApi(page);
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/line/?id=r1-cert-line');

    await expect(page.locator('#lineHero')).toBeVisible();
    await expect(page.locator('#lineOverviewSection')).toBeVisible();
    await expect(page.locator('#lineLeadershipSection')).toBeVisible();
    await expect(page.locator('#lineIntroSection')).toBeVisible();
    await expect(page.locator('#lineWorkSection')).toBeVisible();
    await expect(page.locator('#linePeopleSection')).toBeVisible();
    await expect(page.locator('#lineNetworksSection')).toBeVisible();

    const ordered = await page.evaluate(() => {
      const ids=['lineHero','lineOverviewSection','lineLeadershipSection','lineIntroSection','lineWorkSection','linePeopleSection','lineNetworksSection','lineConnectionsSection'];
      const present=ids.map(id=>document.getElementById(id)).filter(Boolean).filter(el=>!el.hidden);
      return present.every((el,i)=>i===0 || (present[i-1].compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(ordered).toBe(true);

    const overflow = await page.evaluate(() => ({
      viewport:window.innerWidth,
      doc:document.documentElement.scrollWidth,
      body:document.body.scrollWidth
    }));
    expect(overflow.doc).toBeLessThanOrEqual(overflow.viewport+2);
    expect(overflow.body).toBeLessThanOrEqual(overflow.viewport+2);

    await captureSection(page,viewport,'top','#lineHero');
    await captureSection(page,viewport,'leadership','#lineLeadershipSection');
    await captureSection(page,viewport,'pipeline','#lineWorkSection');
    await captureSection(page,viewport,'people','#linePeopleSection');
    await captureSection(page,viewport,'networks','#lineNetworksSection');
  });
}
