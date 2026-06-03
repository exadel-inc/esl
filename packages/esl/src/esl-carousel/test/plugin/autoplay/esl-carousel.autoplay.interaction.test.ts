import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

import type {MockInstance} from 'vitest';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

const microtask = () => Promise.resolve();

describe('ESLCarousel: Autoplay Plugin (interaction)', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselDummyRenderer.register();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    vi.useFakeTimers();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
    vi.useRealTimers();
  });

  const $popupTrigger = document.createElement('esl-note');
  const $externalBlocker = document.createElement('div');
  const $carousel = ESLCarousel.create();
  vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);

  const interactionState = {hover: false, focus: false};
  const realMatches = Element.prototype.matches;
  let matchesSpy: MockInstance | null = null;
  let activeElementDescriptor: PropertyDescriptor | undefined;

  const applySpies = () => {
    if (!matchesSpy) {
      matchesSpy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element | null, selector: string) {
        if (selector.includes(':hover')) return interactionState.hover && this === $carousel;
        if (selector.includes(':focus-within')) return interactionState.focus && this === $carousel;
        if (selector.includes(':focus-visible')) return interactionState.focus && this === document.activeElement;
        return realMatches.call(this, selector);
      });
    }
    if (!activeElementDescriptor) {
      activeElementDescriptor = Object.getOwnPropertyDescriptor(document, 'activeElement');
    }
  };

  const simulateHover = (value: boolean) => {
    interactionState.hover = value;
    $carousel.dispatchEvent(new MouseEvent(value ? 'mouseenter' : 'mouseleave', {bubbles: true}));
  };

  const simulateFocus = (value: boolean) => {
    interactionState.focus = value;
    if (value) {
      ($carousel as HTMLElement).focus?.();
      Object.defineProperty(document, 'activeElement', {configurable: true, get: () => $carousel});
      $carousel.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
    } else {
      $carousel.dispatchEvent(new FocusEvent('focusout', {bubbles: true}));
      if (activeElementDescriptor) Object.defineProperty(document, 'activeElement', activeElementDescriptor);
    }
  };

  const simulatePopupOpen = (value: boolean) => {
    value ? $popupTrigger.setAttribute('active', '') : $popupTrigger.removeAttribute('active');
    value && $popupTrigger.dispatchEvent(new Event('esl:change:active', {bubbles: true}));
  };

  const simulateExternalBlocker = (value: boolean) => {
    value ? $externalBlocker.setAttribute('active', '') : $externalBlocker.removeAttribute('active');
    $externalBlocker.dispatchEvent(new Event('esl:change:active', {bubbles: true}));
  };

  beforeEach(async () => {
    $externalBlocker.className = 'global-blocker';
    document.body.appendChild($externalBlocker);
    document.body.appendChild($carousel);
    $carousel.setAttribute('esl-carousel-autoplay', '');

    $carousel.appendChild($popupTrigger);
    $popupTrigger.removeAttribute('active');
    $externalBlocker.removeAttribute('active');

    applySpies();
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
  });

  afterEach(() => {
    document.body.removeChild($carousel);
    document.body.removeChild($externalBlocker);
    interactionState.hover = false;
    interactionState.focus = false;
    matchesSpy?.mockRestore();
    matchesSpy = null;
    if (activeElementDescriptor) Object.defineProperty(document, 'activeElement', activeElementDescriptor);
    vi.clearAllTimers();
  });

  test('Pauses on hover', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
  });

  test('Resumes after unhover', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
    simulateHover(false);
    await microtask();
    expect(plugin.active).toBe(true);
  });

  test('Pauses on focus', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateFocus(true);
    await microtask();
    expect(plugin.active).toBe(false);
  });

  test('Resumes after focus leaves', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateFocus(true);
    await microtask();
    expect(plugin.active).toBe(false);
    simulateFocus(false);
    await microtask();
    expect(plugin.active).toBe(true);
  });

  test('Blocks runtime execution on popup open', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.canRun).toBe(true);
    simulatePopupOpen(true);
    await microtask();
    expect(plugin.canRun).toBe(false);
  });

  test('Unblocks runtime execution after popup closes', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.canRun).toBe(true);
    simulatePopupOpen(true);
    await microtask();
    expect(plugin.canRun).toBe(false);
    simulatePopupOpen(false);
    await microtask();
    expect(plugin.canRun).toBe(true);
  });

  test('Blocks active timer on external blocker event from document scope', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockerSelector: ".global-blocker[active]"}');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

    expect(plugin.active).toBe(true);
    simulateExternalBlocker(true);
    await microtask();

    expect(plugin.canRun).toBe(false);
    expect(plugin.active).toBe(false);
  });

  test('Restarts autoplay after external blocker clears', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockerSelector: ".global-blocker[active]"}');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

    simulateExternalBlocker(true);
    await microtask();
    expect(plugin.active).toBe(false);

    simulateExternalBlocker(false);
    await microtask();
    expect(plugin.canRun).toBe(true);
    expect(plugin.active).toBe(true);
  });

  test('Skips blocker selector lookup on global events while carousel is out of viewport', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockerSelector: ".global-blocker[active]"}');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
    const lookupSpy = vi.spyOn(plugin, '$$find');

    simulateExternalBlocker(true);
    await microtask();

    expect(plugin.active).toBe(false);
    expect(plugin.canRun).toBe(false);
    expect(lookupSpy).not.toHaveBeenCalled();
  });

  test('stop()/start() works after focus out', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateFocus(true);
    await microtask();
    expect(plugin.active).toBe(false);
    plugin.stop();
    expect(plugin.enabled).toBe(false);
    simulateFocus(false);
    await microtask();
    plugin.start();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
  });

  test('stop()/start() works after hover leave', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
    plugin.stop();
    expect(plugin.enabled).toBe(false);
    simulateHover(false); // clear hover before enabling
    await microtask();
    plugin.start();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
  });

  test('start() while still hovered stays inactive until hover leaves', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
    plugin.stop();
    simulateHover(false); // leave then immediately hover again before enabling
    simulateHover(true);
    await microtask();
    plugin.start(); // re-enable while hovered
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(false); // still paused due to hover
    simulateHover(false); // finally leave
    await microtask();
    expect(plugin.active).toBe(true);
  });

  test('blockBehaviour=pause preserves remaining time on hover', async () => {
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockBehaviour: "pause"}');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;

    vi.advanceTimersByTime(350);
    const beforePause = plugin.remaining;
    simulateHover(true);
    await microtask();

    expect(plugin.paused).toBe(false);
    expect(plugin.blocked).toBe(true);
    expect(plugin.state).toBe('blocked');
    expect(plugin.active).toBe(false);
    expect(plugin.remaining).toBeLessThanOrEqual(beforePause);
    expect(plugin.remaining).toBeGreaterThan(0);
  });

  test('blockBehaviour=stop clears remaining time on hover block', async () => {
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockBehaviour: "stop"}');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;

    vi.advanceTimersByTime(350);
    expect(plugin.remaining).toBeGreaterThan(0);
    simulateHover(true);
    await microtask();

    expect(plugin.paused).toBe(false);
    expect(plugin.blocked).toBe(true);
    expect(plugin.state).toBe('blocked');
    expect(plugin.active).toBe(false);
    expect(plugin.remaining).toBe(0);
  });
});
