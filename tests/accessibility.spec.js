const { test, expect } = require('@playwright/test');

const CORE_PAGES = ['/', '/clinical/', '/innovation/', '/news/', '/team/'];

for (const path of CORE_PAGES) {
  test(`${path} preserves shared accessibility basics`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const skip = page.locator('.skip-link').first();
    await expect(skip).toHaveCount(1);
    const href = await skip.getAttribute('href');
    expect(href && href.startsWith('#')).toBeTruthy();
    if (href && href.startsWith('#')) {
      await expect(page.locator(href)).toHaveCount(1);
    }

    const missingAlt = await page.locator('img:not([alt])').count();
    expect(missingAlt).toBe(0);

    const unnamedButtons = await page.locator('button').evaluateAll((buttons) =>
      buttons.filter((button) => {
        const aria = button.getAttribute('aria-label') || button.getAttribute('aria-labelledby');
        const text = (button.textContent || '').trim();
        const title = (button.getAttribute('title') || '').trim();
        return !aria && !text && !title;
      }).length
    );
    expect(unnamedButtons).toBe(0);

    const unsafeNewTabs = await page.locator('a[target="_blank"]').evaluateAll((links) =>
      links.filter((link) => {
        const rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        return !rel.includes('noopener') || !rel.includes('noreferrer');
      }).length
    );
    expect(unsafeNewTabs).toBe(0);

    const banner = page.locator('#cookieBanner');
    if (await banner.count()) {
      await expect(banner).toHaveAttribute('role', 'region');
      await expect(banner).toHaveAttribute('aria-label', /Cookie notice|Aviso de cookies/);
    }
  });
}
