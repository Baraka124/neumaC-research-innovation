const { test, expect } = require('@playwright/test');

const CORE_PAGES = [
  { path: '/', selector: '.home-programme-panel', label: 'Home' },
  { path: '/clinical/', selector: '.research-hero__sheet', label: 'Research' },
  { path: '/innovation/', selector: '.innovation-hero__grid', label: 'Innovation' },
  { path: '/news/', selector: '.pub-hero__panel', label: 'Publications' },
  { path: '/team/', selector: '.team-hero__grid', label: 'Team' },
];

const BREAKPOINTS = [
  { width: 390, height: 844, name: 'phone' },
  { width: 620, height: 900, name: 'large phone' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 900, name: 'small laptop' },
  { width: 1440, height: 900, name: 'desktop' },
  { width: 1680, height: 1050, name: 'wide desktop' },
  { width: 2048, height: 1152, name: 'hospital workstation' },
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

async function expectContainedInViewport(locator, viewportWidth) {
  const rect = await locator.evaluate(el => {
    const box = el.getBoundingClientRect();
    return { left: box.left, right: box.right, width: box.width };
  });

  expect(rect.width).toBeGreaterThan(0);
  expect(rect.left).toBeGreaterThanOrEqual(-1);
  expect(rect.right).toBeLessThanOrEqual(viewportWidth + 1);
}

for (const viewport of BREAKPOINTS) {
  test.describe(`${viewport.name} ${viewport.width}px certification`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const item of CORE_PAGES) {
      test(`${item.label} opening composition remains contained`, async ({ page }) => {
        await page.goto(item.path);

        await expect(page.locator('#hdr')).toBeVisible();
        await expect(page.locator('#editorialSurfacesCss')).toBeAttached();
        await expect(page.locator('#mobileChromeCss')).toBeAttached();
        await expect(page.locator('#editorialRhythmCss')).toBeAttached();
        await expect(page.locator('#editorialHierarchyCss')).toBeAttached();
        await expect(page.locator('#editorialMediaCss')).toBeAttached();
        await expect(page.locator('#indexNavigationCss')).toBeAttached();
        await expect(page.locator('#workstationCss')).toBeAttached();

        const surface = page.locator(item.selector);
        await expect(surface).toBeVisible();
        await expectContainedInViewport(surface, viewport.width);
        await expectNoHorizontalOverflow(page);
      });
    }
  });
}

test('mobile Research hero uses normal-flow overlap rather than structural transform positioning', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/clinical/');

  const geometry = await page.locator('.research-hero__sheet').evaluate(el => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      position: style.position,
      transform: style.transform,
      left: rect.left,
      right: rect.right,
      viewport: window.innerWidth,
    };
  });

  expect(geometry.position).toBe('relative');
  expect(geometry.transform).toBe('none');
  expect(geometry.left).toBeGreaterThanOrEqual(-1);
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
});

test('standard desktop remains below workstation activation threshold', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const geometry = await page.evaluate(() => ({
    header: document.querySelector('#hdr').getBoundingClientRect().height,
    bodyPaddingTop: parseFloat(getComputedStyle(document.body).paddingTop),
  }));

  expect(Math.abs(geometry.header - 68)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.bodyPaddingTop - 68)).toBeLessThanOrEqual(1);
});

test('phone masthead exposes an explicit Index trigger and removes header Contact', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/clinical/');

  await expect(page.locator('.hdr .hdr-contact-btn')).toHaveCount(0);
  const trigger = page.locator('#mobToggle');
  await expect(trigger).toBeVisible();
  await expect(trigger.locator('.mob-index-label')).toContainText(/Index|Índice/);
  await expect(page.locator('#indexNavigationJs')).toBeAttached();
  await expectNoHorizontalOverflow(page);
});

test('phone Index opens as a compact editorial sheet with collapsed research lines', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/clinical/');

  await page.locator('#mobToggle').click();
  await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.global-index__chapter')).toHaveCount(4);

  const disclosure = page.locator('.global-index__lines-toggle');
  await expect(disclosure).toBeVisible();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.global-index__lines')).toHaveClass(/is-lines-collapsed/);
  await expect(page.locator('.global-index__institutions')).toBeHidden();
  await expectNoHorizontalOverflow(page);

  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.global-index__lines')).toHaveClass(/is-lines-expanded/);
});

