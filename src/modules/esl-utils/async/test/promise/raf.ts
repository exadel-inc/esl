import {RAFMock} from '../../../test/raf.mock';
import {promisifyNextRender} from '../../promise/raf';

describe('async/promise/raf', () => {
  beforeAll(() => {
    RAFMock.applyMock();
    RAFMock.instance.reset();
  });

  test('promisifyNextRender fullfiled as soon as next render tick (via requestAnimationFrame) occurs', async () => {
    let resolved: boolean | undefined;
    promisifyNextRender().then(() => resolved = true, () => resolved = false);
    await Promise.resolve();
    expect(resolved).toBe(undefined);
    RAFMock.instance.triggerNextAnimationFrame();
    await Promise.resolve();
    expect(resolved).toBe(undefined);
    RAFMock.instance.triggerNextAnimationFrame();
    await Promise.resolve();
    expect(resolved).toBe(true);
  });
});
