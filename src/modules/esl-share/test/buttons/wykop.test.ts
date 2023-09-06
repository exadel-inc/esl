import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/wykop';

describe(
  'ESLShare: wykop button configuration',
  createButtonTestPlan('wykop', referenceButtons.wykop, 'media')
);
