import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/viber';

describe(
  'ESLShare: "viber" button import appends button to config and registers the "external" action',
  createImportCheckTestPlan('external')
);

describe(
  'ESLShare: "viber" button object config matches button config',
  createButtonMatchingTestPlan('viber', 'external')
);
