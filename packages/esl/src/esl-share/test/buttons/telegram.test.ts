import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/telegram';

describe(
  'ESLShare: "telegram" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "telegram" button object config matches button config',
  createButtonMatchingTestPlan('telegram', 'media')
);
