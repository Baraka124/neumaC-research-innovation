const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');

const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}

async function emptyApi(page){
  await page.route('**/api/**',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({data:[]})}));
}

test('Refinement 05 — principal imagery declares governed photography roles',async({page})=>{
  await emptyApi(page);
  await page.setViewportSize({width:1440,height:900});
  const targets=[
    ['/', '.home-hero-media img','media-photo--editorial'],
    ['/clinical/', '.research-hero__media img','media-photo--editorial'],
    ['/clinical/', '.research-leadership__portrait img','media-photo--documentary'],
    ['/innovation/', '.innovation-hero__media img','media-photo--editorial'],
    ['/news/', '.pub-hero__media img','media-photo--editorial'],
    ['/team/', '#teamHeroImage','media-photo--illustrative']
  ];
  for(const [url,selector,cls] of targets){
    await page.goto(url);
    const img=page.locator(selector).first();
    await expect(img).toBeAttached();
    await expect(img).toHaveClass(new RegExp(cls));
    const style=await img.evaluate(el=>({fit:getComputedStyle(el).objectFit,filter:getComputedStyle(el).filter}));
    expect(style.fit).toBe('cover');
    if(cls!=='media-photo--placeholder') expect(style.filter).toBe('none');
  }
});

test('Refinement 05 — Team runtime distinguishes documentary and placeholder photography',async({page})=>{
  const people=[
    {id:'pi',full_name:'Pedro Example',staff_type:'Principal Investigator',specialization:'Pneumology',public_photo_url:'/assets/research/pi-pedro-marcos.jpg',is_pi:true},
    {id:'member',full_name:'Ada Example',staff_type:'Clinician',specialization:'Pneumology'}
  ];
  await page.route('**/api/team/website',async route=>route.fulfill({json:{data:people}}));
  await page.route('**/api/research-lines/website',async route=>route.fulfill({json:{data:[]}}));
  await page.route('**/api/news/website**',async route=>route.fulfill({json:{data:[]}}));
  await page.goto('/team/');
  await page.waitForTimeout(300);
  const documentary=page.locator('[data-media-kind="documentary"]').first();
  await expect(documentary).toBeAttached();
  const placeholder=page.locator('[data-media-kind="placeholder"]').first();
  if(await placeholder.count()){
    await expect(placeholder.locator('img')).toHaveClass(/media-photo--placeholder/);
  }
  await noOverflow(page);
});

test('Refinement 06 — shared search and close controls use canonical line-icon grammar',async({page})=>{
  await emptyApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const search=page.locator('.hdr-search-btn svg');
  await expect(search).toBeVisible();
  const searchStyle=await search.evaluate(el=>({w:getComputedStyle(el).width,stroke:getComputedStyle(el).strokeWidth,linecap:getComputedStyle(el).strokeLinecap}));
  expect(parseFloat(searchStyle.w)).toBeGreaterThanOrEqual(17);
  expect(parseFloat(searchStyle.stroke)).toBeGreaterThanOrEqual(1.6);
  expect(searchStyle.linecap).toBe('round');

  await page.goto('/team/');
  await expect(page.locator('#teamProfileClose')).toHaveClass(/icon-button/);
  await page.goto('/line/?id=missing');
  await expect(page.locator('#lineTrajectoryClose')).toHaveClass(/icon-button/);
});

test('Refinement 07 — interaction motion uses institutional timing and reduced-motion collapse',async({page})=>{
  await emptyApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  const control=page.locator('.innovation-question').first();
  const duration=await control.evaluate(el=>getComputedStyle(el).transitionDuration);
  const seconds=duration.split(',').map(v=>v.trim()).map(v=>v.endsWith('ms')?parseFloat(v)/1000:parseFloat(v));
  expect(Math.max(...seconds)).toBeLessThanOrEqual(.32);

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  const reduced=await page.locator('.hdr-search-btn').evaluate(el=>getComputedStyle(el).transitionDuration);
  const reducedSeconds=reduced.split(',').map(v=>v.trim()).map(v=>v.endsWith('ms')?parseFloat(v)/1000:parseFloat(v));
  expect(Math.max(...reducedSeconds)).toBeLessThan(.01);
});

test('Refinement 08 — Publications empty state uses institutional state language',async({page})=>{
  await emptyApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/news/');
  const panel=page.locator('.state-panel').first();
  await expect(panel).toBeVisible();
  await expect(panel.locator('.state-panel__label')).toBeVisible();
  await expect(panel.locator('.state-panel__title')).toBeVisible();
  await noOverflow(page);
});

test('Refinement 08 — Research Line API failure uses explicit error state',async({page})=>{
  await page.route('**/api/research-lines/missing/website',async route=>route.fulfill({status:500,json:{error:'fixture'}}));
  await page.route('**/api/**',async route=>route.fulfill({json:{data:[]}}));
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/line/?id=missing');
  const host=page.locator('#lineLoadError');
  await expect(host).toHaveClass(/is-visible/);
  await expect(host.locator('.state-panel--error')).toBeVisible();
  await expect(host.locator('.state-panel__label')).toContainText(/Temporary issue|Incidencia temporal/);
  await noOverflow(page);
});

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`Refinements 05–08 visual — Team photography ${vp.name}`,async({page})=>{
    await emptyApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/team/');
    await expect(page.locator('#teamHeroImage')).toBeVisible();
    await noOverflow(page);
    await page.screenshot({path:path.join(OUTPUT,`elite-5-8-team-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });

  test(`Refinements 05–08 visual — Publications empty state ${vp.name}`,async({page})=>{
    await emptyApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/news/');
    await expect(page.locator('.state-panel').first()).toBeVisible();
    await noOverflow(page);
    await page.screenshot({path:path.join(OUTPUT,`elite-5-8-publications-empty-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}
