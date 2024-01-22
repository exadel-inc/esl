import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/twitter';

describe(
  'ESLShare: "twitter" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "twitter" button object config matches button config',
  createButtonMatchingTestPlan('twitter', 'media')
);
