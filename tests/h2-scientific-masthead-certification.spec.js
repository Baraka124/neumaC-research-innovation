const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(),'phase4-visual-artifacts');
const VIEWPORTS = [
  {name:'phone',width:390,height:844},
  {name:'tablet',width:768,height:1024},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
];
const PAGES = [
  {name:'home',url:'/',section:/neumACt/},
  {name:'research',url:'/clinical/',section:/Research|Investigación/},
  {name:'innovation',url:'/innovation/',section:/Innovation|Innovación/},
  {name:'publications',url:'/news/',section:/Publications|Publicaciones/},
  {name:'team',url:'/team/',section:/Team|Equipo/},
  {name:'line',url:'/line/?id=h2-airway',section:/Research|Investigación/,detail:/Airway Diseases|Enfermedades de la vía aérea/}
];

const lineFixture = {
  id:'h2-airway',
  line_number:2,
  name:'Airway Diseases',
  short_name:'Airway Diseases',
  description:'Research on severe asthma, COPD, bronchiectasis and cystic fibrosis.',
  keywords:['Asthma','COPD','Bronchiectasis'],
  coordinator:{
    id:'h2-coordinator',
    full_name:'Fixture Coordinator',
    specialization:'Pneumology',
    public_bio:'Fixture public biography.'
  }
};

async function stubApi(page){
  await page.route('**/api/**',async route=>{
    const url=route.request().url();
    if(url.includes('/api/research-lines/h2-airway/website')) return route.fulfill({json:{data:lineFixture}});
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:[lineFixture]}});
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:[lineFixture.coordinator]}});
    if(url.includes('/api/clinical-trials/website')) return route.fulfill({json:{data:[]}});
    if(url.includes('/api/innovation-projects/website')) return route.fulfill({json:{data:[]}});
    if(url.includes('/api/news/website')) return route.fulfill({json:{data:[]}});
    return route.fulfill({json:{data:[]}});
  });
}

async function expectNoOverflow(page){
  const width=await page.evaluate(()=>({
    viewport:window.innerWidth,
    doc:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  expect(width.doc).toBeLessThanOrEqual(width.viewport+2);
  expect(width.body).toBeLessThanOrEqual(width.viewport+2);
}

test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

for(const viewport of VIEWPORTS){
  for(const target of PAGES){
    test(`H2.8 masthead certification — ${target.name} ${viewport.name}`,async({page})=>{
      await stubApi(page);
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto(target.url);

      const hdr=page.locator('#hdr');
      const rail=page.locator('#hdrContextRail');
      await expect(hdr).toHaveClass(/hdr--scientific/);
      await expect(rail).toBeVisible();
      await expect(rail.locator('.hdr-context__section')).toContainText(target.section);
      if(target.detail) await expect(rail.locator('.hdr-context__detail')).toContainText(target.detail);
      await expectNoOverflow(page);

      const hdrBox=await hdr.boundingBox();
      expect(hdrBox.width).toBeLessThanOrEqual(viewport.width+1);
      expect(hdrBox.height).toBeGreaterThan(0);

      if(viewport.width>=881){
        const signature=page.locator('.hdr-nav-signature');
        await expect(signature).toBeVisible();
        const sig=await signature.evaluate(el=>({
          width:el.getBoundingClientRect().width,
          opacity:parseFloat(getComputedStyle(el).opacity)
        }));
        expect(sig.width).toBeGreaterThanOrEqual(24);
        expect(sig.opacity).toBeGreaterThan(.5);
      }

      await hdr.screenshot({
        path:path.join(OUTPUT,`h2-masthead-${target.name}-${viewport.name}-${viewport.width}.png`),
        animations:'disabled'
      });
    });
  }
}

test('H2.8 desktop Index and Search align to the scientific masthead',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/clinical/');

  const hdr=page.locator('#hdr');
  const index=page.locator('#globalIndex');
  await page.locator('#hdrIndexBtn').click();
  await expect(index).toHaveAttribute('aria-hidden','false');

  const geometry=await page.evaluate(()=>{
    const header=document.getElementById('hdr');
    const panel=document.getElementById('globalIndex');
    const h=header.getBoundingClientRect();
    const p=panel.getBoundingClientRect();
    const ps=getComputedStyle(panel);
    return {
      headerTop:h.top,
      headerHeight:h.height,
      headerBottom:h.bottom,
      panelTop:p.top,
      panelBottom:p.bottom,
      panelPosition:ps.position,
      panelCssTop:ps.top,
      panelCssBottom:ps.bottom,
      bodyPaddingTop:getComputedStyle(document.body).paddingTop,
      scrollY:window.scrollY
    };
  });
  expect(Math.abs(geometry.headerBottom-geometry.panelTop),JSON.stringify(geometry)).toBeLessThanOrEqual(2);

  await page.locator('.global-index__toolbar [data-index-close]').click();
  await page.locator('#hdrSearchBtn').click();
  await expect(index).toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexSearchInput')).toBeFocused();
  await expectNoOverflow(page);
});

test('H2.8 compact scroll state removes the context rail without losing masthead',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/clinical/');
  const hdr=page.locator('#hdr');
  await page.evaluate(()=>window.scrollTo(0,360));
  await page.waitForTimeout(120);
  await expect(hdr).toHaveClass(/hdr--context-compact/);
  const state=await page.evaluate(()=>{
    const h=document.getElementById('hdr').getBoundingClientRect();
    const r=document.getElementById('hdrContextRail').getBoundingClientRect();
    return {height:h.height,rail:r.height};
  });
  expect(state.height).toBeLessThanOrEqual(66);
  expect(state.rail).toBeLessThanOrEqual(1);
});

test('H2.8 mobile Index remains the navigation surface',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:390,height:844});
  await page.goto('/team/');
  await page.locator('#mobToggle').click();
  await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('.global-index__mobile-head')).toBeVisible();
  await expect(page.locator('#hdrIndexBtn')).toBeHidden();
  await expectNoOverflow(page);
});

test('H2.8 research-line context rail follows the loaded line title',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:2048,height:1152});
  await page.goto('/line/?id=h2-airway');
  await expect(page.locator('#lineTitle')).toContainText('Airway Diseases');
  await expect(page.locator('.hdr-context__detail')).toContainText('Airway Diseases');
});


for (const viewport of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]) {
  test(`H2.8 research-line masthead and hero integrate at ${viewport.name}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/line/?id=h2-airway');

    await expect(page.locator('#hdr')).toBeVisible();
    await expect(page.locator('#lineHero')).toBeVisible();
    await expect(page.locator('.line-hero__media')).toBeVisible();

    await page.evaluate(()=>{
      const cookie=document.getElementById('cookieBanner');
      if(cookie)cookie.style.display='none';
    });

    await expectNoOverflow(page);
    await page.screenshot({
      path:path.join(OUTPUT,`h2-top-integration-line-${viewport.name}-${viewport.width}.png`),
      fullPage:false,
      animations:'disabled'
    });
  });
}
