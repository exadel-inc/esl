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

describe('ESLAnimateMixin', () => {
  const $el = document.createElement('div');
  $el.toggleAttribute(ESLAnimateMixin.is, true);
  document.body.appendChild($el);

  ESLAnimateMixin.register();
  const mixin = ESLAnimateMixin.get($el) as ESLAnimateMixin;

  afterEach(() => jest.clearAllMocks());

  test('ESLAnimateMixin instance', () => {
    expect(mixin).toBeInstanceOf(ESLAnimateMixin);
    expect(ESLAnimateService.observe).toBeCalledWith($el, {cls: 'in', force: true, ratio: 0.4, repeat: false});
  });

  test('manual reanimate call', () => {
    mixin.options = {repeat: true};
    mixin.reanimate();
    expect(ESLAnimateService.observe).toBeCalledWith($el, {cls: 'in', force: true, ratio: 0.4, repeat: true});
  });

  test('disconnected callback', async () => {
    $el.toggleAttribute(ESLAnimateMixin.is);
    await Promise.resolve();
    expect(ESLAnimateService.unobserve).toBeCalled();
  });
});
