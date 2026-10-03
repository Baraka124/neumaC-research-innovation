const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');

async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

for(const target of [
  {name:'privacy',url:'/privacidad/'},
  {name:'accessibility',url:'/accesibilidad/'},
  {name:'legal',url:'/aviso-legal/'}
]){
  test(`legal-page audit — ${target.name} laptop`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(target.url);
    await expect(page.locator('.legal-page')).toBeVisible();
    await expect(page.locator('#siteFooter')).toBeAttached();
    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`legal-audit-${target.name}-laptop-1440.png`),fullPage:false,animations:'disabled'});
  });
}

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'workstation',width:2048,height:1152}
]){
  test(`legal-page audit — privacy ${vp.name}`,async({page})=>{
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/privacidad/');
    await expect(page.locator('.legal-page')).toBeVisible();
    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`legal-audit-privacy-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}

test('legal page preserves current masthead, bilingual body and footer',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/privacidad/');
  await expect(page.locator('#hdr')).toBeVisible();
  await expect(page.locator('.legal-page__title [lang="en"]')).toContainText('Privacy Policy');
  await expect(page.locator('.legal-page__body')).toBeVisible();
  await page.locator('#ltBtnEs').click();
  await expect(page.locator('.legal-page__title [lang="es"]')).toBeVisible();
  await expect(page.locator('#siteFooter')).toBeAttached();
  await noOverflow(page);
});
