const { test, expect } = require('@playwright/test');
const fs=require('fs');
const path=require('path');

const OUTPUT=path.join(process.cwd(),'phase4-visual-artifacts');
const POST={
  id:'reader-folio-1',
  post_type:'publication',
  title:'Clinical translation in respiratory research: from evidence to care',
  authors_text:'Dr. Ana Example; Dr. Luis Example; neumACt Research & Innovation',
  journal_name:'Respiratory Research',
  published_at:'2026-09-18T00:00:00Z',
  doi:'10.0000/neumact.reader.folio',
  body:'<p>This scholarly record examines how respiratory research moves from a clinical question through study design, multidisciplinary evaluation and implementation in care.</p><h2>Clinical relevance</h2><p>The publication connects evidence generation with practical respiratory pathways while preserving traceability to the programme and its research line.</p><blockquote>Research context remains visible alongside the record rather than being separated from it.</blockquote><h3>Methods and interpretation</h3><p>Structured review, clinical interpretation and multidisciplinary discussion support translation into practice.</p>',
  research_line:{id:'line-airway',line_number:2,name:'Airway Diseases'},
  is_featured:true
};
const PEOPLE=[
  {id:'ana-example',full_name:'Dr. Ana Example',staff_type:'attending_physician',specialization:'Pneumology',primary_dept_name:'Department of Pulmonology'},
  {id:'luis-example',full_name:'Dr. Luis Example',staff_type:'biomedical_engineer',specialization:'Biomedical Engineering',primary_dept_name:'Research & Innovation'}
];

async function stub(page){
  // Matching Playwright routes are evaluated in reverse registration order.
  await page.route('**/api/**',r=>r.fulfill({json:{data:[]}}));
  await page.route('**/api/research-lines/website',r=>r.fulfill({json:{data:[POST.research_line]}}));
  await page.route('**/api/team/website',r=>r.fulfill({json:{data:PEOPLE}}));
  await page.route('**/api/news/website**',r=>r.fulfill({json:{data:[POST]}}));
}
async function noOverflow(page){
  const g=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
  expect(g.documentWidth).toBeLessThanOrEqual(g.viewport+2);
  expect(g.bodyWidth).toBeLessThanOrEqual(g.viewport+2);
}
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

for(const vp of [
  {name:'phone',width:390,height:844},
  {name:'laptop',width:1440,height:900},
  {name:'workstation',width:2048,height:1152}
]){
  test(`scholarly publication folio — ${vp.name}`,async({page})=>{
    await stub(page);
    await page.setViewportSize({width:vp.width,height:vp.height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/news/?post=reader-folio-1');

    const sheet=page.locator('.pub-reader');
    await expect(sheet).toBeVisible();
    await expect(page.locator('#pubReaderTitle')).toContainText('Clinical translation');
    await expect(page.locator('.pub-reader__context-grid')).toBeVisible();
    await expect(page.locator('.pub-reader__people .pub-reader__person')).toHaveCount(2);
    await expect(page.locator('.pub-doi-link').first()).toContainText('10.0000/neumact.reader.folio');

    const geo=await page.evaluate(()=>{
      const sheet=document.querySelector('.pub-reader').getBoundingClientRect();
      const hdr=document.querySelector('#hdr').getBoundingClientRect();
      const style=getComputedStyle(document.querySelector('.pub-reader'));
      return {
        viewport:innerWidth,
        sheet:{top:sheet.top,right:sheet.right,bottom:sheet.bottom,left:sheet.left,width:sheet.width,height:sheet.height},
        headerHeight:hdr.height,
        radius:style.borderRadius,
        borderLeft:style.borderLeftWidth
      };
    });

    if(vp.width>820){
      expect(Math.abs(geo.sheet.top-geo.headerHeight)).toBeLessThanOrEqual(1);
      expect(Math.abs(geo.sheet.right-geo.viewport)).toBeLessThanOrEqual(1);
      expect(geo.radius).toBe('0px');
      expect(parseFloat(geo.borderLeft)).toBeGreaterThanOrEqual(1);
      expect(geo.sheet.width).toBeGreaterThan(vp.width>=1680?690:600);
    }else{
      expect(geo.sheet.top).toBeLessThanOrEqual(1);
      expect(geo.sheet.left).toBeLessThanOrEqual(1);
      expect(geo.sheet.right).toBeGreaterThanOrEqual(geo.viewport-1);
      expect(parseFloat(geo.radius)).toBeLessThanOrEqual(6);
    }

    await noOverflow(page);
    await page.evaluate(()=>{const c=document.getElementById('cookieBanner');if(c)c.style.display='none';});
    await page.screenshot({path:path.join(OUTPUT,`publication-reader-folio-${vp.name}-${vp.width}.png`),fullPage:false,animations:'disabled'});
  });
}

test('desktop reader uses current masthead height rather than a duplicated offset',async({page})=>{
  await stub(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/news/');
  await page.evaluate(()=>{
    const hdr=document.getElementById('hdr');
    hdr.classList.add('scrolled');
  });
  await page.locator('.pub-feature-lead').click();
  await expect(page.locator('.pub-reader')).toBeVisible();
  await page.waitForTimeout(360);

  const geo=await page.evaluate(()=>({
    header:document.getElementById('hdr').getBoundingClientRect().height,
    reader:document.querySelector('.pub-reader').getBoundingClientRect().top
  }));
  expect(Math.abs(geo.reader-geo.header)).toBeLessThanOrEqual(1);
});

test('reader close preserves publication-register URL semantics',async({page})=>{
  await stub(page);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/news/?post=reader-folio-1');
  await expect(page.locator('.pub-reader')).toBeVisible();
  await page.locator('.pub-reader__close').click();
  await expect(page).not.toHaveURL(/post=reader-folio-1/);
  await noOverflow(page);
});
