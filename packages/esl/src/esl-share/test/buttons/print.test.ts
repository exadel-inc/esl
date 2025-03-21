import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/print';

describe(
  'ESLShare: "print" button import appends button to config and registers the "print" action',
  createImportCheckTestPlan('print')
);

describe(
  'ESLShare: "print" button object config matches button config',
  createButtonMatchingTestPlan('print', 'print')
);
