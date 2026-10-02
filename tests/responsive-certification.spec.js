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


for (const width of [390, 620, 768, 1024, 1366, 1440, 1680, 2048]) {
  test(`Publications folio remains contained and restrained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : (width >= 1680 ? 1050 : 900) });
    await page.goto('/news/');

    const folio = page.locator('.pub-hero__panel');
    const identity = page.locator('.pub-hero__identity');
    const context = page.locator('.pub-hero__context');

    await expect(folio).toBeVisible();
    await expectContainedInViewport(folio, width);
    await expect(identity).toBeVisible();
    await expect(context).toBeVisible();

    const geo = await folio.evaluate(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        width:r.width,
        left:r.left,
        right:r.right,
        position:s.position,
        transform:s.transform,
        radius:s.borderTopLeftRadius,
        vw:window.innerWidth
      };
    });

    expect(geo.width).toBeGreaterThan(0);
    expect(geo.left).toBeGreaterThanOrEqual(-1);
    expect(geo.right).toBeLessThanOrEqual(geo.vw + 1);
    expect(geo.transform).toBe('none');

    if (width <= 820) {
      const cols = await folio.evaluate(el => getComputedStyle(el).gridTemplateColumns);
      expect(cols.split(' ').length).toBeLessThanOrEqual(2);
    }

    if (width >= 1680) {
      expect(geo.width).toBeLessThanOrEqual(1482);
    }

    await expectNoHorizontalOverflow(page);
  });
}

test('Publications mobile folio stays in normal flow without absolute positioning', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/news/');

  const geometry = await page.locator('.pub-hero__panel').evaluate(el => {
    const s=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    return {
      position:s.position,
      transform:s.transform,
      left:r.left,
      right:r.right,
      viewport:window.innerWidth
    };
  });

  expect(geometry.position).toBe('relative');
  expect(geometry.transform).toBe('none');
  expect(geometry.left).toBeGreaterThanOrEqual(-1);
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
});

test('Publications feed remains flat after folio recomposition', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.addInitScript(() => {
    window._newsAllPosts = [{
      id: 'regression-publication-1',
      post_type: 'publication',
      title: 'Regression fixture publication',
      authors_text: 'neumACt',
      journal_name: 'Fixture Journal',
      published_at: '2026-01-15T00:00:00Z',
      doi: '10.0000/neumact.fixture',
      research_line: { id: 'fixture-line', line_number: 1, name: 'Transplantation' }
    }];
  });
  await page.goto('/news/');

  await expect(page.locator('.pub-item').first()).toBeVisible();
  const itemClasses = await page.locator('.pub-item').evaluateAll(items =>
    items.map(el => el.className)
  );
  expect(itemClasses.length).toBeGreaterThan(0);
  for (const className of itemClasses) {
    expect(className).not.toMatch(/card|raised|floating/);
  }
  await expect(page.locator('.pub-feature')).toBeVisible();
  await expect(page.locator('.pub-index')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});


for (const width of [881, 1024, 1366, 1440, 1680, 2048]) {
  test(`Research scientific leadership remains a secondary margin at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : (width >= 1680 ? 1050 : 900) });
    await page.goto('/clinical/');

    const sheet = page.locator('.research-hero__sheet');
    const leadership = page.locator('.research-leadership');
    const portrait = page.locator('.research-leadership__portrait');

    await expect(sheet).toBeVisible();
    await expect(leadership).toBeVisible();
    await expect(portrait).toBeVisible();

    const geometry = await page.evaluate(() => {
      const sheet = document.querySelector('.research-hero__sheet').getBoundingClientRect();
      const leadership = document.querySelector('.research-leadership').getBoundingClientRect();
      const portrait = document.querySelector('.research-leadership__portrait').getBoundingClientRect();
      return {
        sheet:{left:sheet.left,right:sheet.right,width:sheet.width},
        leadership:{left:leadership.left,right:leadership.right,width:leadership.width},
        portrait:{left:portrait.left,right:portrait.right,top:portrait.top,bottom:portrait.bottom},
        viewport:window.innerWidth
      };
    });

    expect(geometry.leadership.width / geometry.sheet.width).toBeLessThan(0.42);
    expect(geometry.leadership.left).toBeGreaterThanOrEqual(geometry.sheet.left);
    expect(geometry.leadership.right).toBeLessThanOrEqual(geometry.sheet.right + 1);
    expect(geometry.portrait.left).toBeGreaterThanOrEqual(geometry.sheet.left);
    expect(geometry.portrait.right).toBeLessThanOrEqual(geometry.sheet.right + 1);
    await expectNoHorizontalOverflow(page);
  });
}

