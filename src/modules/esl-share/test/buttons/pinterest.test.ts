import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/pinterest';

describe(
  'ESLShare: pinterest button configuration',
  createButtonTestPlan('pinterest', referenceButtons.pinterest, 'media')
);
