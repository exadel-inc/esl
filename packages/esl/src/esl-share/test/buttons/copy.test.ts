import {ESLShareConfig} from '../../core/esl-share-config';
import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/copy';

describe(
  'ESLShare: "copy" button import appends button to config and registers the "copy" action',
  createImportCheckTestPlan('copy')
);

describe(
  'ESLShare: "copy" button object config matches button config',
  createButtonMatchingTestPlan('copy', 'copy')
);

describe('ESLShare: "copy" button has specific unique properties', () => {
  test('button from config has additional property', () => {
    expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('additional');
  });
});