for (const width of [390, 620, 768]) {
  test(`Research leadership remains stacked below programme copy at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1024 });
    await page.goto('/clinical/');

    const geometry = await page.evaluate(() => {
      const copy = document.querySelector('.research-hero__copy').getBoundingClientRect();
      const leadership = document.querySelector('.research-leadership').getBoundingClientRect();
      const sheet = document.querySelector('.research-hero__sheet').getBoundingClientRect();
      return {
        copyBottom:copy.bottom,
        leadershipTop:leadership.top,
        sheetLeft:sheet.left,
        sheetRight:sheet.right,
        leadershipLeft:leadership.left,
        leadershipRight:leadership.right,
        viewport:window.innerWidth
      };
    });

    expect(geometry.leadershipTop).toBeGreaterThanOrEqual(geometry.copyBottom - 1);
    expect(geometry.leadershipLeft).toBeGreaterThanOrEqual(geometry.sheetLeft - 1);
    expect(geometry.leadershipRight).toBeLessThanOrEqual(geometry.sheetRight + 1);
    await expectNoHorizontalOverflow(page);
  });
}

test('Research six-line heading retains the scientific handoff rule on desktop', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/clinical/');

  const rule = await page.locator('.research-lines__head').evaluate(el => {
    const s = getComputedStyle(el, '::before');
    return {
      content:s.content,
      width:parseFloat(s.width),
      height:parseFloat(s.height)
    };
  });

  expect(rule.content).not.toBe('none');
  expect(rule.width).toBeLessThanOrEqual(2);
  expect(rule.height).toBeGreaterThan(10);
});


for (const width of [390, 620, 768, 1024, 1366, 1440, 1680, 2048]) {
  test(`Home editorial threshold remains contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : (width >= 1680 ? 1050 : 900) });
    await page.goto('/');

    const panel = page.locator('.home-programme-panel');
    const intro = page.locator('.home-programme-intro');
    const lines = page.locator('.home-programme-lines');

    await expect(panel).toBeVisible();
    await expect(intro).toBeVisible();
    await expect(lines).toBeVisible();
    await expectContainedInViewport(panel, width);

    const geo = await panel.evaluate(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        left:r.left,
        right:r.right,
        width:r.width,
        position:s.position,
        transform:s.transform,
        cols:s.gridTemplateColumns,
        viewport:window.innerWidth
      };
    });

    expect(geo.position).toBe('relative');
    expect(geo.transform).toBe('none');
    expect(geo.left).toBeGreaterThanOrEqual(-1);
    expect(geo.right).toBeLessThanOrEqual(geo.viewport + 1);

    if (width <= 1100) {
      const relationship = await page.evaluate(() => {
        const intro = document.querySelector('.home-programme-intro').getBoundingClientRect();
        const lines = document.querySelector('.home-programme-lines').getBoundingClientRect();
        return { introBottom:intro.bottom, linesTop:lines.top };
      });
      expect(relationship.linesTop).toBeGreaterThanOrEqual(relationship.introBottom - 1);
    } else {
      const relationship = await page.evaluate(() => {
        const intro = document.querySelector('.home-programme-intro').getBoundingClientRect();
        const lines = document.querySelector('.home-programme-lines').getBoundingClientRect();
        return {
          introLeft:intro.left,
          introRight:intro.right,
          linesLeft:lines.left,
          linesRight:lines.right
        };
      });
      expect(relationship.linesLeft).toBeGreaterThan(relationship.introLeft);
      expect(relationship.linesLeft).toBeGreaterThanOrEqual(relationship.introRight - 40);
    }

    await expectNoHorizontalOverflow(page);
  });
}

test('Home phone research-line index stays single-column and complete', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/');

  const grid = page.locator('.home-programme-lines');
  await expect(grid).toBeVisible();

  const data = await grid.evaluate(el => ({
    cols:getComputedStyle(el).gridTemplateColumns,
    rowCount:el.querySelectorAll('.home-line-row').length
  }));

  expect(data.rowCount).toBeGreaterThanOrEqual(6);
  expect(data.cols.trim().split(/\s+/).length).toBe(1);
  await expectNoHorizontalOverflow(page);
});

test('Home affiliation remains below programme threshold before plaque phase', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/');

  const relationship = await page.evaluate(() => {
    const panel = document.querySelector('.home-programme-panel').getBoundingClientRect();
    const affiliation = document.querySelector('.home-affiliation-card').getBoundingClientRect();
    return { panelBottom:panel.bottom, affiliationTop:affiliation.top };
  });

  expect(relationship.affiliationTop).toBeGreaterThan(relationship.panelBottom - 24);
});


