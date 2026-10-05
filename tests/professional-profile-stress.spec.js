const { test, expect } = require('@playwright/test');

const airwayLine = {
  id:'line-airway', line_number:2,
  name:'Airway Diseases', short_name:'Airway Diseases',
  team:[]
};
const precisionLine = {
  id:'line-precision', line_number:6,
  name:'Personalised Respiratory Medicine, Management & Clinical Innovation',
  short_name:'Personalised Respiratory Medicine, Management & Clinical Innovation',
  team:[]
};

const people = [
  {
    id:'chief', full_name:'Dr. Department Leader', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología', is_chief_of_department:true,
    public_bio:'Respiratory physician with clinical, research and institutional leadership responsibilities.',
    clinical_expertise:[
      {label:{en:'Rare respiratory disease',es:'Enfermedad respiratoria rara'},visibility:'approved_public'}
    ],
    professional_contributions:[
      {label:{en:'Specialist respiratory care',es:'Atención respiratoria especializada'},visibility:'approved_public'}
    ],
    scientific_contributions:[
      {label:{en:'Clinical research programme',es:'Programa de investigación clínica'},visibility:'approved_public'}
    ],
    leadership_roles:[
      {label:{en:'Programme scientific leadership',es:'Dirección científica del programa'},visibility:'approved_public'}
    ],
    orcid_id:'0000-0000-0000-0001'
  },
  {
    id:'coord', full_name:'Dra. Airway Coordinator', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología',
    coordinates_line:airwayLine,
    public_bio:'Respiratory physician working in complex airway disease.',
    clinical_expertise:[
      {label:{en:'Severe asthma',es:'Asma grave'},visibility:'approved_public'},
      {label:{en:'Bronchiectasis',es:'Bronquiectasias'},visibility:'approved_public'}
    ],
    research_contributions:[
      {label:{en:'Multicentre airway research',es:'Investigación multicéntrica de vía aérea'},visibility:'approved_public'}
    ],
    professional_networks:[
      {label:{en:'Respiratory working group',es:'Grupo de trabajo respiratorio'},visibility:'approved_public'}
    ],
    research_footprint:{publications:42,citations:1200,h_index:18,source:'Fixture',verified_at:'2026-10-02'}
  },
  {
    id:'clinician', full_name:'Dr. Francisco Méndez Salazar', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología',
    public_bio:'Respiratory physician contributing to specialist clinical care and multidisciplinary respiratory research.',
    clinical_expertise:[
      {label:{en:'General respiratory medicine',es:'Neumología general'},visibility:'approved_public'},
      {label:{en:'Complex respiratory assessment',es:'Valoración respiratoria compleja'},visibility:'approved_public'}
    ],
    current_contributions:[
      {label:{en:'Multidisciplinary respiratory care',es:'Atención respiratoria multidisciplinar'},visibility:'approved_public'}
    ],
    research_contributions:[
      {label:{en:'Clinical study participation',es:'Participación en estudios clínicos'},visibility:'approved_public'},
      {label:{en:'Hidden draft contribution',es:'Contribución privada'},visibility:'private'}
    ]
  },
  {
    id:'nurse', full_name:'Ana Research Nurse', is_public:true,
    staff_type:'research_nurse', specialization:'Research Nursing',
    primary_dept_name:'Servicio de Neumología',
    public_bio:'Research nurse supporting respiratory studies and participant pathways.',
    expertise_areas:[
      {label:{en:'Research participant pathways',es:'Circuitos de participantes en investigación'},visibility:'approved_public'}
    ],
    current_contributions:[
      {label:{en:'Study coordination and follow-up',es:'Coordinación y seguimiento de estudios'},visibility:'approved_public'}
    ],
    scientific_networks:[
      {label:{en:'Clinical research nursing network',es:'Red de enfermería de investigación clínica'},visibility:'approved_public'}
    ]
  },
  {
    id:'engineer', full_name:'Luis Biomedical Engineer', is_public:true,
    staff_type:'biomedical_engineer', specialization:'Biomedical Engineering',
    primary_dept_name:'Research & Innovation',
    public_bio:'Biomedical engineer contributing digital and translational technology to respiratory research.',
    areas_of_expertise:[
      {label:{en:'Digital health systems',es:'Sistemas de salud digital'},visibility:'approved_public'},
      {label:{en:'Clinical technology integration',es:'Integración de tecnología clínica'},visibility:'approved_public'}
    ],
    innovation_contributions:[
      {label:{en:'Remote respiratory follow-up tools',es:'Herramientas de seguimiento respiratorio remoto'},visibility:'approved_public'}
    ],
    research_lines:[precisionLine]
  },
  {
    id:'long-name', full_name:'Dra. María Cristina Fernández Domínguez', is_public:true,
    staff_type:'attending_physician', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología'
  },
  {
    id:'resident', full_name:'Dra. Sparse Resident', is_public:true,
    staff_type:'medical_resident', specialization:'Neumología',
    primary_dept_name:'Servicio de Neumología'
  }
];

async function stubProfessionalApi(page){
  await page.route('**/api/**', async route => {
    const url=route.request().url();
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:people}});
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:[airwayLine,precisionLine]}});
    if(url.includes('/api/research-lines/line-airway/website')) return route.fulfill({json:{data:{...airwayLine,team:[people[1],people[2],people[3]]}}});
    if(url.includes('/api/research-lines/line-precision/website')) return route.fulfill({json:{data:{...precisionLine,team:[people[4]]}}});
    return route.fulfill({json:{data:[]}});
  });
}

