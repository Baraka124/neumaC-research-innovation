const { test, expect } = require('@playwright/test');

const WORKSTATION_PAGES = [
  { path: '/', selector: '.home-programme-panel' },
  { path: '/clinical/', selector: '.research-hero__sheet' },
  { path: '/innovation/', selector: '.innovation-hero__grid' },
  { path: '/news/', selector: '.pub-hero__register-shell' },
  { path: '/team/', selector: '.team-hero__grid' },
];

async function expectNoHorizontalOverflow(page) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewport + 2);
  expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewport + 2);
}

for (const viewport of [
  { width: 1680, height: 1050, header: 106 },
  { width: 1920, height: 1080, header: 106 },
  { width: 2048, height: 1152, header: 106 },
]) {
  test.describe(`workstation ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const item of WORKSTATION_PAGES) {
      test(`${item.path} uses the wide canvas without overflow`, async ({ page }) => {
        await page.goto(item.path);
        await expect(page.locator('#workstationCss')).toBeAttached();
        await expect(page.locator('#hdr')).toBeVisible();
        await expect(page.locator(item.selector)).toBeVisible();

        const headerHeight = await page.locator('#hdr').evaluate(el => el.getBoundingClientRect().height);
        expect(Math.abs(headerHeight - viewport.header)).toBeLessThanOrEqual(1);

        const bodyPaddingTop = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingTop));
        expect(Math.abs(bodyPaddingTop - viewport.header)).toBeLessThanOrEqual(1);

        const surfaceWidth = await page.locator(item.selector).evaluate(el => el.getBoundingClientRect().width);
        const minExpected = viewport.width >= 1920 ? 1450 : 1350;
        expect(surfaceWidth).toBeGreaterThan(minExpected);
        expect(surfaceWidth).toBeLessThanOrEqual(viewport.width);

        await expectNoHorizontalOverflow(page);
      });
    }

    test('desktop Editorial Index is aligned to the workstation masthead', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#hdrIndexBtn')).toBeVisible();
      await page.locator('#hdrIndexBtn').click();
      await expect(page.locator('#globalIndex')).toHaveClass(/is-open/);

      const geometry = await page.evaluate(() => {
        const index = document.querySelector('#globalIndex').getBoundingClientRect();
        const surface = document.querySelector('.global-index__surface').getBoundingClientRect();
        return {
          top: index.top,
          surfaceWidth: surface.width,
          viewport: window.innerWidth,
        };
      });

      expect(Math.abs(geometry.top - viewport.header)).toBeLessThanOrEqual(1);
      expect(geometry.surfaceWidth).toBeGreaterThan(viewport.width >= 1920 ? 1600 : 1500);
      expect(geometry.surfaceWidth).toBeLessThanOrEqual(geometry.viewport);
      await expectNoHorizontalOverflow(page);
    });
  });
}

test('1440px desktop keeps the standard pre-workstation geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const headerHeight = await page.locator('#hdr').evaluate(el => el.getBoundingClientRect().height);
  expect(Math.abs(headerHeight - 103)).toBeLessThanOrEqual(1);

  const bodyPaddingTop = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingTop));
  expect(Math.abs(bodyPaddingTop - 103)).toBeLessThanOrEqual(1);

  await expectNoHorizontalOverflow(page);
});

for (const width of [1024, 1280, 1440, 1680, 1920, 2048]) {
  test(`Research leadership remains fully inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1680 ? 1080 : 900 });
    await page.goto('/clinical/');

    await expect(page.locator('.research-hero__sheet')).toBeVisible();
    await expect(page.locator('.research-leadership')).toBeVisible();
    await expect(page.locator('.research-leadership__portrait img')).toBeVisible();

    const geometry = await page.evaluate(() => {
      const sheet = document.querySelector('.research-hero__sheet').getBoundingClientRect();
      const leadership = document.querySelector('.research-leadership').getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        sheetLeft: sheet.left,
        sheetRight: sheet.right,
        leadershipLeft: leadership.left,
        leadershipRight: leadership.right,
      };
    });

    expect(geometry.sheetLeft).toBeGreaterThanOrEqual(-1);
    expect(geometry.sheetRight).toBeLessThanOrEqual(geometry.viewport + 1);
    expect(geometry.leadershipLeft).toBeGreaterThanOrEqual(geometry.sheetLeft - 1);
    expect(geometry.leadershipRight).toBeLessThanOrEqual(geometry.sheetRight + 1);
    expect(geometry.leadershipRight).toBeLessThanOrEqual(geometry.viewport + 1);
    await expectNoHorizontalOverflow(page);
  });
}
