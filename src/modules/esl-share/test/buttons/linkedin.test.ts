import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/linkedin';

describe(
  'ESLShare: linkedin button configuration',
  createButtonTestPlan('linkedin', referenceButtons.linkedin, 'media')
);
