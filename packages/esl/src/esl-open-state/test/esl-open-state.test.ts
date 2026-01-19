import {ESLOpenState} from '../core';
import {ESLToggleable} from '../../esl-toggleable/core';
import {getMatchMediaMock} from '../../test/matchMedia.mock';

// TODO: consider as default jest loader
vi.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (clb: any) => clb()
}));

describe('ESLOpenState (mixin): tests', () => {
  const TEST_MQ = '(min-width: 500px)';
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());

  beforeAll(async () => {
    vi.useFakeTimers();

    ESLToggleable.register();
    ESLOpenState.register();

    await ESLToggleable.registered;
  });

  beforeEach(() => document.body.innerHTML = '');

  test('ESLOpenState initialize correctly', async () => {
    const $el = ESLToggleable.create();
    $el.setAttribute(ESLOpenState.is, 'not all');
    document.body.append($el);
    await microtaskQueue();
    expect(ESLOpenState.get($el)).toEqual(expect.any(ESLOpenState));
  });

  test('ESLOpenState set up initial closed state if query is falsy', async () => {
    const $el = ESLToggleable.create();
    const hideSpy = vi.spyOn($el, 'hide');
    $el.setAttribute(ESLOpenState.is, 'not all');
    document.body.append($el);
    await microtaskQueue();
    expect(hideSpy).toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));
  });

  test('ESLOpenState set up initial open state if query is active', async () => {
    const $el = ESLToggleable.create();
    const showSpy = vi.spyOn($el, 'show');
    $el.setAttribute(ESLOpenState.is, 'all');
    document.body.append($el);
    await microtaskQueue();
    expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));
  });

  test('ESLOpenState calls ESLTogleable\'s show on media query activation', async () => {
    const $el = ESLToggleable.create();
    const showSpy = vi.spyOn($el, 'show');
    getMatchMediaMock(TEST_MQ).set(false);
    $el.setAttribute(ESLOpenState.is, TEST_MQ);
    document.body.append($el);
    await microtaskQueue();
    expect(showSpy).not.toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));

    getMatchMediaMock(TEST_MQ).set(true);
    expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));
  });

  test('ESLOpenState calls ESLTogleable\'s hide on media query deactivation', async () => {
    const $el = ESLToggleable.create();
    const hideSpy = vi.spyOn($el, 'hide');
    getMatchMediaMock(TEST_MQ).set(true);
    $el.setAttribute('open', '');
    $el.setAttribute(ESLOpenState.is, TEST_MQ);
    document.body.append($el);
    await microtaskQueue();
    expect(hideSpy).not.toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));

    getMatchMediaMock(TEST_MQ).set(false);
    expect(hideSpy).toHaveBeenCalledWith(expect.objectContaining({initiator: ESLOpenState.is}));
  });
});
