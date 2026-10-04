const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

async function stubIndex(page){
  await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[
    {id:'l1',line_number:1,name:'Transplantation'},
    {id:'l2',line_number:2,name:'Airway Diseases'},
    {id:'l3',line_number:3,name:'Interventional Pneumology'},
    {id:'l4',line_number:4,name:'Respiratory Failure & Sleep'},
    {id:'l5',line_number:5,name:'Thoracic Surgery'},
    {id:'l6',line_number:6,name:'Precision Medicine'}
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

for(const width of [320,390,430,620,768,880]){
  test(`mobile interaction audit — Index at ${width}px`,async({page})=>{
    await stubIndex(page);
    await page.setViewportSize({width,height:width<=430?844:900});
    await page.goto('/innovation/');
    await page.locator('#mobToggle').click();

    const chapter=page.locator('[data-index-chapter="team"]');
    await chapter.click();

    const result=await page.evaluate(()=>{
      const section=document.querySelector('.global-index__lines');
      const toggle=document.querySelector('.global-index__lines-toggle');
      const list=document.getElementById('globalIndexLines');
      const chapter=document.querySelector('[data-index-chapter="team"]');
      const trigger=document.getElementById('mobToggle');
      const close=document.querySelector('.global-index__close--mobile');
      function rect(el){if(!el)return null;const r=el.getBoundingClientRect();return {w:r.width,h:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};}
      return {
        width:innerWidth,
        expanded:toggle?toggle.getAttribute('aria-expanded'):null,
        collapsed:section?section.classList.contains('is-lines-collapsed'):null,
        listVisible:list?!!(list.offsetWidth||list.offsetHeight||list.getClientRects().length):false,
        chapter:rect(chapter),
        trigger:rect(trigger),
        disclosure:rect(toggle),
        close:rect(close)
      };
    });
    console.log('AUDIT_INDEX',JSON.stringify(result));
    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`mobile-index-audit-${width}.png`),fullPage:false,animations:'disabled'});
  });
}

test('mobile content rows use whole-row primary targets',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[{
    id:'line-1',line_number:1,short_name:'Transplantation',name:'Transplantation',description:'Clinical and translational respiratory research.'
  }]}}));
  await page.route('**/api/clinical-trials/website**',r=>r.fulfill({json:{data:[]}}));
  await page.goto('/clinical/');
  const row=page.locator('.research-line-row').first();
  await expect(row).toBeVisible();
  await expect(row).toHaveAttribute('href',/\/line\/\?id=line-1/);
  const box=await row.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await noOverflow(page);
});

test('mobile Publications record is a whole-card button target',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[{
    id:'p1',post_type:'publication',title:'Mobile publication target',authors_text:'neumACt',journal_name:'Fixture Journal',published_at:'2026-01-15T00:00:00Z',is_featured:true
  }]}}));
  await page.route('**/api/team/website',r=>r.fulfill({json:{data:[]}}));
  await page.goto('/news/');
  const card=page.locator('.pub-feature-lead');
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('type','button');
  const box=await card.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await noOverflow(page);
});
