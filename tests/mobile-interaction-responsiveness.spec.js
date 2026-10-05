const { test, expect } = require('@playwright/test');

async function stubIndex(page){
  await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[
    {id:'l1',line_number:1,name:'Transplantation'},
    {id:'l2',line_number:2,name:'Airway Diseases'}
  ]}}));
  await page.route('**/api/team/website',r=>r.fulfill({json:{data:[]}}));
  await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[]}}));
  await page.route('**/api/innovation-projects/website',r=>r.fulfill({json:{data:[]}}));
}
async function noOverflow(page){
  const g=await page.evaluate(()=>({v:innerWidth,d:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  expect(g.d).toBeLessThanOrEqual(g.v+2);
  expect(g.b).toBeLessThanOrEqual(g.v+2);
}

for(const width of [320,390,430,620]){
  test(`phone Index is one-tap and touch-safe at ${width}px`,async({page})=>{
    await stubIndex(page);
    await page.setViewportSize({width,height:width<=430?844:900});
    await page.goto('/innovation/');

    const trigger=page.locator('#mobToggle');
    await expect(trigger).toBeVisible();
    await trigger.click();

    await expect(page.locator('.global-index__lines')).toBeHidden();

    await page.locator('[data-index-chapter="team"]').click();
    await expect(page).toHaveURL(/\/team\/?$/);

    const sizes=await page.evaluate(()=>{
      function box(sel){
        const el=document.querySelector(sel); if(!el)return null;
        const r=el.getBoundingClientRect(); return {w:r.width,h:r.height};
      }
      return {
        trigger:box('#mobToggle'),
        close:box('.global-index__close--mobile'),
        disclosure:box('.global-index__lines-toggle')
      };
    });

    expect(sizes.trigger.h).toBeGreaterThanOrEqual(44);
    expect(sizes.close.h).toBeGreaterThanOrEqual(44);
    expect(sizes.close.w).toBeGreaterThanOrEqual(44);
    expect(sizes.disclosure).toBeNull();

    await page.locator('[data-open-index-search]').click();
    await expect(page.locator('.global-search__close')).toBeHidden();
    const searchSizes=await page.evaluate(()=>{
      function box(sel){
        const el=document.querySelector(sel); if(!el)return null;
        const r=el.getBoundingClientRect(); return {w:r.width,h:r.height};
      }
      const filters=Array.from(document.querySelectorAll('.global-search__filters button')).map(el=>{
        const r=el.getBoundingClientRect(); return {w:r.width,h:r.height};
      });
      return {back:box('.global-search__back'),filters};
    });

    expect(searchSizes.back.h).toBeGreaterThanOrEqual(44);
    for(const item of searchSizes.filters) expect(item.h).toBeGreaterThanOrEqual(44);

    await noOverflow(page);
  });
}

test('tablet keeps full Index content without phone disclosure',async({page})=>{
  await stubIndex(page);
  await page.setViewportSize({width:768,height:1024});
  await page.goto('/innovation/');
  await page.locator('#mobToggle').click();
  await expect(page.locator('.global-index__lines-toggle')).toBeHidden();
  await expect(page.locator('.global-index__lines')).toHaveClass(/is-lines-expanded/);
  await expect(page.locator('#globalIndexLines')).toBeVisible();
  await noOverflow(page);
});
