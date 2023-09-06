import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/blogger';

describe(
  'ESLShare: blogger button configuration',
  createButtonTestPlan('blogger', referenceButtons.blogger, 'media')
);
