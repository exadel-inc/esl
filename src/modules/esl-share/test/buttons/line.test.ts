import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/line';

describe(
  'ESLShare: "line" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "line" button object config matches button config',
  createButtonMatchingTestPlan('line', 'media')
);