test('large phone keeps progressive research-line disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 620, height: 900 });
  await page.goto('/');
  await page.locator('#mobToggle').click();

  await expect(page.locator('.global-index__lines-toggle')).toBeVisible();
  await expect(page.locator('.global-index__lines-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expectNoHorizontalOverflow(page);
});

test('small laptop keeps Contact out of masthead while Index remains reachable', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');

  await expect(page.locator('.hdr .hdr-contact-btn')).toHaveCount(0);
  await expect(page.locator('#hdrIndexBtn')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

for (const width of [1440, 2048]) {
  test(`desktop ${width}px places Index with primary navigation and keeps full research matrix`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : 900 });
    await page.goto('/clinical/');

    const indexParent = await page.locator('#hdrIndexBtn').evaluate(el => el.parentElement && el.parentElement.className);
    expect(String(indexParent)).toContain('hdr-nav');
    await expect(page.locator('.hdr .hdr-contact-btn')).toHaveCount(0);

    await page.locator('#hdrIndexBtn').click();
    await expect(page.locator('.global-index__lines-toggle')).toBeHidden();
    await expect(page.locator('.global-index__lines')).toHaveClass(/is-lines-expanded/);
    await expectNoHorizontalOverflow(page);
  });
}


test('phone Index transitions into Search and back without leaving the shared editorial sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('#mobToggle').click();
  await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.global-index__utilities .global-index__utility-link')).toHaveCount(2);

  await page.locator('[data-open-index-search]').click();
  await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexIndexView')).toBeHidden();
  await expect(page.locator('#globalIndexSearchView')).toBeVisible();
  await expect(page.locator('#globalIndexSearchInput')).toBeFocused();

  await page.locator('#globalIndexSearchBack').click();
  await expect(page.locator('#globalIndex')).not.toHaveClass(/is-search/);
  await expect(page.locator('#globalIndexIndexView')).toBeVisible();
  await expect(page.locator('#globalIndexSearchView')).toBeHidden();
  await expectNoHorizontalOverflow(page);
});

test('tablet portrait keeps the full research matrix and does not inherit phone disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/clinical/');

  await page.locator('#mobToggle').click();
  await expect(page.locator('.global-index__lines-toggle')).toBeHidden();
  await expect(page.locator('.global-index__lines')).toHaveClass(/is-lines-expanded/);
  await expect(page.locator('#globalIndexLines')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});


for (const width of [1024, 1366, 1440]) {
  test(`laptop ${width}px keeps integrated Index navigation contained`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const index = page.locator('#hdrIndexBtn');
    await expect(index).toBeVisible();
    const parentClass = await index.evaluate(el => el.parentElement && el.parentElement.className);
    expect(String(parentClass)).toContain('hdr-nav');

    const geometry = await page.locator('.hdr-inner').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width, vw: window.innerWidth };
    });
    expect(geometry.left).toBeGreaterThanOrEqual(-1);
    expect(geometry.right).toBeLessThanOrEqual(geometry.vw + 1);

    await index.click();
    await expect(page.locator('#globalIndex')).toHaveAttribute('aria-hidden', 'false');
    const surface = await page.locator('.global-index__surface').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, width:r.width, vw:window.innerWidth };
    });
    expect(surface.left).toBeGreaterThanOrEqual(-1);
    expect(surface.right).toBeLessThanOrEqual(surface.vw + 1);
    await expectNoHorizontalOverflow(page);
  });
}

for (const width of [1024, 1366, 1440]) {
  test(`Research hero remains proportionally contained on laptop ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/clinical/');

    const sheet = page.locator('.research-hero__sheet');
    const portrait = page.locator('.research-leadership__portrait');
    await expect(sheet).toBeVisible();
    await expect(portrait).toBeVisible();

    const geo = await sheet.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, width:r.width, vw:window.innerWidth };
    });
    expect(geo.left).toBeGreaterThanOrEqual(8);
    expect(geo.right).toBeLessThanOrEqual(geo.vw - 8);

    const portraitGeo = await portrait.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, vw:window.innerWidth };
    });
    expect(portraitGeo.left).toBeGreaterThanOrEqual(geo.left);
    expect(portraitGeo.right).toBeLessThanOrEqual(geo.right);
    await expectNoHorizontalOverflow(page);
  });
}


for (const width of [1680, 2048]) {
  test(`workstation ${width}px keeps Search interaction measure restrained`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : 1050 });
    await page.goto('/');

    await page.locator('#hdrIndexBtn').click();
    await page.locator('#globalIndexSearchOpen').click();

    await expect(page.locator('#globalIndex')).toHaveClass(/is-search/);
    const field = await page.locator('.global-search__field').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { width:r.width, left:r.left, right:r.right, vw:window.innerWidth };
    });
    expect(field.width).toBeLessThanOrEqual(982);
    expect(field.left).toBeGreaterThanOrEqual(0);
    expect(field.right).toBeLessThanOrEqual(field.vw);

    const surface = await page.locator('.global-index__surface').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { width:r.width, left:r.left, right:r.right, vw:window.innerWidth };
    });
    expect(surface.left).toBeGreaterThanOrEqual(0);
    expect(surface.right).toBeLessThanOrEqual(surface.vw);
    expect(surface.width).toBeGreaterThan(field.width);

    await expectNoHorizontalOverflow(page);
  });
}
