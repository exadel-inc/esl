import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/blogger';

describe(
  'ESLShare: "blogger" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "blogger" button object config matches button config',
  createButtonMatchingTestPlan('blogger', 'media')
);
