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
async function stubReportApi(page){
  await page.route('**/api/research-lines/website',route=>route.fulfill({json:{data:[
    {id:1,active_trials:2},{id:2,active_trials:1},{id:3,active_trials:0}
  ]}}));
  await page.route('**/api/team/website',route=>route.fulfill({json:{data:[{id:1},{id:2},{id:3},{id:4}]}}));
  await page.route('**/api/news/website**',route=>route.fulfill({json:{data:[
    {title:'Respiratory systems paper',journal:'Journal of Respiratory Research',authors:'A. Example; B. Example',published_at:'2026-06-01T00:00:00Z'},
    {title:'Older paper',journal:'Archive Journal',authors:'C. Example',published_at:'2025-06-01T00:00:00Z'}
  ]}}));
}

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`404 recovery surface — ${vp.name}`,async({page})=>{
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/404.html');
    await expect(page.locator('.not-found')).toBeVisible();
    await expect(page.locator('.not-found__title [lang="en"]')).toContainText('Page not found');
    await expect(page.locator('.not-found__shell .btn-text')).toHaveCount(3);
    await expect(page.locator('.not-found + .affil-section')).toHaveCount(0);
    await expect(page.locator('#siteFooter')).toBeAttached();
    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    if(vp.name!=='laptop' || true){
      await page.screenshot({path:path.join(OUTPUT,`support-404-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
    }
  });
}

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`annual report ledger — ${vp.name}`,async({page})=>{
    await stubReportApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/report/?year=2026');

    await expect(page.locator('#rptYear')).toHaveText('2026');
    await expect(page.locator('#rptLines')).toHaveText('3');
    await expect(page.locator('#rptTrials')).toHaveText('3+');
    await expect(page.locator('#rptMembers')).toHaveText('4');
    await expect(page.locator('#rptPubs')).toHaveText('1');
    await expect(page.locator('#rptPubList li')).toHaveCount(1);
    await expect(page.locator('.report-print-button')).toBeVisible();
    await noOverflow(page);

    const geo=await page.evaluate(()=>{
      const shell=document.querySelector('.report-shell').getBoundingClientRect();
      const grid=document.querySelector('.rpt-grid').getBoundingClientRect();
      return {viewport:innerWidth,shell:{left:shell.left,right:shell.right,width:shell.width},grid:{left:grid.left,right:grid.right,width:grid.width}};
    });
    expect(geo.shell.left).toBeGreaterThanOrEqual(vp.width<=560?15:Math.max(20,(vp.width-1122)/2-2));
    expect(geo.shell.right).toBeLessThanOrEqual(geo.viewport+1);
    expect(geo.grid.right).toBeLessThanOrEqual(geo.viewport+1);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`support-report-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}

test('support surfaces expose correct Open Graph metadata',async({page})=>{
  await page.goto('/404.html');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Page not found | neumACt R&I');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content','The requested neumACt R&I page could not be found.');

  await stubReportApi(page);
  await page.goto('/report/?year=2026');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Annual Report | neumACt R&I');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content','Annual research output report generated from live neumACt R&I departmental data.');
});

test('Annual Report remains bilingual and year-scoped',async({page})=>{
  await stubReportApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/report/?year=2026');
  await page.locator('#ltBtnEs').click();
  await expect(page.locator('.report-kicker [lang="es"]')).toBeVisible();
  await expect(page.locator('.report-intro [lang="es"]')).toBeVisible();
  await expect(page).toHaveTitle(/Annual Report 2026/);
  await noOverflow(page);
});
