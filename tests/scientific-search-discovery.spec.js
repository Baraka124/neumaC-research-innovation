const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');

const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

async function stubSearchApi(page){
  await page.route('**/api/research-lines/website',async route=>route.fulfill({json:{data:[
    {id:'airway-line',line_number:2,name:'Airway Diseases',short_name:'Airway Diseases'}
  ]}}));
  await page.route('**/api/team/website',async route=>route.fulfill({json:{data:[
    {id:'ada',full_name:'Ada Example',staff_type:'biomedical_engineer',specialization:'Biomedical Engineering'}
  ]}}));
  await page.route('**/api/news/website**',async route=>route.fulfill({json:{data:[
    {id:'paper-1',post_type:'publication',title:'Airway inflammation in respiratory disease',summary:'Fixture publication',doi:'10.0000/airway.fixture'}
  ]}}));
  await page.route('**/api/innovation-projects/website',async route=>route.fulfill({json:{data:[
    {id:'project-1',title:'Airway digital pathway',description:'Clinical innovation fixture'}
  ]}}));
}

async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}

test('Scientific Search opens with authored four-domain discovery registry',async({page})=>{
  await stubSearchApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  await page.locator('#hdrSearchBtn').click();

  await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexSearchInput')).toBeFocused();
  await expect(page.locator('.global-search__discovery')).toBeVisible();
  await expect(page.locator('.global-search__scope')).toHaveCount(4);
  await expect(page.locator('.global-search__discovery')).toContainText(/Discover across the neumACt programme|Explorar el programa neumACt/);
  await expect(page.locator('.global-search__scope-list')).toContainText(/Research|Investigación/);
  await expect(page.locator('.global-search__scope-list')).toContainText(/People|Personas/);
  await expect(page.locator('.global-search__scope-list')).toContainText(/Publications|Publicaciones/);
  await expect(page.locator('.global-search__scope-list')).toContainText(/Innovation|Innovación/);
  const geometry=await page.evaluate(()=>{
    const view=document.querySelector('#globalIndexSearchView').getBoundingClientRect();
    const discovery=document.querySelector('.global-search__discovery').getBoundingClientRect();
    return {viewWidth:view.width,discoveryWidth:discovery.width,left:discovery.left,right:discovery.right};
  });
  expect(geometry.discoveryWidth / geometry.viewWidth).toBeGreaterThan(.9);
  await noOverflow(page);

  await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
  await page.screenshot({path:path.join(OUTPUT,'scientific-search-discovery-laptop-1440.png'),fullPage:false,animations:'disabled'});
});

test('Scientific Search preserves unified data-driven results and filters',async({page})=>{
  await stubSearchApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/clinical/');
  await page.locator('#hdrSearchBtn').click();
  const input=page.locator('#globalIndexSearchInput');

  await input.fill('Airway');
  await expect(page.locator('.global-search__result').first()).toBeVisible();
  await expect(page.locator('.global-search__results')).toContainText(/Airway Diseases/);
  await expect(page.locator('.global-search__results')).toContainText(/Airway inflammation in respiratory disease/);
  await expect(page.locator('.global-search__results')).toContainText(/Airway digital pathway/);

  await page.locator('#globalIndexSearchFilters [data-filter="people"]').click();
  await input.fill('Ada');
  await expect(page.locator('.global-search__result')).toHaveCount(1);
  await expect(page.locator('.global-search__result').first()).toContainText(/Ada Example/);
  await noOverflow(page);
});

test('Phone Scientific Search keeps discovery registry contained and single-column',async({page})=>{
  await stubSearchApi(page);
  await page.setViewportSize({width:390,height:844});
  await page.goto('/team/');
  await page.evaluate(()=>window.neumACIndex.openSearch());

  await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
  await expect(page.locator('.global-search__discovery')).toBeVisible();
  await expect(page.locator('.global-search__scope')).toHaveCount(4);

  const rows=await page.locator('.global-search__scope').evaluateAll(items=>items.map(el=>Math.round(el.getBoundingClientRect().top)));
  expect(new Set(rows).size).toBe(4);
  const surfaceBackground=await page.locator('#globalIndexSurface').evaluate(el=>getComputedStyle(el).backgroundColor);
  expect(surfaceBackground).toMatch(/^rgb\(/);
  await noOverflow(page);

  await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
  await page.screenshot({path:path.join(OUTPUT,'scientific-search-discovery-phone-390.png'),fullPage:false,animations:'disabled'});
});
