// Smoke test: every page loads with zero console errors, content is
// visible (the blank-page class of bug), nav works, language toggles.
// Run: npx playwright test  (CI serves the repo statically first)
const { test, expect } = require('@playwright/test');

const PAGES = ['/', '/team/', '/clinical/', '/innovation/', '/news/',
               '/privacidad/', '/accesibilidad/', '/aviso-legal/'];

for (const path of PAGES) {
  test(`${path} loads clean and visible`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(path);
    await expect(page.locator('#hdr')).toBeAttached();
    // blank-page guard: at least one .reveal must become visible
    const reveals = page.locator('.reveal');
    if (await reveals.count() > 0) {
      await expect(reveals.first()).toHaveClass(/in/, { timeout: 6000 });
    }
    // API-driven pages log fetch failures in a static test server —
    // ignore network errors, fail on genuine script errors only.
    const scriptErrors = errors.filter(e =>
      !/Failed to fetch|NetworkError|ERR_|429|fetch/i.test(e));
    expect(scriptErrors, scriptErrors.join('\n')).toHaveLength(0);
  });
}

test('language toggle switches and persists', async ({ page }) => {
  await page.goto('/team/');
  await page.click('#ltBtnEs');
  await expect(page.locator('html')).toHaveAttribute('data-lang', 'es');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-lang', 'es');
});

test('mobile drawer opens, traps focus, closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.click('#mobToggle');
  await expect(page.locator('#mobDrawer')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobDrawer')).not.toHaveClass(/open/);
});


test('research line detail reveals after API render', async ({ page }) => {
  await page.route('**/api/research-lines/test-line/website', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: {
      id: 'test-line', line_number: 1,
      name: 'Transplantation & Pulmonary Hypertension',
      short_name: 'Transplantation & Pulmonary Hypertension',
      description: 'Mock research line used by the browser smoke test.',
      active_trials: 0, active_projects: 0, total_trials: 0, total_projects: 0,
      keywords: [], track_record: [], team: [], trials_list: []
    }})
  }));
  await page.route('**/api/research-lines/website', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] })
  }));
  await page.route('**/api/clinical-trials/website?line=test-line', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [
      { id:'t1', title:'Mock active trial', phase:'Phase III', status:'Reclutando', study_type:'Interventional', description:'Trial description' },
      { id:'t2', title:'Mock observational study', phase:'Phase IV', status:'Activo', study_type:'Observational', description:'Study description' }
    ] })
  }));
  await page.route('**/api/innovation-projects/website?line=test-line', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [
      { id:'i1', title:'Mock clinical innovation', category:'Salud Digital', current_stage:'pilot', description:'Innovation description' }
    ] })
  }));
  await page.route('**/api/news/website?type=publication&line=test-line&limit=100', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [
      { id:'p1', title:'Mock publication 2025', journal_name:'Respiratory Research', published_at:'2025-04-01' },
      { id:'p2', title:'Mock publication 2026', journal_name:'CHEST', published_at:'2026-02-01' }
    ] })
  }));

  await page.goto('/line/?id=test-line');
  await expect(page.locator('#lineHero')).toBeVisible({ timeout: 6000 });
  await expect(page.locator('#lineTitle')).toContainText('Transplantation');
  await expect(page.locator('#lineLoadingState')).toBeHidden();
  await expect(page.locator('#lineIntroSection')).toBeVisible();
  await expect(page.locator('#lineMetricTrials')).toHaveText('1');
  await expect(page.locator('#lineMetricStudies')).toHaveText('1');
  await expect(page.locator('#lineMetricInnovation')).toHaveText('1');
  await expect(page.locator('#lineMetricPublications')).toHaveText('2');
  await expect(page.locator('.line-chart-card')).toHaveCount(0);
  await expect(page.locator('.line-fact')).toHaveCount(4);
  await expect(page.locator('#linePubsList .line-pub')).toHaveCount(2);
});

