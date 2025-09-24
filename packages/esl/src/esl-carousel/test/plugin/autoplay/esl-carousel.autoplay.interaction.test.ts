import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {IntersectionObserverMock} from '../../../../esl-utils/test/intersectionObserver.mock';

jest.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

const microtask = () => Promise.resolve();

describe('ESLCarousel: Autoplay Plugin (interaction)', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselDummyRenderer.register();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    jest.useFakeTimers();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
    jest.useRealTimers();
  });

  const $popupTrigger = document.createElement('esl-note');
  const $carousel = ESLCarousel.create();
  jest.spyOn($carousel, 'canNavigate').mockReturnValue(true);

  const interactionState = {hover: false, focus: false};
  const realMatches = Element.prototype.matches;
  let matchesSpy: jest.SpyInstance | null = null;
  let activeElementDescriptor: PropertyDescriptor | undefined;

  const applySpies = () => {
    if (!matchesSpy) {
      matchesSpy = jest.spyOn(Element.prototype, 'matches').mockImplementation(function (selector: string) {
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

  beforeEach(async () => {
    document.body.appendChild($carousel);
    $carousel.setAttribute('esl-carousel-autoplay', '');

    $carousel.appendChild($popupTrigger);
    $popupTrigger.removeAttribute('active');

    applySpies();
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
  });

  afterEach(() => {
    document.body.removeChild($carousel);
    interactionState.hover = false;
    interactionState.focus = false;
    matchesSpy?.mockRestore();
    matchesSpy = null;
    if (activeElementDescriptor) Object.defineProperty(document, 'activeElement', activeElementDescriptor);
    jest.clearAllTimers();
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

  test('Pauses on popup open', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.allowed).toBe(true);
    simulatePopupOpen(true);
    await microtask();
    expect(plugin.allowed).toBe(false);
  });

  test('Resumes after popup closes', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.allowed).toBe(true);
    simulatePopupOpen(true);
    await microtask();
    expect(plugin.allowed).toBe(false);
    simulatePopupOpen(false);
    await microtask();
    expect(plugin.allowed).toBe(true);
  });

  test('Re-enables and starts after focus out following manual disable', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    // Focus to pause
    simulateFocus(true);
    await microtask();
    expect(plugin.active).toBe(false);
    // Manually disable while paused
    plugin.enabled = false;
    expect(plugin.enabled).toBe(false);
    // Clear focus state first
    simulateFocus(false);
    await microtask();
    // Re-enable after focus already out
    plugin.enabled = true;
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
  });

  test('Re-enables and starts after hover leave following manual disable', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
    plugin.enabled = false;
    expect(plugin.enabled).toBe(false);
    simulateHover(false); // clear hover before enabling
    await microtask();
    plugin.enabled = true;
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
  });

  test('Re-enable while still hovered stays inactive until hover leaves', async () => {
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    expect(plugin.active).toBe(true);
    simulateHover(true);
    await microtask();
    expect(plugin.active).toBe(false);
    plugin.enabled = false;
    simulateHover(false); // leave then immediately hover again before enabling
    simulateHover(true);
    await microtask();
    plugin.enabled = true; // re-enable while hovered
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(false); // still paused due to hover
    simulateHover(false); // finally leave
    await microtask();
    expect(plugin.active).toBe(true);
  });
});
