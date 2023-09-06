import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/print';

describe(
  'ESLShare: print button configuration',
  createButtonTestPlan('print', referenceButtons.print, 'print')
);
