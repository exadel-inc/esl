import {RAFMock} from '../../../test/raf.mock';
import {rafDecorator, afterNextRender} from '../raf';

describe('async/raf', () => {
  beforeAll(() => {
    RAFMock.applyMock();
    RAFMock.instance.reset();
  });

  test('afterNextRender', () => {
    const fn = vi.fn();
    afterNextRender(fn);
    expect(fn).not.toHaveBeenCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).not.toHaveBeenCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toHaveBeenCalled();
  });

  test('rafDecorator', () => {
    const fn = vi.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toHaveBeenCalled();
    rafInc();
    rafInc();
    expect(fn).not.toHaveBeenCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toHaveBeenCalled();
  });

  test('rafDecoratorArguments', () => {
    const fn = vi.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toHaveBeenCalled();
    rafInc();
    rafInc(1, 2);
    expect(fn).not.toHaveBeenCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  test('rafDecoratorArguments2', () => {
    const fn = vi.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toHaveBeenCalled();
    rafInc(1, 2);
    rafInc();
    expect(fn).not.toHaveBeenCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toHaveBeenCalledWith();
  });
});
