import {ESLAnimateMixin, ESLAnimateService} from '../core';

vi.mock('../core/esl-animate-service', () => ({
  ESLAnimateService: {
    observe: vi.fn(),
    unobserve: vi.fn()
  }
}));

vi.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLAnimateMixin mixin', () => {
  const $el = document.createElement('div');
  $el.toggleAttribute(ESLAnimateMixin.is, true);
  document.body.appendChild($el);

  ESLAnimateMixin.register();
  const mixin: ESLAnimateMixin = ESLAnimateMixin.get($el)!;

  afterEach(() => vi.resetAllMocks());

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
