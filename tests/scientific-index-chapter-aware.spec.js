const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');

const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

async function stubIndexApi(page){
  await page.route('**/api/research-lines/website',async route=>route.fulfill({json:{data:[
    {id:'l1',line_number:1,name:'Transplantation & Pulmonary Hypertension'},
    {id:'l2',line_number:2,name:'Airway Diseases'}
  ]}}));
  await page.route('**/api/team/website',async route=>route.fulfill({json:{data:[]}}));
  await page.route('**/api/news/website**',async route=>route.fulfill({json:{data:[]}}));
  await page.route('**/api/innovation-projects/website',async route=>route.fulfill({json:{data:[]}}));
}

async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}

test('Scientific Index opens chapter-aware on Innovation instead of showing Research lines',async({page})=>{
  await stubIndexApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  await page.locator('#hdrIndexBtn').click();

  const panel=page.locator('#globalIndex');
  await expect(panel).toHaveClass(/is-open/);
  await expect(page.locator('[data-index-chapter="innovation"]')).toHaveClass(/is-current/);
  await expect(page.locator('[data-index-chapter="innovation"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/Innovation pathway|Ruta de innovación/);
  await expect(page.locator('#globalIndexChapterOpen')).toHaveAttribute('href','/innovation/');
  await expect(page.locator('#globalIndexLines')).toContainText(/Clinical question|Pregunta clínica/);
  await expect(page.locator('#globalIndexLines')).not.toContainText(/Transplantation|Airway Diseases/);
  await noOverflow(page);

  await page.screenshot({path:path.join(OUTPUT,'index-chapter-aware-innovation-1440.png'),fullPage:false,animations:'disabled'});
});

test('Scientific Index chapter rail controls the centre register without navigating',async({page})=>{
  await stubIndexApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  await page.locator('#hdrIndexBtn').click();

  await page.locator('[data-index-chapter="articles"]').click();
  await expect(page).toHaveURL(/\/innovation\/?$/);
  await expect(page.locator('[data-index-chapter="articles"]')).toHaveClass(/is-current/);
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/Scholarly register|Registro científico/);
  await expect(page.locator('#globalIndexChapterOpen')).toHaveAttribute('href','/news/');
  await expect(page.locator('#globalIndexLines')).toContainText(/Recent output|Producción reciente/);

  await page.locator('[data-index-chapter="team"]').click();
  await expect(page).toHaveURL(/\/innovation\/?$/);
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/People & programme|Personas y programa/);
  await expect(page.locator('#globalIndexChapterOpen')).toHaveAttribute('href','/team/');
  await expect(page.locator('#globalIndexLines')).toContainText(/Programme leadership|Dirección del programa/);

  await page.locator('[data-index-chapter="research"]').click();
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/Research lines|Líneas de investigación/);
  await expect(page.locator('#globalIndexChapterOpen')).toHaveAttribute('href','/clinical/');
  await expect(page.locator('#globalIndexLines')).toContainText(/Transplantation|Trasplante/);
  await expect(page.locator('#globalIndexLines')).toContainText(/Airway Diseases|Enfermedades de la vía aérea/);
  await noOverflow(page);
});

test('Scientific Index uses page-aware centre content on Publications and Team',async({page})=>{
  await stubIndexApi(page);
  await page.setViewportSize({width:1440,height:900});

  await page.goto('/news/');
  await page.locator('#hdrIndexBtn').click();
  await expect(page.locator('[data-index-chapter="articles"]')).toHaveClass(/is-current/);
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/Scholarly register|Registro científico/);
  await page.locator('[data-index-close]').first().click();

  await page.goto('/team/');
  await page.locator('#hdrIndexBtn').click();
  await expect(page.locator('[data-index-chapter="team"]')).toHaveClass(/is-current/);
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/People & programme|Personas y programa/);
  await noOverflow(page);
});

test('Phone Index keeps four chapter controls and chapter-aware centre content',async({page})=>{
  await stubIndexApi(page);
  await page.setViewportSize({width:390,height:844});
  await page.goto('/innovation/');
  await page.locator('#mobToggle').click();

  await expect(page.locator('[data-index-chapter]')).toHaveCount(4);
  await expect(page.locator('[data-index-chapter="innovation"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/Innovation pathway|Ruta de innovación/);

  await page.locator('[data-index-chapter="team"]').click();
  await expect(page.locator('#globalIndexLinesTitle')).toContainText(/People & programme|Personas y programa/);
  await expect(page.locator('#globalIndexLines')).toContainText(/Multidisciplinary team|Equipo multidisciplinar/);
  await noOverflow(page);

  await page.screenshot({path:path.join(OUTPUT,'index-chapter-aware-team-phone-390.png'),fullPage:false,animations:'disabled'});
});