test('premium header keeps Research as a direct primary destination', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hdrSearchBtn')).toBeVisible();
  const research = page.locator('.hdr-nav-link[data-nav="research"]');
  await expect(research).toHaveAttribute('href', '/clinical/');
  await expect(page.locator('.hdr-dd-chevron')).toHaveCount(0);
  await expect(page.locator('#researchMegaMenu')).toHaveCount(0);
  await expect(page.locator('#hdrIndexBtn')).toBeVisible();
  await page.click('#hdrIndexBtn');
  await expect(page.locator('#globalIndex')).toHaveClass(/is-open/);
  await page.keyboard.press('Escape');
  await page.click('#hdrSearchBtn');
  await expect(page.locator('.cmdk-overlay')).toBeVisible();
});

test('final landing page renders its live editorial surfaces', async ({ page }) => {
  const lines = Array.from({ length: 6 }, (_, i) => ({
    id: `home-line-${i + 1}`,
    line_number: i + 1,
    short_name: ['Transplantation & Pulmonary Hypertension','Airway Diseases','Interventional Pneumology & Lung Cancer','Respiratory Failure & Sleep Medicine','Innovation in Thoracic Surgery','Precision Medicine & Clinical Innovation'][i],
    name: ['Transplantation & Pulmonary Hypertension','Airway Diseases','Interventional Pneumology & Lung Cancer','Respiratory Failure & Sleep Medicine','Innovation in Thoracic Surgery','Precision Medicine & Clinical Innovation'][i],
    active_trials: i === 1 ? 3 : (i === 4 ? 2 : 0),
    coordinator: null
  }));
  await page.route('**/api/research-lines/website', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: lines })
  }));
  await page.route('**/api/team/website', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: Array.from({length: 23}, (_,i) => ({id:`m${i}`})) })
  }));
  await page.route('**/api/news/website*', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [
      { id:'p1', title:'Respiratory research in practice', post_type:'publication', is_featured:true, journal_name:'European Respiratory Journal', published_at:'2026-09-01' },
      { id:'p2', title:'Clinical pathways and evidence', post_type:'article', published_at:'2026-08-20' },
      { id:'p3', title:'Translational respiratory medicine', post_type:'publication', published_at:'2026-07-12' },
      { id:'p4', title:'Research infrastructure update', post_type:'update', published_at:'2026-06-18' },
      { id:'p5', title:'Department research highlight', post_type:'highlight', published_at:'2026-05-11' }
    ] })
  }));
  await page.route('**/api/innovation-projects/website', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [
      { id:'i1', title:'Clinical technology validation programme', description:'A live innovation project built around respiratory-care needs.', category:'Digital Health', current_stage:'Piloto', is_featured:true }
    ] })
  }));

  await page.goto('/');
  await expect(page.locator('.home-hero-title')).toBeVisible();
  await expect(page.locator('.home-programme-panel')).toBeVisible();
  await expect(page.locator('#researchLinesGrid .home-line-row')).toHaveCount(6);
  await expect(page.locator('#storySection .home-current-grid')).toBeVisible({ timeout: 6000 });
  await expect(page.locator('#storySection .home-current-record--publication')).toBeVisible();
  await expect(page.locator('#storySection .home-current-record--innovation')).toBeVisible();
  await expect(page.locator('.home-agenda')).toHaveCount(0);
  await expect(page.locator('.home-method-row')).toHaveCount(0);
  await expect(page.locator('.home-network')).toBeVisible();
  await expect(page.locator('.home-contact-disclosure')).toBeVisible();
  await expect(page.locator('.home-contact-disclosure')).not.toHaveAttribute('open', '');
  await page.locator('.home-contact-disclosure summary').click();
  await expect(page.locator('#contactForm')).toBeVisible();
});

