import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/whatsapp';

describe(
  'ESLShare: "whatsapp" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "whatsapp" button object config matches button config',
  createButtonMatchingTestPlan('whatsapp', 'media')
);
