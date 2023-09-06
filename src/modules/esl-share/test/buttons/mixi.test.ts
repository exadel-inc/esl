import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/mixi';

describe(
  'ESLShare: mixi button configuration',
  createButtonTestPlan('mixi', referenceButtons.mixi, 'media')
);
