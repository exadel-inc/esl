import {ESLTrigger} from '../core/esl-trigger';
import {createToggleableMock} from '../../esl-toggleable/test/toggleable.mock';

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLTrigger find target according to the query in target attribute', () => {
  ESLTrigger.register();
  const $trigger = ESLTrigger.create();

  beforeEach(() => {
    $trigger.$target = createToggleableMock();
    document.body.append($trigger);
    document.body.append($trigger.$target);
  });
  afterEach(() => {
    jest.resetAllMocks();
    $trigger.remove();
    $trigger.$target?.remove();
  });

  test('trigger does not active marker initially', () => {
    expect($trigger.hasAttribute('active')).toBe(false);
  });

  test('trigger active appears on target activation', () => {
    $trigger.$target?.show();
    expect($trigger.hasAttribute('active')).toBe(true);
  });

  test('trigger active disappears on target deactivation', () => {
    $trigger.$target?.show();
    $trigger.$target?.hide();
    expect($trigger.hasAttribute('active')).toBe(false);
  });

  describe('active class support', () => {
    beforeEach(() => {
      $trigger.activeClass = '';
      $trigger.activeClassTarget = '';
    });

    test('trigger does not active class initially', () => {
      $trigger.activeClass = 'active';
      expect($trigger.classList.contains('active')).toBe(false);
    });

    test('trigger active class appears on target activation', () => {
      $trigger.activeClass = 'active';
      $trigger.$target?.show();
      expect($trigger.classList.contains('active')).toBe(true);
    });

    test('trigger active class disappears on target deactivation', () => {
      $trigger.activeClass = 'active';
      $trigger.$target?.show();
      $trigger.$target?.hide();
      expect($trigger.classList.contains('active')).toBe(false);
    });

    test('trigger active class supports inversion', () => {
      $trigger.activeClass = '!inactive';
      $trigger.$target?.hide();
      expect($trigger.classList.contains('inactive')).toBe(true);
      $trigger.$target?.show();
      expect($trigger.classList.contains('inactive')).toBe(false);
    });

    test('trigger active class supports custom target', () => {
      $trigger.activeClass = 'active';
      $trigger.activeClassTarget = 'body';
      $trigger.$target?.show();
      expect(document.body.classList.contains('active')).toBe(true);
    });

    test('trigger active class supports relative custom target', () => {
      const $div = document.createElement('div');
      $trigger.activeClass = 'active';
      $trigger.activeClassTarget = '::next';
      $trigger.insertAdjacentElement('afterend', $div);

      $trigger.$target?.show();
      expect($div.classList.contains('active')).toBe(true);
    });
  });
});
