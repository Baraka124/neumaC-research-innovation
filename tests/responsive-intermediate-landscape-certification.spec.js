const { test, expect } = require('@playwright/test');

const POST={
  id:'responsive-landscape-publication',
  post_type:'publication',
  title:'Clinical translation in respiratory research',
  authors_text:'neumACt Research & Innovation',
  journal_name:'Respiratory Research',
  published_at:'2026-09-18T00:00:00Z',
  doi:'10.0000/neumact.responsive',
  body:'<p>Responsive certification fixture.</p>',
  research_line:{id:'line-airway',line_number:2,name:'Airway Diseases'},
  is_featured:true
};
const PERSON={
  id:'responsive-clinician',
  full_name:'Dr. Responsive Clinician',
  is_public:true,
  staff_type:'attending_physician',
  specialization:'Pneumology',
  primary_dept_name:'Servicio de Neumología',
  public_bio:'Respiratory physician contributing to clinical care and research.',
  clinical_expertise:[{label:{en:'Respiratory medicine',es:'Neumología'},visibility:'approved_public'}]
};

async function stub(page){
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
async function settled(page){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(50);
}

for(const width of [360,430,480]){
  test(`intermediate portrait public surfaces remain contained at ${width}px`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const url of ['/','/clinical/','/innovation/','/news/','/team/']){
      await page.goto(url);
      await expect(page.locator('#hdr')).toBeVisible();
      await noOverflow(page);
    }
  });
}

for(const vp of [
  {name:'small-landscape',width:667,height:375},
  {name:'phone-landscape',width:844,height:390},
  {name:'large-phone-landscape',width:932,height:430}
]){
  test(`Scientific Index/Search stays inside short landscape viewport — ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/innovation/');

    const mobile=page.locator('#mobToggle');
    if(await mobile.isVisible()) await mobile.click();
    else await page.locator('#hdrIndexBtn').click();

    await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
    await settled(page);

    let geo=await page.locator('#globalIndexSurface').evaluate(el=>{
      const r=el.getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};
    });
    expect(geo.top).toBeGreaterThanOrEqual(-1);
    expect(geo.left).toBeGreaterThanOrEqual(-1);
    expect(geo.right).toBeLessThanOrEqual(vp.width+1);
    expect(geo.bottom).toBeLessThanOrEqual(vp.height+1);

    await page.locator('[data-open-index-search]').first().click();
    await expect(page.locator('#globalIndexSearchView')).toBeVisible();
    await expect(page.locator('#globalIndexSearchInput')).toBeVisible();
    await settled(page);

    geo=await page.locator('#globalIndexSurface').evaluate(el=>{
      const r=el.getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};
    });
    expect(geo.bottom).toBeLessThanOrEqual(vp.height+1);
    expect(geo.right).toBeLessThanOrEqual(vp.width+1);
    await noOverflow(page);
  });

  test(`publication reader stays contained in short landscape — ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/news/?post=responsive-landscape-publication');
    const sheet=page.locator('.pub-reader');
    await expect(sheet).toBeVisible();
    await settled(page);
    const r=await sheet.evaluate(el=>{
      const b=el.getBoundingClientRect();
      return {top:b.top,bottom:b.bottom,left:b.left,right:b.right};
    });
    expect(r.top).toBeGreaterThanOrEqual(-1);
    expect(r.bottom).toBeLessThanOrEqual(vp.height+1);
    expect(r.left).toBeGreaterThanOrEqual(-1);
    expect(r.right).toBeLessThanOrEqual(vp.width+1);
    await noOverflow(page);
  });

  test(`Team profile stays contained in short landscape — ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/team/?person=responsive-clinician');
    const sheet=page.locator('#teamProfileSheet');
    await expect(sheet).toBeVisible();
    await settled(page);
    const r=await sheet.evaluate(el=>{
      const b=el.getBoundingClientRect();
      return {top:b.top,bottom:b.bottom,left:b.left,right:b.right};
    });
    expect(r.top).toBeGreaterThanOrEqual(-1);
    expect(r.bottom).toBeLessThanOrEqual(vp.height+1);
    expect(r.left).toBeGreaterThanOrEqual(-1);
    expect(r.right).toBeLessThanOrEqual(vp.width+1);
    await noOverflow(page);
  });
}

test('short desktop landscape Index accounts for its 12px editorial air gap',async({page})=>{
  await stub(page);
  await page.setViewportSize({width:932,height:430});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/innovation/');
  await page.locator('#hdrIndexBtn').click();
  await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden','false');
  await settled(page);

  const geo=await page.evaluate(()=>{
    const overlay=document.getElementById('globalIndex').getBoundingClientRect();
    const surface=document.getElementById('globalIndexSurface').getBoundingClientRect();
    const style=getComputedStyle(document.getElementById('globalIndex'));
    return {
      viewport:innerHeight,
      overlayTop:overlay.top,
      surfaceTop:surface.top,
      surfaceBottom:surface.bottom,
      paddingTop:parseFloat(style.paddingTop)
    };
  });
  expect(geo.paddingTop).toBeCloseTo(12,0);
  expect(geo.surfaceTop).toBeCloseTo(geo.overlayTop+geo.paddingTop,1);
  expect(geo.surfaceBottom).toBeLessThanOrEqual(geo.viewport+1);
});