for (const width of [390, 620, 768, 1024, 1366, 1440, 1680, 2048]) {
  test(`INIBIC plaque remains contained and secondary at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : (width >= 1680 ? 1050 : 900) });
    await page.goto('/');

    const plaque = page.locator('.home-affiliation-card');
    const programme = page.locator('.home-programme-panel');
    const lines = page.locator('.home-programme-lines');

    await expect(plaque).toBeVisible();
    await expectContainedInViewport(plaque, width);

    const geo = await page.evaluate(() => {
      const plaque = document.querySelector('.home-affiliation-card').getBoundingClientRect();
      const programme = document.querySelector('.home-programme-panel').getBoundingClientRect();
      const lines = document.querySelector('.home-programme-lines').getBoundingClientRect();
      const style = getComputedStyle(document.querySelector('.home-affiliation-card'));
      return {
        plaque:{left:plaque.left,right:plaque.right,top:plaque.top,bottom:plaque.bottom,width:plaque.width},
        programme:{left:programme.left,right:programme.right,bottom:programme.bottom},
        lines:{left:lines.left,right:lines.right,top:lines.top,bottom:lines.bottom},
        position:style.position,
        bg:style.backgroundColor,
        radius:parseFloat(style.borderTopLeftRadius),
        shadow:style.boxShadow,
        viewport:window.innerWidth
      };
    });

    expect(geo.plaque.left).toBeGreaterThanOrEqual(-1);
    expect(geo.plaque.right).toBeLessThanOrEqual(geo.viewport + 1);
    expect(geo.plaque.top).toBeGreaterThan(geo.lines.top);
    expect(geo.plaque.bottom).toBeGreaterThan(geo.lines.bottom);
    expect(geo.radius).toBeLessThanOrEqual(6);

    await expectNoHorizontalOverflow(page);
  });
}

test('INIBIC plaque preserves the official embedded mark', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/');

  const mark = await page.locator('.home-affiliation-card__head').evaluate(el => {
    const s = getComputedStyle(el, '::before');
    return {
      backgroundImage:s.backgroundImage,
      width:parseFloat(s.width),
      display:s.display
    };
  });

  expect(mark.backgroundImage).toContain('data:image/png;base64');
  expect(mark.width).toBeGreaterThan(90);
});

test('INIBIC plaque flattens into normal flow on phone', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/');

  const relationship = await page.evaluate(() => {
    const dock = document.querySelector('.home-affiliation-dock').getBoundingClientRect();
    const plaque = document.querySelector('.home-affiliation-card').getBoundingClientRect();
    const programme = document.querySelector('.home-programme-panel').getBoundingClientRect();
    return {
      dockLeft:dock.left,
      dockRight:dock.right,
      plaqueLeft:plaque.left,
      plaqueRight:plaque.right,
      plaqueTop:plaque.top,
      programmeBottom:programme.bottom,
      viewport:window.innerWidth
    };
  });

  expect(relationship.plaqueLeft).toBeGreaterThanOrEqual(relationship.dockLeft - 1);
  expect(relationship.plaqueRight).toBeLessThanOrEqual(relationship.dockRight + 1);
  expect(relationship.plaqueTop).toBeGreaterThan(relationship.programmeBottom - 20);
  expect(relationship.plaqueRight).toBeLessThanOrEqual(relationship.viewport + 1);
});

test('INIBIC plaque remains readable without backdrop-filter support', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/');

  const data = await page.locator('.home-affiliation-card').evaluate(el => {
    const s = getComputedStyle(el);
    const p = getComputedStyle(el.querySelector('p:not(.home-affiliation-card__eyebrow):not(.home-affiliation-card__institution)'));
    const link = getComputedStyle(el.querySelector('.home-affiliation-card__link'));
    return {
      background:s.backgroundColor,
      bodyColor:p.color,
      linkColor:link.color
    };
  });

  expect(data.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(data.bodyColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(data.linkColor).not.toBe('rgba(0, 0, 0, 0)');
});


for (const width of [390, 620, 768, 1024, 1366, 1440, 1680, 2048]) {
  test(`Team quiet sheet remains contained and image-led at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? 1152 : (width >= 1680 ? 1050 : 900) });
    await page.goto('/team/');

    const image = page.locator('.team-visual-hero');
    const sheet = page.locator('.team-hero__grid');

    await expect(image).toBeVisible();
    await expect(sheet).toBeVisible();
    await expectContainedInViewport(sheet, width);

    const geometry = await page.evaluate(() => {
      const image = document.querySelector('.team-visual-hero').getBoundingClientRect();
      const sheet = document.querySelector('.team-hero__grid').getBoundingClientRect();
      const style = getComputedStyle(document.querySelector('.team-hero__grid'));
      return {
        image:{top:image.top,bottom:image.bottom,height:image.height},
        sheet:{top:sheet.top,bottom:sheet.bottom,left:sheet.left,right:sheet.right,width:sheet.width},
        transform:style.transform,
        position:style.position,
        viewport:window.innerWidth
      };
    });

    expect(geometry.sheet.top).toBeLessThan(geometry.image.bottom + 24);
    expect(geometry.image.height).toBeGreaterThan(100);
    expect(geometry.transform).toBe('none');
    expect(geometry.sheet.left).toBeGreaterThanOrEqual(-1);
    expect(geometry.sheet.right).toBeLessThanOrEqual(geometry.viewport + 1);

    if (width >= 1680) {
      expect(geometry.sheet.width).toBeLessThanOrEqual(1522);
    }

    await expectNoHorizontalOverflow(page);
  });
}

