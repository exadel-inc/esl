import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/mixi';

describe(
  'ESLShare: "mixi" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "mixi" button object config matches button config',
  createButtonMatchingTestPlan('mixi', 'media')
);
