import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/linkedin';

describe(
  'ESLShare: "linkedin" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "linkedin" button object config matches button config',
  createButtonMatchingTestPlan('linkedin', 'media')
);
