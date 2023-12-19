describe('jest-image-snapshot usage with an image received from puppeteer', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3005/');
  });

  it('test homepage', async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
