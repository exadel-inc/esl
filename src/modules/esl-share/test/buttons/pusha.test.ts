import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/pusha';

describe(
  'ESLShare: "pusha" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "pusha" button object config matches button config',
  createButtonMatchingTestPlan('pusha', 'media')
);