test('P1 ordinary clinician receives a complete professional profile without leadership framing', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=francisco-mendez-salazar');
  const content=page.locator('#teamProfileContent');
  await expect(content).toBeVisible();
  await expect(content).toContainText('Dr. Francisco Méndez Salazar');
  await expect(content).toContainText(/Professional identity|Identidad profesional/);
  await expect(content).toContainText(/Clinical \/ professional expertise|Experiencia clínica/);
  await expect(content).toContainText(/Current contribution|Contribución actual/);
  await expect(content).toContainText(/Research & innovation contribution|Contribución a investigación/);
  await expect(content).not.toContainText('Hidden draft contribution');
  await expect(content.locator('.team-profile__section--leadership')).toHaveCount(0);
});

test('P1 coordinator uses the same profile architecture with leadership added at the end', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=airway-coordinator');
  const content=page.locator('#teamProfileContent');
  await expect(content).toContainText('Dra. Airway Coordinator');
  await expect(content).toContainText(/Professional identity|Identidad profesional/);
  await expect(content).toContainText(/Research footprint|Huella investigadora/);
  await expect(content.locator('.team-profile__section--leadership')).toBeVisible();
  await expect(content.locator('.team-profile__section--leadership')).toContainText(/Coordinates research line|Coordina la línea/);
});

test('P1 department leader remains inside the same professional profile system', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=department-leader');
  const content=page.locator('#teamProfileContent');
  await expect(content).toContainText(/Professional profile|Perfil profesional/);
  await expect(content.locator('.team-profile__section--leadership')).toContainText(/Department leadership|Dirección de servicio/);
  await expect(content.locator('.team-profile__person-nav-count')).toContainText('/ 7');
});

for (const person of [
  ['ana-research-nurse','Research participant pathways'],
  ['luis-biomedical-engineer','Digital health systems']
]) {
  test(`P1 multidisciplinary profile renders profession-specific evidence: ${person[0]}`, async ({page}) => {
    await stubProfessionalApi(page);
    await page.goto('/team/?person='+person[0]);
    const content=page.locator('#teamProfileContent');
    await expect(content).toContainText(person[1]);
    await expect(content).toContainText(/Professional identity|Identidad profesional/);
    await expect(content.locator('.team-profile__section--leadership')).toHaveCount(0);
  });
}

test('Profile research relationships render as institutional L-code rows', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=luis-biomedical-engineer');
  const row=page.locator('.team-profile__lines a').first();
  await expect(row).toBeVisible();
  await expect(row.locator('.team-profile__line-code')).toHaveText('L06');
  await expect(row.locator('.team-profile__line-title')).toContainText(/Personalised Respiratory Medicine|Medicina Respiratoria Personalizada/);
  const geometry=await row.evaluate(el=>{
    const title=el.querySelector('.team-profile__line-title').getBoundingClientRect();
    return {titleWidth:title.width,rowWidth:el.getBoundingClientRect().width};
  });
  expect(geometry.titleWidth).toBeGreaterThan(120);
  expect(geometry.titleWidth).toBeLessThan(geometry.rowWidth);
});

test('Profile footer exposes elite team browsing controls', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=francisco-mendez-salazar');
  const footer=page.locator('.team-profile__footer');
  await expect(footer).toBeVisible();
  await expect(footer.locator('.team-profile__browse-all')).toContainText(/View full team|Ver equipo completo/);
  await expect(footer.locator('.team-profile__person-nav-count')).toContainText('/ 7');
});

test('Very long professional names receive the controlled identity scale', async ({page}) => {
  await stubProfessionalApi(page);
  await page.setViewportSize({width:390,height:844});
  await page.goto('/team/?person=maria-cristina-fernandez-dominguez');
  const content=page.locator('#teamProfileContent');
  await expect(content).toHaveClass(/has-very-long-name/);
  const size=await page.locator('#teamProfileName').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeLessThan(32);
});

test('P1 sparse profile remains intentional and contains no empty evidence modules', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/?person=sparse-resident');
  const content=page.locator('#teamProfileContent');
  await expect(content).toHaveClass(/is-sparse/);
  await expect(content).toContainText('Dra. Sparse Resident');
  await expect(content).toContainText(/Professional identity|Identidad profesional/);
  await expect(content.locator('.team-profile__evidence-list')).toHaveCount(0);
  await expect(content.locator('.team-profile__section--leadership')).toHaveCount(0);
});

test('P1 leadership and coordinator cards launch the universal profile drawer', async ({page}) => {
  await stubProfessionalApi(page);
  await page.goto('/team/');
  const chiefLaunch=page.locator('#teamLeadership [data-profile-id="chief"]');
  await expect(chiefLaunch).toBeVisible();
  await chiefLaunch.click();
  await expect(page.locator('#teamProfileContent')).toContainText('Dr. Department Leader');
  await page.locator('#teamProfileClose').click();

  const coordLaunch=page.locator('#teamCoordinators [data-profile-id="coord"]');
  await expect(coordLaunch).toBeVisible();
  await coordLaunch.click();
  await expect(page.locator('#teamProfileContent')).toContainText('Dra. Airway Coordinator');
});
