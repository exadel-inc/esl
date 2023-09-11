import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/mail';

describe(
  'ESLShare: "mail" button import appends button to config and registers the "external" action',
  createImportCheckTestPlan('external')
);

describe(
  'ESLShare: "mail" button object config matches button config',
  createButtonMatchingTestPlan('mail', 'external')
);
