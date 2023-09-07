import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/pinterest';

describe(
  'ESLShare: "pinterest" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "pinterest" button object config matches button config',
  createButtonMatchingTestPlan('pinterest', 'media')
);
