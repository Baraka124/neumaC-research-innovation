const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');

async function stub(page){
  const fulfill=r=>r.fulfill({json:{data:[]}});
  await page.route('**/api/**',fulfill);
}
async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`institutional footer audit — ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    const footer=page.locator('#siteFooter');
    await expect(footer).toBeVisible();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await noOverflow(page);
    await footer.screenshot({path:path.join(OUTPUT,`footer-audit-${vp.name}-${vp.width}.png`),animations:'disabled'});
  });
}
