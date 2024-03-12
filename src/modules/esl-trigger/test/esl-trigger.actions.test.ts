import {ESLTrigger} from '../core/esl-trigger';
import {createToggleableMock} from '../../esl-toggleable/test/toggleable.mock';

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

jest.mock('../../esl-utils/environment/device-detector', () => ({
  DeviceDetector: {
    hasHover: true
  }
}));

describe('ESLTrigger event handling', () => {
  beforeAll(() => {
    ESLTrigger.register();
    jest.useFakeTimers();
  });

  afterAll(() => jest.clearAllMocks());

  describe('Click actions', () => {
    describe('Default click tracking', () => {
      const $trigger = ESLTrigger.create();

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show)', () => {
        $trigger.click();
        expect($trigger.$target!.show).toBeCalledTimes(1);
      });

      test('toggle (hide)', () => {
        $trigger.click();
        expect($trigger.$target!.hide).toBeCalledTimes(1);
      });
    });

    describe('Click tracking disabled', () => {
      const $trigger = ESLTrigger.create();
      $trigger.trackClick = 'none';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show) disabled', () => {
        $trigger.click();
        expect($trigger.$target!.show).toBeCalledTimes(0);
      });

      test('toggle (hide) disabled', () => {
        $trigger.click();
        expect($trigger.$target!.hide).toBeCalledTimes(0);
      });
    });

    describe('Click tracking only for show actions', () => {
      const $trigger = ESLTrigger.create();
      $trigger.mode = 'show';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('click toggle (show)', () => {
        $trigger.dispatchEvent(new MouseEvent('click'));
        expect($trigger.$target!.show).toBeCalledTimes(1);
      });

      test('click toggle (hide) disabled', () => {
        $trigger.dispatchEvent(new MouseEvent('click'));
        expect($trigger.$target!.hide).toBeCalledTimes(0);
      });
    });

    describe('Click tracking only for hide actions', () => {
      const $trigger = ESLTrigger.create();
      $trigger.mode = 'hide';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (hide)', () => {
        $trigger.click();
        expect($trigger.$target!.hide).toBeCalledTimes(1);
      });

      test('toggle (show) disabled', () => {
        $trigger.click();
        expect($trigger.$target!.show).toBeCalledTimes(0);
      });
    });

    describe('Not igonred target', () => {
      const $trigger = ESLTrigger.create();
      $trigger.ignore = '';
      const $target = document.createElement('div');

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
        $trigger.append($target);});

      test('toggle (show)', () => {
        $target.click();
        expect($trigger.$target!.show).toBeCalledTimes(1);
      });

      test('toggle (hide)', () => {
        $target.click();
        expect($trigger.$target!.hide).toBeCalledTimes(1);
      });
    });

    describe('Igonred target', () => {
      const $trigger = ESLTrigger.create();
      $trigger.ignore = 'div';
      const div = document.createElement('div');

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
        $trigger.append(div);});

      test('toggle (show) ignored', () => {
        div.click();
        expect($trigger.$target!.show).toBeCalledTimes(0);
      });

      test('toggle (hide) ignored', () => {
        div.click();
        expect($trigger.$target!.hide).toBeCalledTimes(0);
      });
    });
  });

  describe('Keydown', () => {
    describe('Default behavior', () => {
      const $trigger = ESLTrigger.create();

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show)', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(1);
      });

      test('toggle (hide)', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(1);
      });
    });

    describe('Invalid key', () => {
      const $trigger = ESLTrigger.create();

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show) ignored', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'invalid'}));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(0);
      });

      test('toggle (hide) ignored', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'invalid'}));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(0);
      });
    });

    describe('Escape key tracking disabled', () => {
      const $trigger = ESLTrigger.create();
      $trigger.ignoreEsc = true;

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show) ignored', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(0);
      });

      test('toggle (hide) ignored', () => {
        $trigger.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Hover', () => {
    describe('Hover tracking enabled', () => {
      const $trigger = ESLTrigger.create();
      $trigger.trackHover = 'all';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('change event fired', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseenter'));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(1);
      });

      test('change event fired', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseleave'));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(1);
      });
    });

    describe('Hover tracking disabled', () => {
      const $trigger = ESLTrigger.create();
      $trigger.trackHover = 'none';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show) ignored', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseenter'));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(0);
      });

      test('toggle (hide) ignored', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseleave'));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(0);
      });
    });

    describe('Hover tracking with show only mode', () => {
      const $trigger = ESLTrigger.create();
      $trigger.trackHover = 'all';
      $trigger.mode = 'show';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show)', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseenter'));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(1);
      });

      test('toggle (hide) ignored', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseleave'));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(0);
      });
    });

    describe('hover tracking with hide only mode', () => {
      const $trigger = ESLTrigger.create();
      $trigger.trackHover = 'all';
      $trigger.mode = 'hide';

      beforeAll(() => {
        document.body.append($trigger);
        $trigger.$target = createToggleableMock();
      });

      test('toggle (show) ignored', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseenter'));
        expect($trigger.$target!.show).toHaveBeenCalledTimes(0);
      });

      test('toggle (hide)', () => {
        $trigger.dispatchEvent(new MouseEvent('mouseleave'));
        expect($trigger.$target!.hide).toHaveBeenCalledTimes(1);
      });
    });
  });
});
