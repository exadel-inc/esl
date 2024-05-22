import {goTo} from '../setup/scenarios.page';

describe('Homepage footer manual validation', () => {
  beforeAll(() => goTo('/'));

  test('Check if the footer copyright contains correct version', async () => {
    const root = await import ('../../package.json');
    const version = root.version;
    const $copyright = await page.$('footer .footer-copyright');

    const content = await $copyright?.evaluate((el) => el.textContent);
    expect(content).toContain(version);
  });

  test('Check if the footer coypright contains correct year', async () => {
    const currentYear = new Date().getFullYear();
    const $copyright = await page.$('footer .footer-copyright');

    const content = await $copyright?.evaluate((el) => el.textContent);
    expect(content).toContain(`© ${currentYear}`);
  });

  // TODO: Check privacy policy link
});
