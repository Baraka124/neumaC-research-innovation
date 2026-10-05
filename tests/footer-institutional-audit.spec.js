const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');

async function stub(page){
  await page.route('**/api/**',r=>r.fulfill({json:{data:[]}}));
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
  test(`institutional footer remains composed at ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    const footer=page.locator('#siteFooter');
    await expect(footer).toBeVisible();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});

    await expect(page.locator('.footer-brand-plate')).toBeVisible();
    await expect(page.locator('.footer-logo-img')).toHaveAttribute('src','/logo.svg');
    await expect(page.locator('.footer-col-nav nav a')).toHaveCount(5);
    await expect(page.locator('.footer-legal-nav a')).toHaveCount(3);

    const geo=await page.evaluate(()=>{
      const footer=document.querySelector('#siteFooter').getBoundingClientRect();
      const shell=document.querySelector('.footer-shell').getBoundingClientRect();
      const bottom=document.querySelector('.footer-bottom-bar').getBoundingClientRect();
      const plate=document.querySelector('.footer-brand-plate');
      const p=getComputedStyle(plate);
      return {
        viewport:innerWidth,
        footer:{left:footer.left,right:footer.right,width:footer.width},
        shell:{left:shell.left,right:shell.right,width:shell.width},
        bottom:{left:bottom.left,right:bottom.right,width:bottom.width},
        plateRadius:p.borderRadius,
        plateShadow:p.boxShadow
      };
    });

    expect(geo.shell.left).toBeGreaterThanOrEqual(-1);
    expect(geo.shell.right).toBeLessThanOrEqual(geo.viewport+1);
    expect(geo.bottom.left).toBeGreaterThanOrEqual(-1);
    expect(geo.bottom.right).toBeLessThanOrEqual(geo.viewport+1);
    expect(geo.plateRadius).toBe('2px');
    expect(geo.plateShadow).toBe('none');

    if(vp.width>=1600){
      expect(geo.shell.width).toBeLessThanOrEqual(1442);
      expect(geo.bottom.width).toBeLessThanOrEqual(1442);
    }
    if(vp.width<=520){
      const display=await page.locator('.footer-bottom-bar').evaluate(el=>getComputedStyle(el).flexDirection);
      expect(display).toBe('column');
    }

    await noOverflow(page);
    await footer.screenshot({
      path:path.join(OUTPUT,`footer-institutional-${vp.name}-${vp.width}.png`),
      animations:'disabled'
    });
  });
}

test('footer legal and institutional hierarchy remains present',async({page})=>{
  await stub(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const footer=page.locator('#siteFooter');
  await footer.scrollIntoViewIfNeeded();

  await expect(page.locator('.footer-descriptor')).toContainText(/Respiratory research and innovation|Investigación e innovación/);
  await expect(page.locator('.footer-institution')).toContainText(/Área Sanitaria da Coruña e Cee/);
  await expect(page.locator('.footer-address')).toContainText(/INIBIC/);
  await expect(page.locator('.footer-address')).toContainText(/SERGAS/);
  await expect(page.locator('.footer-enquiry-link')).toBeVisible();
  await noOverflow(page);
});
