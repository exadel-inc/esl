import {RAFMock} from '../../test/raf.mock';
import {rafDecorator, afterNextRender} from '../raf';

describe('async/raf helper tests', () => {

  beforeAll(() => RAFMock.applyMock());

  test('afterNextRender', () => {
    RAFMock.instance.reset();
    let counter = 0;
    const increment = () => counter++;

    afterNextRender(increment);
    expect(counter).toBe(0);
    RAFMock.instance.triggerNextAnimationFrame();
    expect(counter).toBe(0);
    RAFMock.instance.triggerNextAnimationFrame();
    expect(counter).toBe(1);
  });

  test('rafDecorator', () => {
    RAFMock.instance.reset();
    let counter = 0;
    const increment = () => counter++;
    const rafInc = rafDecorator(increment);

    expect(counter).toBe(0);
    rafInc();
    rafInc();
    rafInc();
    rafInc();
    expect(counter).toBe(0);
    RAFMock.instance.triggerNextAnimationFrame();
    expect(counter).toBe(1);
  });
});
