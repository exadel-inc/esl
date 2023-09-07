import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/reddit';

describe(
  'ESLShare: "reddit" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "reddit" button object config matches button config',
  createButtonMatchingTestPlan('reddit', 'media')
);
