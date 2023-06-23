import {ESLAnimate, ESLAnimateService} from '../core';

jest.mock('../core/esl-animate-service', () => ({
  ESLAnimateService: {
    observe: jest.fn(),
    unobserve: jest.fn()
  }
}));

describe('ESLAnimate element', () => {
  const $el = ESLAnimate.create();
  document.body.appendChild($el);

  beforeAll(() => {
    jest.useFakeTimers();
    ESLAnimate.register();
  });

  afterAll(() => jest.useRealTimers());

  afterEach(() => jest.resetAllMocks());

  test('ESLAnimate instance', () => expect($el).toBeInstanceOf(ESLAnimate));

  test('connected callback', () => {
    expect($el.connected).toBe(false);
    $el.repeat = true;
    expect(ESLAnimateService.observe).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(ESLAnimateService.observe).toBeCalledWith([$el], {cls: 'in', force: true, group: false, groupDelay: 100, ratio: 0.4, repeat: true});
  });

  test('attribute change callback', () => {
    $el.repeat = true;
    expect(ESLAnimateService.unobserve).toBeCalled();
    expect(ESLAnimateService.observe).toBeCalled();
  });

  test('reanimate call', () => {
    $el.reanimate();
    expect(ESLAnimateService.observe).toBeCalled();
  });

  test('disconnected callback', () => {
    $el.remove();
    jest.advanceTimersByTime(1);
    expect(ESLAnimateService.unobserve).toBeCalled();
  });
});
