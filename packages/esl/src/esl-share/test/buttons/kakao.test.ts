import {createImportCheckTestPlan, createButtonMatchingTestPlan} from './button-test-plan-factory';

import '../../buttons/kakao';

describe(
  'ESLShare: "kakao" button import appends button to config and registers the "media" action',
  createImportCheckTestPlan('media')
);

describe(
  'ESLShare: "kakao" button object config matches button config',
  createButtonMatchingTestPlan('kakao', 'media')
);
