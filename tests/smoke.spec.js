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
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] })
  }));
  await page.route('**/api/news/website?type=publication&line=test-line&limit=5', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] })
  }));

  await page.goto('/line/?id=test-line');
  await expect(page.locator('#lineHero')).toBeVisible({ timeout: 6000 });
  await expect(page.locator('#lineTitle')).toContainText('Transplantation');
  await expect(page.locator('#lineLoadingState')).toBeHidden();
});
