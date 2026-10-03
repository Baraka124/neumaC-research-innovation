const { test, expect } = require('@playwright/test');

async function emptyApi(page){
  await page.route('**/api/**',route=>route.fulfill({json:{data:[]}}));
}
async function submitForm(page,selector){
  await page.locator(selector).evaluate(form=>{
    form.noValidate=true;
    form.requestSubmit();
  });
}

test('Home enquiry states remain bilingual and recover cleanly from failure to success',async({page})=>{
  await emptyApi(page);
  let contactAttempts=0;
  await page.route('**/api/contact',async route=>{
    contactAttempts+=1;
    if(contactAttempts===1) return route.fulfill({status:500,json:{error:'fixture failure'}});
    return route.fulfill({status:200,json:{ok:true}});
  });

  await page.goto('/');
  const form=page.locator('#contactForm');
  await expect(form).toBeAttached();

  await submitForm(page,'#contactForm');
  const validation=page.locator('#contactForm .form-error-msg');
  await expect(validation).toBeVisible();
  await expect(validation.locator('[lang="en"]')).toContainText('Please add your name and email');
  await expect(validation.locator('[lang="es"]')).toContainText('Añada su nombre y correo electrónico');

  await form.locator('[name="contact_name"]').fill('Ada Example');
  await form.locator('[name="email"]').fill('ada@example.org');
  await form.locator('[name="message"]').fill('Respiratory research enquiry');

  await submitForm(page,'#contactForm');
  const status=page.locator('#formSuccess');
  await expect(status).toHaveClass(/is-error/);
  await expect(status).toHaveClass(/show/);
  await expect(status.locator('[lang="en"]')).toContainText('could not be sent');
  await expect(status.locator('[lang="es"]')).toContainText('No se ha podido enviar');
  await expect(status).not.toContainText('email us directly');

  await submitForm(page,'#contactForm');
  await expect(status).toHaveClass(/show/);
  await expect(status).not.toHaveClass(/is-error/);
  await expect(status.locator('[lang="en"]')).toContainText("Message received");
  await expect(status.locator('[lang="es"]')).toContainText('Mensaje recibido');
  await expect(status).not.toContainText('could not be sent');
});

test('Home loading state carries both language variants and restores the authored button label',async({page})=>{
  await emptyApi(page);
  await page.route('**/api/contact',async route=>{
    await new Promise(resolve=>setTimeout(resolve,350));
    await route.fulfill({status:200,json:{ok:true}});
  });

  await page.goto('/');
  const form=page.locator('#contactForm');
  await form.locator('[name="contact_name"]').fill('Ada Example');
  await form.locator('[name="email"]').fill('ada@example.org');
  const button=form.locator('button[type="submit"]');

  await submitForm(page,'#contactForm');
  await expect(button).toHaveAttribute('aria-busy','true');
  await expect(button.locator('[lang="en"]')).toHaveText('Sending…');
  await expect(button.locator('[lang="es"]')).toHaveText('Enviando…');

  await expect(page.locator('#formSuccess')).toHaveClass(/show/);
  await expect(button).not.toHaveAttribute('aria-busy','true');
  await expect(button.locator('[lang="en"]')).toHaveText('Send enquiry');
  await expect(button.locator('[lang="es"]')).toHaveText('Enviar consulta');
});

test('Spanish enquiry error state is authored in the DOM and selected by the existing language system',async({page})=>{
  await emptyApi(page);
  await page.route('**/api/contact',route=>route.fulfill({status:500,json:{error:'fixture'}}));

  await page.goto('/');
  await page.evaluate(()=>{document.documentElement.dataset.lang='es';});
  const form=page.locator('#contactForm');
  await form.locator('[name="contact_name"]').fill('Ada Example');
  await form.locator('[name="email"]').fill('ada@example.org');
  await submitForm(page,'#contactForm');

  const status=page.locator('#formSuccess');
  await expect(status).toHaveClass(/is-error/);
  await expect(status.locator('[lang="es"]')).toContainText('Inténtelo de nuevo más tarde');
  await expect(status.locator('[lang="es"]')).toBeVisible();
  await expect(status.locator('[lang="en"]')).toBeHidden();
});

for(const target of [
  {url:'/clinical/',form:'#researchForm',name:'Research'},
  {url:'/innovation/',form:'#innovForm',name:'Innovation'}
]){
  test(`${target.name} enquiry uses the same recoverable bilingual state contract`,async({page})=>{
    await emptyApi(page);
    await page.route('**/api/contact',route=>route.fulfill({status:500,json:{error:'fixture'}}));
    await page.goto(target.url);

    const form=page.locator(target.form);
    await expect(form).toBeAttached();
    await form.locator('[name="contact_name"]').fill('Ada Example');
    await form.locator('[name="email"]').fill('ada@example.org');
    const message=form.locator('[name="message"]');
    if(await message.count()) await message.fill('Clinical collaboration enquiry');

    await submitForm(page,target.form);
    const status=page.locator('#formSuccess');
    await expect(status).toHaveClass(/is-error/);
    await expect(status.locator('[lang="en"]')).toContainText('could not be sent');
    await expect(status.locator('[lang="es"]')).toContainText('No se ha podido enviar');
  });
}

test('contact payload preserves the governed public API contract',async({page})=>{
  await emptyApi(page);
  let received=null;
  await page.route('**/api/contact',async route=>{
    received=JSON.parse(route.request().postData()||'{}');
    await route.fulfill({status:200,json:{ok:true}});
  });

  await page.goto('/innovation/');
  const form=page.locator('#innovForm');
  await form.locator('[name="contact_name"]').fill('Ada Example');
  await form.locator('[name="organisation"]').fill('Example Institute');
  await form.locator('[name="email"]').fill('ada@example.org');
  await form.locator('[name="area_of_interest"]').selectOption('Research collaboration');
  await form.locator('[name="message"]').fill('Joint respiratory research proposal');
  await submitForm(page,'#innovForm');

  await expect(page.locator('#formSuccess')).toHaveClass(/show/);
  expect(received).toEqual({
    name:'Ada Example',
    organisation:'Example Institute',
    email:'ada@example.org',
    area_of_interest:'Research collaboration',
    message:'Joint respiratory research proposal'
  });
});
