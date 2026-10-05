const { test, expect } = require('@playwright/test');

test('diagnostic: public team API composition', async ({ request }) => {
  const response = await request.get(
    'https://neumac-manage-back-end-production.up.railway.app/api/team/website',
    { timeout: 20000 }
  );

  console.log('TEAM_API_STATUS', response.status());
  expect(response.ok()).toBeTruthy();

  const payload = await response.json();
  const data = Array.isArray(payload?.data) ? payload.data : [];
  const coordinators = data.filter(person => person?.coordinates_line);
  const roster = data.filter(person => !person?.coordinates_line);
  const explicitlyPrivate = data.filter(person => person?.is_public === false);

  const byStaffType = {};
  for (const person of data) {
    const key = person?.staff_type || 'unspecified';
    byStaffType[key] = (byStaffType[key] || 0) + 1;
  }

  console.log('TEAM_API_SUMMARY', JSON.stringify({
    total: data.length,
    coordinators: coordinators.length,
    nonCoordinatorRoster: roster.length,
    explicitlyPrivate: explicitlyPrivate.length,
    byStaffType
  }));
});