for (const width of [390, 620, 768]) {
  test(`Team intro remains stacked at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1024 });
    await page.goto('/team/');

    const relationship = await page.evaluate(() => {
      const copy = document.querySelector('.team-hero__copy').getBoundingClientRect();
      const context = document.querySelector('.team-hero__context').getBoundingClientRect();
      return {
        copyBottom:copy.bottom,
        contextTop:context.top,
        copyLeft:copy.left,
        contextLeft:context.left
      };
    });

    expect(relationship.contextTop).toBeGreaterThanOrEqual(relationship.copyBottom - 1);
    expect(Math.abs(relationship.contextLeft - relationship.copyLeft)).toBeLessThanOrEqual(2);
    await expectNoHorizontalOverflow(page);
  });
}

test('Team roster and public profile architecture remain intact after intro recomposition', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/team/');

  await expect(page.locator('#teamRoster')).toBeAttached();
  await expect(page.locator('#teamLeadership')).toBeAttached();
  await expect(page.locator('#teamCoordinators')).toBeAttached();
  await expect(page.locator('#teamProfileOverlay')).toBeAttached();
  await expect(page.locator('#teamProfileSheet')).toBeAttached();
  await expectNoHorizontalOverflow(page);
});


for (const width of [390, 620, 768, 1024]) {
  test(`Innovation clinical process remains ordered and contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await page.goto('/innovation/');

    const prompts = page.locator('.innovation-question');
    await expect(prompts).toHaveCount(4);

    const labels = await prompts.locator('h3').evaluateAll(nodes =>
      nodes.map(node => (node.textContent || '').trim())
    );

    expect(labels[0]).toMatch(/Measure|Medir/);
    expect(labels[1]).toMatch(/Decide|Decidir/);
    expect(labels[2]).toMatch(/Work|Trabajar/);
    expect(labels[3]).toMatch(/Connect|Conectar/);

    await expectNoHorizontalOverflow(page);
  });
}

test('Innovation phone uses a vertical process spine', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/innovation/');

  const spine = await page.locator('.innovation-question-list').evaluate(el => {
    const s = getComputedStyle(el, '::before');
    return {
      content:s.content,
      width:parseFloat(s.width),
      height:parseFloat(s.height),
      left:parseFloat(s.left)
    };
  });

  expect(spine.content).not.toBe('none');
  expect(spine.width).toBeLessThanOrEqual(2);
  expect(spine.height).toBeGreaterThan(80);
});

test('Innovation desktop keeps the process flat and horizontally connected', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/innovation/');

  const prompt = page.locator('.innovation-question').first();
  const line = await prompt.evaluate(el => {
    const s = getComputedStyle(el, '::before');
    return {
      content:s.content,
      width:parseFloat(s.width),
      height:parseFloat(s.height)
    };
  });

  expect(line.content).not.toBe('none');
  expect(line.height).toBeLessThanOrEqual(2);
  expect(line.width).toBeGreaterThan(40);

  const projectClasses = await page.locator('.innovation-project-row').evaluateAll(items =>
    items.map(el => el.className)
  );

  for (const className of projectClasses) {
    expect(className).not.toMatch(/card|raised|floating/);
  }

  await expectNoHorizontalOverflow(page);
});


for (const viewport of [
  { width:1440, height:900, label:'laptop' },
  { width:2048, height:1152, label:'workstation' }
]) {
  test(`Phase 3 editorial identities coexist without overflow on ${viewport.label}`, async ({ page }) => {
    const checks = [
      ['/', '.home-programme-panel'],
      ['/clinical/', '.research-hero__sheet'],
      ['/news/', '.pub-hero__panel'],
      ['/team/', '.team-hero__grid'],
      ['/innovation/', '.innovation-question-list']
    ];

    await page.setViewportSize({ width:viewport.width, height:viewport.height });

    for (const [path, selector] of checks) {
      await page.goto(path);
      await expect(page.locator(selector)).toBeVisible();
      await expectContainedInViewport(page.locator(selector), viewport.width);
      await expectNoHorizontalOverflow(page);
    }
  });
}
