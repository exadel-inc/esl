import '../../../polyfills/es5-target-shim';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {ESLTrigger} from '../core/esl-trigger';
import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

function createTargetMock(init: Partial<ESLToggleable> = {}): ESLToggleable {
  const et = new SyntheticEventTarget();
  return Object.assign(et, {
    show: jest.fn(function () {
      this.open = true;
      ESLEventUtils.dispatch(this, 'esl:show');
    }),
    hide: jest.fn(function () {
      this.open = false;
      ESLEventUtils.dispatch(this, 'esl:hide');
    }),
    open: false
  }, init) as any;
}

describe('esl-trigger a11y attributes test', () => {
  const LABEL_ATTR = 'aria-label';

  beforeAll(() => {
    ESLTrigger.register();
  });

  describe(
    'a11yLabelActive attribute basic tests',
    () => {
      const trigger = ESLTrigger.create();

      beforeAll(() => {
        trigger.a11yLabelActive = 'active';
        document.body.append(trigger);
        trigger.$target = createTargetMock();
      });

      test(
        '"aria-label" should be empty in initial state',
        () => expect(trigger.getAttribute(LABEL_ATTR)).toBeNull()
      );

      test(
        '"aria-label" should be set to `a11yLabelActive` value when target becomes active',
        () => {
          trigger.$target?.show();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe('active');
        }
      );

      test(
        '"aria-label" should be empty after the target becomes inactive',
        () => {
          trigger.$target?.hide();
          expect(trigger.getAttribute(LABEL_ATTR)).toBeNull();
        }
      );

      afterAll(() => document.body.removeChild(trigger));
    }
  );

  describe(
    'a11yLabelInactive attribute basic tests',
    () => {
      const trigger = ESLTrigger.create();

      beforeAll(() => {
        trigger.a11yLabelInactive = 'inactive';
        document.body.append(trigger);
        trigger.$target = createTargetMock();
      });

      test(
        '"aria-label" should be set to a11yLabelInactive in initial state',
        () => expect(trigger.getAttribute(LABEL_ATTR)).toBe('inactive')
      );

      test(
        '"aria-label" should be empty when target becomes active',
        () => {
          trigger.$target?.show();
          expect(trigger.getAttribute(LABEL_ATTR)).toBeNull();
        }
      );

      test(
        '"aria-label" should be set to a11yLabelInactive after the target becomes inactive',
        () => {
          trigger.$target?.hide();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe('inactive');
        }
      );

      afterAll(() => document.body.removeChild(trigger));
    }
  );

  // TODO: split on separate tests for initial state and test for attributes conflict
  describe(
    'a11yLabelActive and a11yLabelInactive are both present (+ initially active flow)',
    () => {
      const trigger = ESLTrigger.create();

      beforeAll(() => {
        trigger.a11yLabelActive = 'active';
        trigger.a11yLabelInactive = 'inactive';
        document.body.append(trigger);
        trigger.$target = createTargetMock({open: true});
      });

      test(
        '"aria-label" should be set to a11yLabelActive in initial state for initially active target',
        () => expect(trigger.getAttribute(LABEL_ATTR)).toBe('active')
      );
      test(
        '"aria-label" should be set to a11yLabelInactive after the target becomes inactive',
        () => {
          trigger.$target?.hide();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe('inactive');
        }
      );
      test(
        '"aria-label" should be set to a11yLabelActive when target becomes active',
        () => {
          trigger.$target?.show();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe('active');
        }
      );

      afterAll(() => document.body.removeChild(trigger));
    }
  );

  describe(
    'a11yLabelInactive and a11yLabelActive attributes are not specified',
    () => {
      const INIT_VAL = 'test-init-val';
      const trigger = ESLTrigger.create();

      beforeAll(() => {
        trigger.setAttribute(LABEL_ATTR, INIT_VAL);
        document.body.append(trigger);
        trigger.$target = createTargetMock();
      });

      test(
        '"aria-label" should have initial value on start',
        () => expect(trigger.getAttribute(LABEL_ATTR)).toBe(INIT_VAL)
      );

      test(
        '"aria-label" should have initial value when target becomes active',
        () => {
          trigger.$target?.show();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe(INIT_VAL);
        }
      );

      test(
        '"aria-label" should have initial value after the target becomes inactive',
        () => {
          trigger.$target?.hide();
          expect(trigger.getAttribute(LABEL_ATTR)).toBe(INIT_VAL);
        }
      );

      afterAll(() => document.body.removeChild(trigger));
    }
  );
});
