const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

const lineFixture = [
  {id:'idx-line-1',line_number:1,name:'Transplantation & Pulmonary Hypertension',short_name:'Transplantation'},
  {id:'idx-line-2',line_number:2,name:'Airway Diseases',short_name:'Airway Diseases'},
  {id:'idx-line-3',line_number:3,name:'Interventional Pulmonology & Lung Cancer',short_name:'Interventional Pulmonology'},
  {id:'idx-line-4',line_number:4,name:'Respiratory Failure & Sleep',short_name:'Respiratory Failure & Sleep'},
  {id:'idx-line-5',line_number:5,name:'Thoracic Surgery',short_name:'Thoracic Surgery'},
  {id:'idx-line-6',line_number:6,name:'Precision Medicine',short_name:'Precision Medicine'}
];

async function stubApi(page){
  await page.route('**/api/**',async route=>{
    const url=route.request().url();
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:lineFixture}});
    if(url.includes('/api/news/website')) return route.fulfill({json:{data:[{
      id:'idx-publication',title:'Indexed respiratory publication',published_at:'2026-09-01T00:00:00Z'
    }]}});
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:[]}});
    if(url.includes('/api/innovation-projects/website')) return route.fulfill({json:{data:[]}});
    return route.fulfill({json:{data:[]}});
  });
}

async function noOverflow(page){
  const g=await page.evaluate(()=>({
    viewport:innerWidth,
    doc:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  expect(g.doc).toBeLessThanOrEqual(g.viewport+2);
  expect(g.body).toBeLessThanOrEqual(g.viewport+2);
}

test('Index 2.0 desktop exposes programme map, scientific core and command rail',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  await page.locator('#hdrIndexBtn').click();

  const index=page.locator('#globalIndex');
  await expect(index).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('.global-index__statement')).toContainText(/Navigate the neumACt research programme|Explore el programa de investigación/);

  const chapters=page.locator('.global-index__chapter');
  await expect(chapters).toHaveCount(4);
  await expect(page.locator('.global-index__chapter-desc')).toHaveCount(4);
  await expect(chapters.nth(1)).toHaveClass(/is-current/);

  await expect(page.locator('.global-index__current strong')).toContainText(/Clinical innovation|Innovación clínica/);

  const lines=page.locator('.global-index__line');
  await expect(lines).toHaveCount(6);
  await expect(lines.nth(0).locator('.global-index__line-no')).toHaveText('L01');
  await expect(lines.nth(5).locator('.global-index__line-no')).toHaveText('L06');

  await expect(page.locator('#globalIndexLatest')).toBeVisible();
  await noOverflow(page);
});

test('Index 2.0 search remains a mode of the same command surface',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/clinical/');
  await page.locator('#hdrSearchBtn').click();

  const index=page.locator('#globalIndex');
  await expect(index).toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexSearchInput')).toBeFocused();
  await expect(page.locator('.global-search__filters button')).toHaveCount(5);
  await expect(page.locator('.global-search__field')).toBeVisible();

  await page.locator('#globalIndexSearchInput').fill('Airway');
  await expect(page.locator('.global-search__result')).toHaveCount(1);
  await expect(page.locator('.global-search__result').first()).toContainText('Airway Diseases');
  await noOverflow(page);
});

for(const width of [390,768]){
  test(`Index 2.0 preserves mobile/tablet navigation and line disclosure at ${width}px`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width,height:width===390?844:1024});
    await page.goto('/team/');
    await page.locator('#mobToggle').click();

    await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
    await expect(page.locator('.global-index__chapter')).toHaveCount(4);
    await expect(page.locator('.global-index__chapter-desc')).toHaveCount(4);

    if(width<=620){
      const toggle=page.locator('.global-index__lines-toggle');
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded','false');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded','true');
      await expect(page.locator('.global-index__line')).toHaveCount(6);
    }else{
      await expect(page.locator('.global-index__line')).toHaveCount(6);
    }

    await noOverflow(page);
  });
}


test('Index 2.0 tablet Search command keeps icon and label together',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:768,height:1024});
  await page.goto('/innovation/');
  await page.locator('#mobToggle').click();
  const action=page.locator('.global-index__utility-link--search');
  await expect(action).toBeVisible();
  const geo=await action.evaluate(el=>{
    const icon=el.querySelector('svg').getBoundingClientRect();
    const label=el.querySelector('span').getBoundingClientRect();
    const row=el.getBoundingClientRect();
    return {gap:label.left-icon.right,width:row.width};
  });
  expect(geo.gap).toBeGreaterThanOrEqual(4);
  expect(geo.gap).toBeLessThanOrEqual(16);
  expect(geo.width).toBeLessThan(180);
  await noOverflow(page);
});

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'tablet',width:768,height:1024},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`Index 2.0 visual certification — ${vp.name}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/innovation/');
    if(vp.width<=880) await page.locator('#mobToggle').click();
    else await page.locator('#hdrIndexBtn').click();
    await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
    await noOverflow(page);
    await page.screenshot({
      path:path.join(OUTPUT,`index-v2-${vp.name}-${vp.width}.png`),
      fullPage:false,
      animations:'disabled'
    });
  });
}

test('Index 2.0 visual certification — desktop Search',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/clinical/');
  await page.locator('#hdrSearchBtn').click();
  await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
  await noOverflow(page);
  await page.screenshot({
    path:path.join(OUTPUT,'index-v2-search-laptop-1440.png'),
    fullPage:false,
    animations:'disabled'
  });
});
