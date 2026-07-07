import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../common/esl-carousel.dummy.renderer';

vi.mock('../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarousel: focus policy', () => {
  const ticks = () => Promise.resolve().then(() => Promise.resolve()).then(() => Promise.resolve());

  const createCarousel = async (attrs: Record<string, string> = {}): Promise<{$carousel: ESLCarousel, $slides: HTMLElement[]}> => {
    const $carousel = ESLCarousel.create();
    Object.entries(attrs).forEach(([name, value]) => $carousel.setAttribute(name, value));

    document.body.appendChild($carousel);
    await ESLCarousel.registered;

    const $slides = Array.from({length: 3}, () => document.createElement('div'));
    $slides.forEach(($slide) => $carousel.addSlide($slide));
    await ticks();
    await $carousel.goTo(0);
    await ticks();

    return {$carousel, $slides};
  };

  beforeAll(() => {
    ESLCarousel.register();
    ESLCarouselDummyRenderer.register();
  });

  afterEach(() => document.body.innerHTML = '');

  test('active policy marks inactive slides as inert by default', async () => {
    const {$slides} = await createCarousel();

    expect($slides[0].hasAttribute('inert')).toBe(false);
    expect($slides[1].hasAttribute('inert')).toBe(true);
    expect($slides[2].hasAttribute('inert')).toBe(true);
  });

  test('legacy no-inert marker disables inert for inactive slides', async () => {
    const {$carousel, $slides} = await createCarousel({'no-inert': ''});

    expect($carousel.focusPolicyCurrent).toBe('none');
    expect($slides[0].hasAttribute('inert')).toBe(false);
    expect($slides[1].hasAttribute('inert')).toBe(false);
    expect($slides[2].hasAttribute('inert')).toBe(false);
  });

  test('explicit focus policy has priority over legacy no-inert marker', async () => {
    const {$carousel, $slides} = await createCarousel({'focus-policy': 'active', 'no-inert': ''});

    expect($carousel.focusPolicyCurrent).toBe('active');
    expect($slides[1].hasAttribute('inert')).toBe(true);
  });

  test('none policy disables inert for inactive slides', async () => {
    const {$carousel, $slides} = await createCarousel({'focus-policy': 'none'});

    expect($carousel.focusPolicyCurrent).toBe('none');
    expect($slides[0].hasAttribute('inert')).toBe(false);
    expect($slides[1].hasAttribute('inert')).toBe(false);
    expect($slides[2].hasAttribute('inert')).toBe(false);
  });

  test('focus policy change refreshes slide inert state', async () => {
    const {$carousel, $slides} = await createCarousel();
    expect($slides[1].hasAttribute('inert')).toBe(true);

    $carousel.setAttribute('focus-policy', 'none');
    await ticks();
    expect($slides[1].hasAttribute('inert')).toBe(false);

    $carousel.setAttribute('focus-policy', 'active');
    await ticks();
    expect($slides[1].hasAttribute('inert')).toBe(true);
  });

  test('reveal policy activates an inactive slide on focusin', async () => {
    const {$carousel, $slides} = await createCarousel({'focus-policy': 'reveal'});
    const $button = document.createElement('button');
    $slides[1].appendChild($button);

    $button.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
    await ticks();

    expect($carousel.activeIndex).toBe(1);
    expect($slides[1].hasAttribute('active')).toBe(true);
  });
});

