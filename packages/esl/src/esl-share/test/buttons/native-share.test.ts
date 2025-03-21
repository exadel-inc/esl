import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/native-share';

describe(
  'ESLShare: "native-share" button import appends button to config and registers the "native" action',
  createImportCheckTestPlan('native')
);

describe(
  'ESLShare: "native-share" button object config matches button config',
  createButtonMatchingTestPlan('native-share', 'native')
);
