import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/reddit';

describe(
  'ESLShare: reddit button configuration',
  createButtonTestPlan('reddit', referenceButtons.reddit, 'media')
);
