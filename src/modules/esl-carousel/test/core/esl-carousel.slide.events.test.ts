import {createDummyCarousel} from '../common/esl-carousel.dummy';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

jest.mock('../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarouselRenderer: Slide change events created correctly', () => {
  const beforeEventTrap = jest.fn();
  const afterEventTrap = jest.fn();
  document.addEventListener(ESLCarouselSlideEvent.BEFORE, beforeEventTrap);
  document.addEventListener(ESLCarouselSlideEvent.AFTER, afterEventTrap);

  const {$carousel} = createDummyCarousel(5);

  describe('3 slides visible, no loop', () => {
    beforeEach(() => {
      beforeEventTrap.mockReset();
      afterEventTrap.mockReset();
    });

    beforeAll(async () => {
      $carousel.count = '3';
      $carousel.loop = 'false';
      await Promise.resolve();
    });

    test('ESLCarouselSlideEvent: Initial slide triggered correct events', async () => {
      const request = $carousel.renderer.navigate(0, 'next', {activator: 'user'});
      expect(beforeEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenCalledTimes(0);
      expect(beforeEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.BEFORE,
        indexesAfter: [0, 1, 2],
        direction: 'next',
        activator: 'user'
      }));

      await request;
      expect(afterEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.AFTER,
        indexesAfter: [0, 1, 2],
        direction: 'next',
        activator: 'user'
      }));
    });

    test('ESLCarouselSlideEvent: correct events triggered in the middle state', async () => {
      const request = $carousel.renderer.navigate(1, 'next', {activator: 'user'});
      expect(beforeEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenCalledTimes(0);
      expect(beforeEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.BEFORE,
        indexesBefore: [0, 1, 2],
        indexesAfter: [1, 2, 3],
        direction: 'next',
        activator: 'user'
      }));

      await request;
      expect(afterEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.AFTER,
        indexesBefore: [0, 1, 2],
        indexesAfter: [1, 2, 3],
        direction: 'next',
        activator: 'user'
      }));
    });

    test('ESLCarouselSlideEvent: Last slide triggered correct events', async () => {
      const request = $carousel.renderer.navigate(2, 'next', {activator: 'user'});
      expect(beforeEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenCalledTimes(0);
      expect(beforeEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.BEFORE,
        indexesBefore: [1, 2, 3],
        indexesAfter: [2, 3, 4],
        direction: 'next',
        activator: 'user'
      }));

      await request;
      expect(afterEventTrap).toHaveBeenCalledTimes(1);
      expect(afterEventTrap).toHaveBeenLastCalledWith(expect.objectContaining({
        type: ESLCarouselSlideEvent.AFTER,
        indexesBefore: [1, 2, 3],
        indexesAfter: [2, 3, 4],
        direction: 'next',
        activator: 'user'
      }));
    });
  });
});