const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

const lineFixture={
  id:'refine-line',
  line_number:2,
  name:'Airway Diseases',
  short_name:'Airway Diseases',
  description:'Respiratory research line fixture.',
  coordinator:{id:'coord',full_name:'Fixture Coordinator',specialization:'Pneumology',public_bio:'Fixture biography.'}
};

async function stubApi(page){
  await page.route('**/api/**',async route=>{
    const url=route.request().url();
    if(url.includes('/api/research-lines/refine-line/website')) return route.fulfill({json:{data:lineFixture}});
    if(url.includes('/api/research-lines/website')) return route.fulfill({json:{data:[lineFixture]}});
    if(url.includes('/api/team/website')) return route.fulfill({json:{data:[lineFixture.coordinator]}});
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

const heroPages=[
  {name:'home',url:'/',selector:'.home-hero-title',media:'.home-hero-media'},
  {name:'research',url:'/clinical/',selector:'.research-hero h1',media:'.research-hero__media'},
  {name:'innovation',url:'/innovation/',selector:'.innovation-hero h1',media:'.innovation-hero__media'},
  {name:'publications',url:'/news/',selector:'.pub-hero__identity h1',media:'.pub-hero__media'},
  {name:'team',url:'/team/',selector:'.team-hero h1',media:'.team-visual-hero__media'},
  {name:'line',url:'/line/?id=refine-line',selector:'.line-hero__title',media:'.line-hero__media'}
];

test('Refinement 01 — principal page heroes use canonical display roles',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  const sizes={};
  for(const target of heroPages.slice(0,5)){
    await page.goto(target.url);
    const el=page.locator(target.selector);
    await expect(el).toBeVisible();
    sizes[target.name]=await el.evaluate(node=>({
      family:getComputedStyle(node).fontFamily,
      size:parseFloat(getComputedStyle(node).fontSize),
      line:getComputedStyle(node).lineHeight,
      spacing:getComputedStyle(node).letterSpacing
    }));
  }
  const values=Object.values(sizes);
  for(const item of values){
    expect(item.family).toMatch(/Fraunces/i);
    expect(item.size).toBeGreaterThan(45);
  }
  const heroSizes=values.map(v=>v.size);
  expect(Math.max(...heroSizes)-Math.min(...heroSizes)).toBeLessThanOrEqual(1);
});

test('Refinement 01 — major section headings share the canonical section scale',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  const targets=[
    ['/', '.home-section-title'],
    ['/clinical/','.research-lines__head h2'],
    ['/innovation/','.innovation-section-intro h2'],
    ['/news/','.pub-section-heading h2'],
    ['/team/','.team-section-head h2']
  ];
  const sizes=[];
  for(const [url,selector] of targets){
    await page.goto(url);
    const el=page.locator(selector).first();
    await expect(el).toBeAttached();
    sizes.push(await el.evaluate(node=>parseFloat(getComputedStyle(node).fontSize)));
  }
  expect(Math.max(...sizes)-Math.min(...sizes)).toBeLessThanOrEqual(1);
});

test('Refinement 02 — major sections share deliberate vertical rhythm',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  const targets=[
    ['/', '.home-section'],
    ['/clinical/','.research-section'],
    ['/innovation/','.innovation-start'],
    ['/team/','.team-leadership']
  ];
  const padding=[];
  for(const [url,selector] of targets){
    await page.goto(url);
    const el=page.locator(selector).first();
    await expect(el).toBeAttached();
    padding.push(await el.evaluate(node=>parseFloat(getComputedStyle(node).paddingTop)));
  }
  expect(Math.max(...padding)-Math.min(...padding)).toBeLessThanOrEqual(1);
  expect(padding[0]).toBeGreaterThan(50);
});

test('Refinement 03 — canonical hero media surfaces opt into governed media grammar',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  for(const target of heroPages){
    await page.goto(target.url);
    const media=page.locator(target.media).first();
    await expect(media).toBeAttached();
    await expect(media).toHaveClass(/sci-media/);
    const style=await media.evaluate(node=>({
      overflow:getComputedStyle(node).overflow,
      background:getComputedStyle(node).backgroundColor
    }));
    expect(style.overflow).not.toBe('visible');
    await noOverflow(page);
  }
});

test('Refinement 04 — Innovation process is a semantic scientific figure',async({page})=>{
  await stubApi(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/innovation/');
  const figure=page.locator('figure.sci-figure.sci-process');
  await expect(figure).toBeVisible();
  await expect(figure.locator('.sci-process__step')).toHaveCount(4);
  await expect(figure.locator('figcaption.sci-figure__caption')).toContainText(/Four recurring clinical questions|Cuatro preguntas clínicas/);
  await expect(figure.locator('.sci-process__step-title').first()).toContainText(/Measure|Medir/);
  await noOverflow(page);
});

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`Refinements 01–04 visual certification — Innovation ${vp.name}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/innovation/');
    await expect(page.locator('.innovation-hero h1')).toBeVisible();
    await expect(page.locator('figure.sci-process')).toBeVisible();
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await noOverflow(page);
    await page.screenshot({
      path:path.join(OUTPUT,`elite-1-4-innovation-${vp.name}-${vp.width}.png`),
      fullPage:false,
      animations:'disabled'
    });
  });

  test(`Refinements 01–04 visual certification — cross-page top ${vp.name}`,async({page})=>{
    await stubApi(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const target of heroPages){
      await page.goto(target.url);
      await expect(page.locator(target.selector)).toBeAttached();
      await noOverflow(page);
      if(target.name==='home'||target.name==='research'||target.name==='team'){
        await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
        await page.screenshot({
          path:path.join(OUTPUT,`elite-1-4-${target.name}-${vp.name}-${vp.width}.png`),
          fullPage:false,
          animations:'disabled'
        });
      }
    }
  });
}
