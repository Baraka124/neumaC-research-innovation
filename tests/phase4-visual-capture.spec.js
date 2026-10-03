const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(), 'phase4-visual-artifacts');

const PAGES = [
  { path: '/', name: 'home', selector: '.home-programme-panel' },
  { path: '/clinical/', name: 'research', selector: '.research-hero__sheet' },
  { path: '/news/', name: 'publications', selector: '.pub-hero__register-shell' },
  { path: '/team/', name: 'team', selector: '.team-hero__grid' },
  { path: '/innovation/', name: 'innovation', selector: '.innovation-question-list' },
];

const VIEWPORTS = [
  { width: 390, height: 844, name: 'phone' },
  { width: 1440, height: 900, name: 'laptop' },
  { width: 2048, height: 1152, name: 'workstation' },
];

async function stubKnownPublicApi(page) {
  const body = JSON.stringify({ data: [] });
  const fulfill = route => route.fulfill({ status: 200, contentType: 'application/json', body });
  await page.route('**/api/research-lines/website', fulfill);
  await page.route('**/api/team/website', fulfill);
  await page.route('**/api/news/website*', fulfill);
  await page.route('**/api/innovation-projects/website', fulfill);
  await page.route('**/api/clinical-trials/website*', fulfill);
}

test.beforeAll(() => {
  fs.mkdirSync(OUTPUT, { recursive: true });
});

for (const viewport of VIEWPORTS) {
  for (const item of PAGES) {
    test(`Phase 4 capture: ${item.name} ${viewport.name}`, async ({ page }) => {
      await stubKnownPublicApi(page);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(item.path);
      await expect(page.locator(item.selector)).toBeVisible();
      await page.waitForTimeout(150);

      await page.screenshot({
        path: path.join(OUTPUT, `${viewport.name}-${viewport.width}-${item.name}.png`),
        fullPage: false,
        animations: 'disabled',
      });
    });
  }
}
