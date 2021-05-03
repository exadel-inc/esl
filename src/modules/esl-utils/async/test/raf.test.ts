import {RAFMock} from '../../test/raf.mock';
import {rafDecorator, afterNextRender} from '../raf';

describe('async/raf', () => {
  beforeAll(() => {
    RAFMock.applyMock();
    RAFMock.instance.reset();
  });

  test('afterNextRender', () => {
    const fn = jest.fn();
    afterNextRender(fn);
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalled();
  });

  test('rafDecorator', () => {
    const fn = jest.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toBeCalled();
    rafInc();
    rafInc();
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalled();
  });

  test('rafDecoratorArguments', () => {
    const fn = jest.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toBeCalled();
    rafInc();
    rafInc(1, 2);
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalledWith(1, 2);
  });

  test('rafDecoratorArguments2', () => {
    const fn = jest.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toBeCalled();
    rafInc(1, 2);
    rafInc();
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalledWith();
  });
});
