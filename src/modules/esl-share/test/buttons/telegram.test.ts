import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/telegram';

describe(
  'ESLShare: telegram button configuration',
  createButtonTestPlan('telegram', referenceButtons.telegram, 'media')
);
