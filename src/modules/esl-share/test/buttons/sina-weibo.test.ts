import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/sina-weibo';

describe(
  'ESLShare: sina-weibo button configuration',
  createButtonTestPlan('sina-weibo', referenceButtons['sina-weibo'], 'media')
);
