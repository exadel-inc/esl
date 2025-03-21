import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/facebook';

describe(
  'ESLShare: "facebook" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "facebook" button object config matches button config',
  createButtonMatchingTestPlan('facebook', 'media')
);