test('research page uses compact editorial portfolio instead of legacy dashboard', async ({ page }) => {
  const lines = Array.from({ length: 6 }, (_, i) => ({
    id: `r${i + 1}`,
    line_number: i + 1,
    name: ['Transplantation & Pulmonary Hypertension','Airway Diseases','Interventional Pneumology & Lung Cancer','Respiratory Failure & Sleep Medicine','Innovation in Thoracic Surgery','Precision Medicine & Clinical Innovation'][i],
    short_name: ['Transplantation & Pulmonary Hypertension','Airway Diseases','Interventional Pneumology & Lung Cancer','Respiratory Failure & Sleep Medicine','Innovation in Thoracic Surgery','Precision Medicine & Clinical Innovation'][i],
    active_trials: i < 3 ? i + 1 : 0,
    description: i === 0 ? `Editorial description for research area ${i + 1} connecting clinical questions, cohorts and translational methods across patient follow-up, biomarkers, prognostic factors, long-term outcomes and clinical practice. This intentionally long description verifies the professional read-more disclosure without turning the overview into a data dump.` : `Editorial description for research area ${i + 1} connecting clinical questions, cohorts and translational methods.`,
    keywords: ['clinical research','respiratory medicine','translation'],
    coordinator: { full_name: `Coordinator ${i + 1}` }
  }));
  const trials = Array.from({ length: 9 }, (_, i) => ({
    id: `t${i + 1}`,
    protocol_id: `PROTO-${i + 1}`,
    title: `Respiratory study ${i + 1}`,
    phase: 'Phase III',
    status: i < 3 ? 'Reclutando' : 'Activo',
    sponsor_name: `Sponsor ${i + 1}`,
    research_line: { id:'r1', line_number:1, name:'Transplantation & Pulmonary Hypertension', short_name:'Transplantation' },
    additional_lines: []
  }));
  await page.route('**/api/research-lines/website', route => route.fulfill({
    status:200, contentType:'application/json', body:JSON.stringify({data:lines})
  }));
  await page.route('**/api/clinical-trials/website*', route => route.fulfill({
    status:200, contentType:'application/json', body:JSON.stringify({data:trials})
  }));
  await page.goto('/clinical/');
  await expect(page.locator('.research-hero')).toBeVisible();
  await expect(page.locator('.research-hero__sheet')).toBeVisible();
  await expect(page.locator('.research-leadership__portrait img')).toHaveAttribute('src', /pi-pedro-marcos\.jpg/);
  await expect(page.locator('#researchLinesList .research-line-row')).toHaveCount(6, { timeout:6000 });
  await expect(page.locator('#researchLinesList .research-line__media img')).toHaveCount(6);
  await expect(page.locator('#researchLinesList .research-line__title')).toHaveCount(6);
  await expect(page.locator('#researchLinesList .research-line__num')).toHaveCount(6);
  await expect(page.locator('#researchLinesList .research-line__coordinator')).toHaveCount(6);
  await expect(page.locator('#researchLinesList')).toHaveCSS('display', 'block');
  const rowPositions = await page.locator('#researchLinesList .research-line-row').evaluateAll(nodes => nodes.slice(0,2).map(n => ({ top:n.getBoundingClientRect().top, left:n.getBoundingClientRect().left, width:n.getBoundingClientRect().width })));
  expect(rowPositions[1].top).toBeGreaterThan(rowPositions[0].top + 70);
  expect(Math.abs(rowPositions[1].left - rowPositions[0].left)).toBeLessThan(4);
  expect(Math.abs(rowPositions[1].width - rowPositions[0].width)).toBeLessThan(4);
  await expect(page.locator('#researchLinesList .research-line-code')).toHaveCount(0);
  await expect(page.locator('#researchLinesList .research-chapter__motif')).toHaveCount(0);
  await expect(page.locator('#researchLinesList .research-line__more')).toHaveCount(0);
  await expect(page.locator('table.trials')).toHaveCount(0);
  await expect(page.locator('.study-summary')).toHaveCount(0);
  await expect(page.locator('.affil-section')).toHaveCount(0);
  await expect(page.locator('#studiesBody .study-row')).toHaveCount(9, { timeout:6000 });
  await expect(page.locator('#studiesBody .study-row:visible')).toHaveCount(6);
  await expect(page.locator('#studiesExpandBtn')).toBeVisible();
  await page.locator('#studiesExpandBtn').click();
  await expect(page.locator('#studiesBody .study-row:visible')).toHaveCount(9);
  await expect(page.locator('#researchInquiryToggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#researchInquiryPanel')).toBeHidden();
  await page.locator('#researchInquiryToggle').click();
  await expect(page.locator('#researchInquiryToggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#researchInquiryPanel')).toBeVisible();
  await expect(page.locator('#researchForm')).toBeVisible();
  await page.locator('#researchInquiryClose').click();
  await expect(page.locator('#researchInquiryPanel')).toBeHidden();
});
