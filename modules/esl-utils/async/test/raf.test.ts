import {RAFMock} from '../../test/raf.mock';
import {rafDecorator, afterNextRender} from '../raf';

describe('async/raf helper tests', () => {

  beforeAll(() => RAFMock.applyMock());

  test('afterNextRender', () => {
    RAFMock.instance.reset();
    const fn = jest.fn();

    afterNextRender(fn);
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalled();
  });

  test('rafDecorator', () => {
    RAFMock.instance.reset();
    const fn = jest.fn();
    const rafInc = rafDecorator(fn);

    expect(fn).not.toBeCalled();
    rafInc();
    rafInc();
    rafInc();
    rafInc();
    expect(fn).not.toBeCalled();
    RAFMock.instance.triggerNextAnimationFrame();
    expect(fn).toBeCalled();
  });
});
