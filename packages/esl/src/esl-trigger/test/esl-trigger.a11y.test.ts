import {ESLTrigger} from '../core/esl-trigger';
import {createToggleableMock} from '../../esl-toggleable/test/toggleable.mock';

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('esl-trigger a11y attributes test', () => {
  const LABEL_ATTR = 'aria-label';

  beforeAll(() => ESLTrigger.register());

  afterAll(() => jest.clearAllMocks());

  describe(
    'a11yTarget attribute basic tests',
    () => {
      test(
        'default a11y target',
        () => {
          const trigger = ESLTrigger.create();
          trigger.$target = createToggleableMock();
          document.body.append(trigger);

          expect(trigger.getAttribute('role')).toBe('button');
          expect(trigger.getAttribute('tabindex')).toBe('0');
        }
      );

      test(
        'invalid a11y target',
        () => {
          const trigger = ESLTrigger.create();
          trigger.$target = createToggleableMock();
          trigger.a11yTarget = 'invalid';
          document.body.append(trigger);
          trigger.$target?.show();

          expect(trigger.getAttribute('role')).toBe(null);
          expect(trigger.getAttribute('tabindex')).toBe(null);
          expect(trigger.getAttribute('aria-controls')).toBe(null);
        }
      );
    }
  );

  describe(
    'a11y attributes',
    () => {
      describe(
        '"aria-controls" a11y attributes',
        () => {
          const trigger = ESLTrigger.create();
          trigger.$target = createToggleableMock();
          const controlId = 'test-control';

          beforeAll(() => {
            document.body.append(trigger);
            Object.assign(trigger.$target!, {id: controlId});
          });

          test(
            '"aria-controls" attribute should be set if target`s id is specified',
            () => {
              trigger.$target?.show();
              expect(trigger.getAttribute('aria-controls')).toBe(controlId);
            }
          );
        }
      );

      describe(
        '"aria-expanded" a11y attributes',
        () => {
          const trigger = ESLTrigger.create();

          beforeAll(() => {
            document.body.append(trigger);
            trigger.$target = createToggleableMock();
          });

          test(
            '"aria-expanded" should be false by default',
            () => expect(trigger.getAttribute('aria-expanded')).toBe('false')
          );

          test(
            '"aria-expanded" should be true on open',
            () => {
              trigger.$target?.show();
              expect(trigger.getAttribute('aria-expanded')).toBe('true');
            }
          );
        }
      );

      describe(
        'a11yLabelActive attribute basic tests',
        () => {
          const trigger = ESLTrigger.create();

          beforeAll(() => {
            trigger.a11yLabelActive = 'active';
            trigger.$target = createToggleableMock();
            document.body.append(trigger);
          });

          test(
            'a11y label getter should return null by default',
            () => expect(ESLTrigger.create().a11yLabel).toBeNull()
          );

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
            trigger.$target = createToggleableMock();
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
            trigger.$target = createToggleableMock({open: true}); // Calling `$target` before appending to DOM will not execute
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
    }
  );
});
