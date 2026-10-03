const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');
const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');

const post={
  id:'reader-audit-1',
  post_type:'publication',
  title:'Clinical translation in respiratory research: from evidence to care',
  authors_text:'Dr. Ana Example; Dr. Luis Example; neumACt Research & Innovation',
  journal_name:'Respiratory Research',
  published_at:'2026-09-18T00:00:00Z',
  doi:'10.0000/neumact.reader.audit',
  body:'<p>This scholarly record examines how respiratory research moves from a clinical question through study design, multidisciplinary evaluation and implementation in care.</p><h2>Clinical relevance</h2><p>The publication connects evidence generation with practical respiratory pathways while preserving traceability to the programme and its research line.</p><blockquote>Research context remains visible alongside the record rather than being separated from it.</blockquote><h3>Methods and interpretation</h3><p>Structured review, clinical interpretation and multidisciplinary discussion support translation into practice.</p>',
  research_line:{id:'line-airway',line_number:2,name:'Airway Diseases'},
  is_featured:true
};
const people=[
 {id:'ana-example',full_name:'Dr. Ana Example',staff_type:'attending_physician',specialization:'Pneumology',primary_dept_name:'Department of Pulmonology'},
 {id:'luis-example',full_name:'Dr. Luis Example',staff_type:'biomedical_engineer',specialization:'Biomedical Engineering',primary_dept_name:'Research & Innovation'}
];

async function stub(page){
  await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[post]}}));
  await page.route('**/api/team/website',r=>r.fulfill({json:{data:people}}));
  await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[post.research_line]}}));
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
 test(`publication reader audit — ${vp.name}`,async({page})=>{
   await stub(page);
   await page.setViewportSize({width:vp.width,height:vp.height});
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto('/news/?post=reader-audit-1');
   const sheet=page.locator('.pub-reader');
   await expect(sheet).toBeVisible();
   await expect(page.locator('#pubReaderTitle')).toContainText('Clinical translation');
   await expect(page.locator('.pub-reader__context-grid')).toBeVisible();
   await expect(page.locator('.pub-reader__people .pub-reader__person')).toHaveCount(2);
   await noOverflow(page);
   await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
   await page.screenshot({path:path.join(OUTPUT,`publication-reader-audit-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
 });
}
