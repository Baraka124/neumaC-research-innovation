const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

async function stubApi(page){
  await page.route('**/api/**',async route=>{
    const url=route.request().url();
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:[
      {id:'line-a',line_number:1,name:'Transplantation & Pulmonary Hypertension',short_name:'Transplantation'},
      {id:'line-b',line_number:2,name:'Airway Diseases',short_name:'Airway Diseases'}
    ]}});
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:[]}});
    if(url.includes('/api/news/website')) return route.fulfill({json:{data:[]}});
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

test('A — logo.svg preserves the canonical neumACT artwork as native vector paths',async({page})=>{
  const response=await page.request.get('/logo.svg');
  expect(response.ok()).toBe(true);
  const svg=await response.text();
  expect(svg).toContain('viewBox="0 0 988 286"');
  expect(svg).toContain('data-brand-fidelity="canonical-neumact-2026-10"');
  expect(svg).toMatch(/<path\b/i);
  expect(svg).not.toContain('data:image/png;base64,');
  expect(svg).not.toMatch(/<image\b/i);
});

for(const width of [1440,2048]){
  test(`B — institutional lockup and editorial navigation do not collide at ${width}px`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width,height:width>1600?1152:900});
    await page.goto('/innovation/');
    const geometry=await page.evaluate(()=>{
      const logo=document.querySelector('.hdr-logo').getBoundingClientRect();
      const nav=document.querySelector('.hdr-nav').getBoundingClientRect();
      const meta=document.querySelector('.hdr-brand-meta')?.getBoundingClientRect();
      return {
        logoRight:logo.right,
        navLeft:nav.left,
        metaRight:meta?.right||logo.right,
        navWidth:nav.width,
        viewport:innerWidth
      };
    });
    expect(geometry.metaRight).toBeLessThanOrEqual(geometry.navLeft+2);
    expect(geometry.navWidth).toBeGreaterThan(300);
    await noOverflow(page);
  });
}

test('C — open Index is an attached scientific command surface',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  await page.locator('#hdrIndexBtn').click();
  const panel=page.locator('#globalIndex');
  await expect(panel).toHaveAttribute('aria-hidden','false');
  await expect(panel.locator('.global-index__eyebrow')).toContainText(/Scientific index|Índice científico/);
  await expect(panel.locator('.global-index__chapters')).toBeVisible();
  await expect(panel.locator('#globalIndexLines')).toBeVisible();
  const geo=await page.evaluate(()=>{
    const h=document.getElementById('hdr').getBoundingClientRect();
    const p=document.getElementById('globalIndex').getBoundingClientRect();
    const s=document.getElementById('globalIndexSurface').getBoundingClientRect();
    return {headerBottom:h.bottom,panelTop:p.top,surfaceLeft:s.left,surfaceRight:s.right,viewport:innerWidth};
  });
  expect(Math.abs(geo.headerBottom-geo.panelTop)).toBeLessThanOrEqual(2);
  expect(geo.surfaceLeft).toBeLessThanOrEqual(3);
  expect(geo.surfaceRight).toBeGreaterThanOrEqual(geo.viewport-3);
  await panel.screenshot({path:path.join(OUTPUT,'h2-refine-index-1440.png'),animations:'disabled'});
});

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`D — Home uses dedicated clinical X-ray hero at ${vp.name}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.goto('/');
    const img=page.locator('.home-hero-media img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src','/assets/home/neumact-home-hero-xray-clinicians-v2.webp');
    const renderedSource=await img.evaluate(el=>el.currentSrc);
    expect(renderedSource).toContain('/assets/home/neumact-home-hero-xray-clinicians-v2.webp');
    const natural=await img.evaluate(el=>({w:el.naturalWidth,h:el.naturalHeight}));
    expect(natural.w).toBeGreaterThan(900);
    expect(natural.h).toBeGreaterThan(300);
    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`h2-refine-home-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}

for(const target of [
  ['/innovation/','.innovation-hero__media'],
  ['/clinical/','.research-hero__media']
]){
  test(`E — hero media is clean without generic H2 decoration on ${target[0]}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:1440,height:900});
    await page.goto(target[0]);
    const el=page.locator(target[1]);
    await expect(el).toBeAttached();
    const pseudo=await el.evaluate(node=>({
      before:getComputedStyle(node,'::before').content,
      after:getComputedStyle(node,'::after').content
    }));
    expect(['none','normal','""']).toContain(pseudo.before);
    expect(['none','normal','""']).toContain(pseudo.after);
    await noOverflow(page);
  });
}

test('E — Publications uses a clean scholarly register without generic H2 media decoration',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/news/');
  await expect(page.locator('.pub-hero--register')).toBeVisible();
  await expect(page.locator('.pub-hero__media')).toHaveCount(0);
  await expect(page.locator('.h2-media-arc,.h2-media-trace,.h2-media-registration')).toHaveCount(0);
  await noOverflow(page);
});

test('E — Team uses a clean people-led opening without generic H2 media decoration',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/team/');
  const hero=page.locator('.team-hero--people');
  await expect(hero).toBeVisible();
  await expect(page.locator('.team-visual-hero')).toHaveCount(0);
  await expect(page.locator('.h2-media-arc,.h2-media-trace,.h2-media-registration')).toHaveCount(0);
  await noOverflow(page);
});

test('C — Search remains integrated inside refined Index',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/team/');
  await page.locator('#hdrSearchBtn').click();
  await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexSearchInput')).toBeFocused();
  await expect(page.locator('.global-search__field')).toBeVisible();
  await page.locator('#globalIndex').screenshot({path:path.join(OUTPUT,'h2-refine-search-1440.png'),animations:'disabled'});
});
