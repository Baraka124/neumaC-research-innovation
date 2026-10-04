const { test, expect } = require('@playwright/test');

const indexablePages=[
  ['Home','/'],
  ['Research','/clinical/'],
  ['Innovation','/innovation/'],
  ['Publications','/news/'],
  ['Team','/team/'],
  ['Privacy','/privacidad/'],
  ['Accessibility','/accesibilidad/'],
  ['Legal','/aviso-legal/'],
  ['Annual Report','/report/?year=2026']
];

for(const [name,url] of indexablePages){
  test(`${name} exposes complete public metadata`,async({page})=>{
    if(url.startsWith('/report/')){
      await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[]}}));
      await page.route('**/api/team/website',r=>r.fulfill({json:{data:[]}}));
      await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[]}}));
    }else{
      await page.route('**/api/**',r=>r.fulfill({json:{data:[]}}));
    }
    await page.goto(url);

    expect((await page.title()).trim().length).toBeGreaterThan(4);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/.{20,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',/^https:\/\/neumact\.org\//);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',/.{5,}/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content',/.{20,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/^https:\/\/neumact\.org\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  });
}

test('Research-line metadata follows the governed line record',async({page})=>{
  const lineId='line-fixture-01';
  await page.route(`**/api/research-lines/${lineId}/website`,r=>r.fulfill({json:{data:{
    id:lineId,
    name:'Airway Diseases',
    short_name:'Airway Diseases',
    description:'Clinical and translational research focused on airway disease, phenotyping and respiratory care pathways.',
    keywords:['airway disease','phenotyping'],
    team:[]
  }}}));
  await page.route('**/api/clinical-trials/website**',r=>r.fulfill({json:{data:[]}}));
  await page.route('**/api/innovation-projects/website**',r=>r.fulfill({json:{data:[]}}));
  await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[]}}));

  await page.goto(`/line/?id=${lineId}`);

  await expect(page).toHaveTitle('Airway Diseases | neumACt R&I');
  await expect(page.locator('#pageDescription')).toHaveAttribute('content',/Clinical and translational research focused on airway disease/);
  await expect(page.locator('#canonicalLink')).toHaveAttribute('href',`https://neumact.org/line/?id=${lineId}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Airway Diseases | neumACt R&I');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content',/Clinical and translational research focused on airway disease/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://neumact.org/line/?id=${lineId}`);
});

for(const [name,url] of [['404','/404.html'],['Feed','/feed/']]){
  test(`${name} remains intentionally non-indexable`,async({page})=>{
    await page.goto(url);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  });
}
