const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(),'phase4-visual-artifacts');

const line = {
  id:'p1-line-airway', line_number:2,
  name:'Airway Diseases', short_name:'Airway Diseases'
};

const people = [
  {
    id:'p1-clinician', full_name:'Dr. Francisco Méndez Salazar', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología',
    public_bio:'Respiratory physician contributing specialist clinical care and multidisciplinary respiratory research.',
    clinical_expertise:[
      {label:{en:'General respiratory medicine',es:'Neumología general'},visibility:'approved_public'},
      {label:{en:'Complex respiratory assessment',es:'Valoración respiratoria compleja'},visibility:'approved_public'}
    ],
    current_contributions:[
      {label:{en:'Multidisciplinary respiratory care',es:'Atención respiratoria multidisciplinar'},visibility:'approved_public'}
    ],
    research_contributions:[
      {label:{en:'Clinical study participation',es:'Participación en estudios clínicos'},visibility:'approved_public'}
    ]
  },
  {
    id:'p1-nurse', full_name:'Ana Research Nurse', is_public:true,
    staff_type:'research_nurse', specialization:'Research Nursing',
    primary_dept_name:'Servicio de Neumología',
    public_bio:'Research nurse supporting respiratory studies and participant pathways.',
    expertise_areas:[
      {label:{en:'Research participant pathways',es:'Circuitos de participantes en investigación'},visibility:'approved_public'}
    ],
    current_contributions:[
      {label:{en:'Study coordination and follow-up',es:'Coordinación y seguimiento de estudios'},visibility:'approved_public'}
    ]
  },
  {
    id:'p1-engineer', full_name:'Luis Biomedical Engineer', is_public:true,
    staff_type:'biomedical_engineer', specialization:'Biomedical Engineering',
    primary_dept_name:'Research & Innovation',
    public_bio:'Biomedical engineer contributing digital and translational technology to respiratory research.',
    areas_of_expertise:[
      {label:{en:'Digital health systems',es:'Sistemas de salud digital'},visibility:'approved_public'},
      {label:{en:'Clinical technology integration',es:'Integración de tecnología clínica'},visibility:'approved_public'}
    ],
    innovation_contributions:[
      {label:{en:'Remote respiratory follow-up tools',es:'Herramientas de seguimiento respiratorio remoto'},visibility:'approved_public'}
    ]
  },
  {
    id:'p1-coordinator', full_name:'Dra. Airway Coordinator', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología',
    coordinates_line:line,
    public_bio:'Respiratory physician working in complex airway disease.',
    clinical_expertise:[
      {label:{en:'Severe asthma',es:'Asma grave'},visibility:'approved_public'},
      {label:{en:'Bronchiectasis',es:'Bronquiectasias'},visibility:'approved_public'}
    ],
    research_contributions:[
      {label:{en:'Multicentre airway research',es:'Investigación multicéntrica de vía aérea'},visibility:'approved_public'}
    ],
    professional_networks:[
      {label:{en:'Respiratory scientific working group',es:'Grupo de trabajo científico respiratorio'},visibility:'approved_public'}
    ],
    orcid_id:'0000-0000-0000-0002',
    research_footprint:{publications:42,citations:1200,h_index:18,source:'Certification fixture',verified_at:'2026-10-02'}
  },
  {
    id:'p1-chief', full_name:'Dr. Department Leader', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología', is_chief_of_department:true,
    public_bio:'Respiratory physician with clinical, research and institutional leadership responsibilities.',
    clinical_expertise:[
      {label:{en:'Precision respiratory medicine',es:'Medicina respiratoria de precisión'},visibility:'approved_public'}
    ],
    leadership_roles:[
      {label:{en:'Scientific programme leadership',es:'Dirección científica del programa'},visibility:'approved_public'}
    ]
  }
];

async function stubP1(page){
  await page.route('**/api/**',async route=>{
    const url=route.request().url();
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:people}});
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:[line]}});
    if(url.includes('/api/research-lines/p1-line-airway/website')) return route.fulfill({json:{data:{...line,team:people.slice(0,4),coordinator:people[3]}}});
    return route.fulfill({json:{data:[]}});
  });
}

const VIEWPORTS=[
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
];

const PROFILES=[
  ['clinician','francisco-mendez-salazar'],
  ['nurse','ana-research-nurse'],
  ['engineer','luis-biomedical-engineer'],
  ['coordinator','airway-coordinator'],
  ['leader','department-leader']
];

test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

for(const viewport of VIEWPORTS){
  for(const [kind,slug] of PROFILES){
    test(`P1.8 professional profile visual certification — ${kind} ${viewport.name}`,async({page})=>{
      await stubP1(page);
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto('/team/?person='+slug);

      const overlay=page.locator('#teamProfileOverlay');
      const sheet=page.locator('#teamProfileSheet');
      const content=page.locator('#teamProfileContent');
      await expect(overlay).toHaveAttribute('aria-hidden','false');
      await expect(sheet).toBeVisible();
      await expect(content.locator('#teamProfileName')).toBeVisible();
      await expect(content).toContainText(/Professional identity|Identidad profesional/);

      await page.evaluate(() => {
        const cookie=document.getElementById('cookieBanner');
        if(cookie)cookie.style.display='none';
      });

      const geometry=await sheet.evaluate(el=>{
        const r=el.getBoundingClientRect();
        return {left:r.left,right:r.right,width:r.width,height:r.height,viewport:window.innerWidth};
      });
      expect(geometry.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewport+1);
      expect(geometry.width).toBeGreaterThan(0);

      await sheet.screenshot({
        path:path.join(OUTPUT,`p1-profile-${viewport.name}-${viewport.width}-${kind}.png`),
        animations:'disabled'
      });
    });
  }
}

test('P1.8 clinician and coordinator retain identical identity hierarchy',async({page})=>{
  await stubP1(page);
  await page.setViewportSize({width:1440,height:900});

  await page.goto('/team/?person=francisco-mendez-salazar');
  const clinician=await page.locator('#teamProfileSheet').evaluate(el=>({
    width:el.getBoundingClientRect().width,
    heading:parseFloat(getComputedStyle(el.querySelector('#teamProfileName')).fontSize)
  }));

  await page.goto('/team/?person=airway-coordinator');
  const coordinator=await page.locator('#teamProfileSheet').evaluate(el=>({
    width:el.getBoundingClientRect().width,
    heading:parseFloat(getComputedStyle(el.querySelector('#teamProfileName')).fontSize)
  }));

  expect(Math.abs(clinician.width-coordinator.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(clinician.heading-coordinator.heading)).toBeLessThanOrEqual(.1);
  await expect(page.locator('.team-profile__section--leadership')).toBeVisible();
});
