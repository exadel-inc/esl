import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/sina-weibo';

describe(
  'ESLShare: "sina-weibo" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "sina-weibo" button object config matches button config',
  createButtonMatchingTestPlan('sina-weibo', 'media')
);
