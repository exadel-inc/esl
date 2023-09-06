import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/mix';

describe(
  'ESLShare: mix button configuration',
  createButtonTestPlan('mix', referenceButtons.mix, 'media')
);
