import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/mix';

describe(
  'ESLShare: "mix" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "mix" button object config matches button config',
  createButtonMatchingTestPlan('mix', 'media')
);
