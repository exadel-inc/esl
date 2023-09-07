import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/wykop';

describe(
  'ESLShare: "wykop" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "wykop" button object config matches button config',
  createButtonMatchingTestPlan('wykop', 'media')
);
