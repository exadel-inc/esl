import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/myspace';

describe(
  'ESLShare: "myspace" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "myspace" button object config matches button config',
  createButtonMatchingTestPlan('myspace', 'media')
);
