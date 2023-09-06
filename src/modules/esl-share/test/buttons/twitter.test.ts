import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/twitter';

describe(
  'ESLShare: twitter button configuration',
  createButtonTestPlan('twitter', referenceButtons.twitter, 'media')
);
