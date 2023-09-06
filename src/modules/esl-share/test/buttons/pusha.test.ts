import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/pusha';

describe(
  'ESLShare: pusha button configuration',
  createButtonTestPlan('pusha', referenceButtons.pusha, 'media')
);
