const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

const POST={
  id:'landscape-reader-1',
  post_type:'publication',
  title:'Clinical translation in respiratory research',
  authors_text:'neumACt Research & Innovation',
  journal_name:'Respiratory Research',
  published_at:'2026-09-18T00:00:00Z',
  doi:'10.0000/neumact.landscape',
  body:'<p>Landscape responsiveness fixture for the scholarly reader.</p><h2>Clinical relevance</h2><p>Structured respiratory research context remains readable in constrained-height viewports.</p>',
  research_line:{id:'line-airway',line_number:2,name:'Airway Diseases'},
  is_featured:true
};
const PERSON={
  id:'landscape-clinician',
  full_name:'Dr. Landscape Clinician',
  is_public:true,
  staff_type:'attending_physician',
  specialization:'Pneumology',
  primary_dept_name:'Servicio de Neumología',
  public_bio:'Respiratory physician contributing specialist clinical care and multidisciplinary respiratory research.',
  clinical_expertise:[{label:{en:'Respiratory medicine',es:'Neumología'},visibility:'approved_public'}],
  current_contributions:[{label:{en:'Multidisciplinary care',es:'Atención multidisciplinar'},visibility:'approved_public'}]
};

async function stubCommon(page){
  await page.route('**/api/**',async route=>{
    const u=route.request().url();
    if(u.includes('/api/research-lines/website')) return route.fulfill({json:{data:[POST.research_line]}});
    if(u.includes('/api/team/website')) return route.fulfill({json:{data:[PERSON]}});
    if(u.includes('/api/news/website')) return route.fulfill({json:{data:[POST]}});
    if(u.includes('/api/innovation-projects/website')) return route.fulfill({json:{data:[]}});
    return route.fulfill({json:{data:[]}});
  });
}
async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}

for(const width of [360,430,480]){
  test(`intermediate portrait cross-page containment — ${width}px`,async({page})=>{
    await stubCommon(page);
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const url of ['/','/clinical/','/innovation/','/news/','/team/']){
      await page.goto(url);
      await noOverflow(page);
      await expect(page.locator('#hdr')).toBeVisible();
      await expect(page.locator('#siteFooter')).toBeAttached();
    }
  });
}

for(const vp of [
  {name:'small-landscape',width:667,height:375},
  {name:'phone-landscape',width:844,height:390},
  {name:'large-phone-landscape',width:932,height:430}
]){
  test(`landscape Index/Search audit — ${vp.name}`,async({page})=>{
    await stubCommon(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/innovation/');

    const mobileTrigger=page.locator('#mobToggle');
    const desktopTrigger=page.locator('#hdrIndexBtn');
    if(await mobileTrigger.isVisible()) await mobileTrigger.click();
    else await desktopTrigger.click();

    await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
    await page.waitForTimeout(80);
    await noOverflow(page);

    const indexGeo=await page.evaluate(()=>{
      const surface=document.querySelector('#globalIndexSurface').getBoundingClientRect();
      const close=document.querySelector('.global-index__close--mobile');
      const closeRect=close&&close.offsetParent!==null?close.getBoundingClientRect():null;
      return {
        viewport:{w:innerWidth,h:innerHeight},
        surface:{top:surface.top,bottom:surface.bottom,left:surface.left,right:surface.right,width:surface.width,height:surface.height},
        close:closeRect?{w:closeRect.width,h:closeRect.height,top:closeRect.top,bottom:closeRect.bottom}:null
      };
    });
    console.log('LANDSCAPE_INDEX',JSON.stringify(indexGeo));
    expect(indexGeo.surface.bottom).toBeLessThanOrEqual(vp.height+2);

    await page.locator('[data-open-index-search]').first().click();
    await expect(page.locator('#globalIndexSearchView')).toBeVisible();
    await expect(page.locator('#globalIndexSearchInput')).toBeVisible();
    await noOverflow(page);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`responsive-landscape-index-${vp.width}x${vp.height}.png`),fullPage:false,animations:'disabled'});
  });

  test(`landscape publication reader audit — ${vp.name}`,async({page})=>{
    await stubCommon(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/news/?post=landscape-reader-1');
    const sheet=page.locator('.pub-reader');
    await expect(sheet).toBeVisible();
    await page.waitForTimeout(80);

    const geo=await sheet.evaluate(el=>{
      const r=el.getBoundingClientRect();
      const s=getComputedStyle(el);
      return {
        viewport:{w:innerWidth,h:innerHeight},
        rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height},
        radius:s.borderRadius,
        position:s.position
      };
    });
    console.log('LANDSCAPE_READER',JSON.stringify(geo));
    expect(geo.rect.top).toBeGreaterThanOrEqual(-1);
    expect(geo.rect.bottom).toBeLessThanOrEqual(vp.height+1);
    expect(geo.rect.left).toBeGreaterThanOrEqual(-1);
    expect(geo.rect.right).toBeLessThanOrEqual(vp.width+1);
    await noOverflow(page);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`responsive-landscape-reader-${vp.width}x${vp.height}.png`),fullPage:false,animations:'disabled'});
  });

  test(`landscape Team profile audit — ${vp.name}`,async({page})=>{
    await stubCommon(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/team/?person=landscape-clinician');

    const sheet=page.locator('#teamProfileSheet');
    await expect(sheet).toBeVisible();
    const geo=await sheet.evaluate(el=>{
      const r=el.getBoundingClientRect();
      return {viewport:{w:innerWidth,h:innerHeight},rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
    });
    console.log('LANDSCAPE_PROFILE',JSON.stringify(geo));
    expect(geo.rect.left).toBeGreaterThanOrEqual(-1);
    expect(geo.rect.right).toBeLessThanOrEqual(vp.width+1);
    expect(geo.rect.top).toBeGreaterThanOrEqual(-1);
    expect(geo.rect.bottom).toBeLessThanOrEqual(vp.height+1);
    await noOverflow(page);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`responsive-landscape-profile-${vp.width}x${vp.height}.png`),fullPage:false,animations:'disabled'});
  });
}
