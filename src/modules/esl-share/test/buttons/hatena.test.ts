import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/hatena';

describe(
  'ESLShare: hatena button configuration',
  createButtonTestPlan('hatena', referenceButtons.hatena, 'media')
);
