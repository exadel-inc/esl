import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/line';

describe(
  'ESLShare: line button configuration',
  createButtonTestPlan('line', referenceButtons.line, 'media')
);
