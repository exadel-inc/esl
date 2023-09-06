import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/copy';

describe(
  'ESLShare: copy button configuration',
  createButtonTestPlan('copy', referenceButtons.copy, 'copy')
);
