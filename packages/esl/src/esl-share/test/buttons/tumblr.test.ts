import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/tumblr';

describe(
  'ESLShare: "tumblr" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "tumblr" button object config matches button config',
  createButtonMatchingTestPlan('tumblr', 'media')
);
