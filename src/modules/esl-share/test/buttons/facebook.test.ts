import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/facebook';

describe(
  'ESLShare: facebook button configuration',
  createButtonTestPlan('facebook', referenceButtons.facebook, 'media')
);
