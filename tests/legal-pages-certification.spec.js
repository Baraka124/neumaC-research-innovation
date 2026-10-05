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

for(const target of [
  {name:'privacy',url:'/privacidad/',title:/Privacy Policy|Política de Privacidad/},
  {name:'accessibility',url:'/accesibilidad/',title:/Accessibility|Accesibilidad/},
  {name:'legal',url:'/aviso-legal/',title:/Legal Notice|Aviso Legal/}
]){
  test(`institutional document system — ${target.name} laptop`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(target.url);

    const shell=page.locator('.legal-page__shell');
    const body=page.locator('.legal-page__body');
    await expect(shell).toBeVisible();
    await expect(page.locator('.legal-page__title')).toContainText(target.title);
    await expect(body).toBeVisible();

    const geo=await page.evaluate(()=>{
      const shell=document.querySelector('.legal-page__shell').getBoundingClientRect();
      const body=document.querySelector('.legal-page__body').getBoundingClientRect();
      const title=document.querySelector('.legal-page__title').getBoundingClientRect();
      return {viewport:innerWidth,shell:{left:shell.left,right:shell.right,width:shell.width},body:{left:body.left,right:body.right,width:body.width},title:{left:title.left,width:title.width}};
    });
    expect(geo.shell.left).toBeGreaterThan(120);
    expect(geo.shell.right).toBeLessThan(1320);
    expect(geo.body.width).toBeLessThanOrEqual(822);
    expect(Math.abs(geo.body.left-geo.title.left)).toBeLessThanOrEqual(1);
    await noOverflow(page);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`legal-document-${target.name}-laptop-1440.png`),fullPage:false,animations:'disabled'});
  });
}

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'workstation',width:2048,height:1152}
]){
  test(`institutional document system — privacy ${vp.name}`,async({page})=>{
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/privacidad/');

    const geo=await page.evaluate(()=>{
      const shell=document.querySelector('.legal-page__shell').getBoundingClientRect();
      const body=document.querySelector('.legal-page__body').getBoundingClientRect();
      return {viewport:innerWidth,shell:{left:shell.left,right:shell.right,width:shell.width},body:{left:body.left,right:body.right,width:body.width}};
    });

    expect(geo.shell.left).toBeGreaterThanOrEqual(vp.width<=560?15:460);
    expect(geo.shell.right).toBeLessThanOrEqual(geo.viewport-(vp.width<=560?15:460));
    expect(geo.body.width).toBeLessThanOrEqual(822);
    await noOverflow(page);

    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`legal-document-privacy-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}

test('institutional document system preserves bilingual and legal navigation behavior',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/privacidad/');
  await expect(page.locator('.legal-page__title [lang="es"]')).toBeVisible();
  await expect(page.locator('.legal-page__title [lang="en"]')).toBeHidden();
  await page.locator('#ltBtnEn').click();
  await expect(page.locator('.legal-page__title [lang="en"]')).toBeVisible();
  await expect(page.locator('.legal-page__title [lang="es"]')).toBeHidden();
  await expect(page.locator('#siteFooter')).toBeAttached();
  await expect(page.locator('.footer-legal-nav a')).toHaveCount(3);
  await noOverflow(page);
});

test('legal-page affiliations remain a quiet bounded institutional register',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/privacidad/');
  const section=page.locator('.legal-page + .affil-section');
  await expect(section).toBeAttached();
  const cards=section.locator('.affil-card,.affil-card--placeholder');
  expect(await cards.count()).toBeGreaterThan(0);
  const first=cards.first();
  const style=await first.evaluate(el=>({radius:getComputedStyle(el).borderRadius,shadow:getComputedStyle(el).boxShadow}));
  expect(style.radius).toBe('2px');
  expect(style.shadow).toBe('none');
  await noOverflow(page);
});
