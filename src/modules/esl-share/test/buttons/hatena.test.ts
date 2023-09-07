import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/hatena';

describe(
  'ESLShare: "hatena" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "hatena" button object config matches button config',
  createButtonMatchingTestPlan('hatena', 'media')
);
