import {ESLAnimateMixin, ESLAnimateService} from '../core';

jest.mock('../core/esl-animate-service', () => ({
  ESLAnimateService: {
    observe: jest.fn(),
    unobserve: jest.fn()
  }
}));

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLAnimateMixin mixin', () => {
  const $el = document.createElement('div');
  $el.toggleAttribute(ESLAnimateMixin.is, true);
  document.body.appendChild($el);

  ESLAnimateMixin.register();
  const mixin: ESLAnimateMixin = ESLAnimateMixin.get($el)!;

  afterEach(() => jest.resetAllMocks());

  test('ESLAnimateMixin instance', () => {
    expect(mixin).toBeInstanceOf(ESLAnimateMixin);
    expect(ESLAnimateService.observe).toHaveBeenCalledWith($el, {force: true});
  });

  test('manual reanimate call', () => {
    mixin.options = {repeat: true};
    mixin.reanimate();
    expect(ESLAnimateService.observe).toHaveBeenCalledWith($el, {force: true, repeat: true});
  });

  test('disconnected callback', async () => {
    $el.toggleAttribute(ESLAnimateMixin.is);
    await Promise.resolve();
    expect(ESLAnimateService.unobserve).toHaveBeenCalled();
  });
});
