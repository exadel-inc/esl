import {ESLAnimate, ESLAnimateService} from '../core';

vi.mock('../core/esl-animate-service', () => ({
  ESLAnimateService: {
    observe: vi.fn(),
    unobserve: vi.fn()
  }
}));

describe('ESLAnimate element', () => {
  const $el = ESLAnimate.create();
  document.body.appendChild($el);

  beforeAll(() => {
    vi.useFakeTimers();
    ESLAnimate.register();
  });

  afterAll(() => vi.useRealTimers());

  afterEach(() => vi.resetAllMocks());

  test('ESLAnimate instance', () => expect($el).toBeInstanceOf(ESLAnimate));

  test('connected callback', () => {
    expect($el.connected).toBe(false);
    $el.repeat = true;
    expect(ESLAnimateService.observe).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(ESLAnimateService.observe).toHaveBeenCalledWith([$el], {cls: 'in', force: true, group: false, groupDelay: 100, ratio: 0.4, repeat: true});
  });

  test('attribute change callback', () => {
    $el.repeat = true;
    expect(ESLAnimateService.unobserve).toHaveBeenCalled();
    expect(ESLAnimateService.observe).toHaveBeenCalled();
  });

  test('reanimate call', () => {
    $el.reanimate();
    expect(ESLAnimateService.observe).toHaveBeenCalled();
  });

  test('disconnected callback', () => {
    $el.remove();
    vi.advanceTimersByTime(1);
    expect(ESLAnimateService.unobserve).toHaveBeenCalled();
  });
});
