import {ESLOpenState} from '../core/esl-open-state';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLTestTemplate} from '../../esl-utils/test/template';

describe('ESLOpenState (mixin): tests', () => {

  beforeAll(() => {
    jest.useFakeTimers();

    ESLToggleable.register();
    ESLOpenState.register();
  });

  describe('ESLOpenState: general behaviour tests', () => {
    const REFERENCES = {
      origin: 'esl-toggleable#origin-tgbl'
    };
    const TEMPLATE = ESLTestTemplate.create(`
      <esl-toggleable id="origin-tgbl"></esl-toggleable>
    `, REFERENCES).bind('beforeeach');

    test('ESLOpenState with \'@+MD\' query condition', () => {
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-open-state', '@+MD');
    });
  });
});
