const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(process.cwd(),'phase4-visual-artifacts');
test.beforeAll(()=>fs.mkdirSync(OUTPUT,{recursive:true}));

test('capture canonical neumACT logo at intrinsic resolution', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 360 });
  await page.goto('/logo.svg');
  const logo = page.locator('svg');
  await expect(logo).toBeVisible();
  await logo.screenshot({
    path: path.join(OUTPUT,'canonical-neumact-logo-988x286.png'),
    animations: 'disabled'
  });
});
