import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/skype';

describe(
  'ESLShare: "skype" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "skype" button object config matches button config',
  createButtonMatchingTestPlan('skype', 'media')
);
